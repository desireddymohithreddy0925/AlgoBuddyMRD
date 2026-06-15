require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowed = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://algobuddy.vercel.app",
        "https://www.algobuddy.me",
        "https://algobuddy.me"
      ];
      if (allowed.includes(origin) || origin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 4000;

// JWT Authentication
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;

function verifyAuthToken(token) {
  if (!token || !SUPABASE_JWT_SECRET) return null;
  try {
    const decoded = jwt.verify(token, SUPABASE_JWT_SECRET, { algorithms: ["HS256"] });
    return decoded;
  } catch (err) {
    return null;
  }
}

// Connection rate limiting to prevent JWT brute-forcing
const connectionAttempts = new Map();
const MAX_CONNECTION_ATTEMPTS = 5;
const CONNECTION_ATTEMPT_WINDOW_MS = 60000;

function isConnectionRateLimited(ip) {
  const now = Date.now();
  const entry = connectionAttempts.get(ip);
  if (!entry || now > entry.resetTime) {
    connectionAttempts.set(ip, { count: 1, resetTime: now + CONNECTION_ATTEMPT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > MAX_CONNECTION_ATTEMPTS;
}

// State Tracking
let matchmakingQueue = [];
const activeMatches = new Map(); // matchId -> match Details
const socketToMatch = new Map(); // socketId -> matchId

// Rate Limiting (Token Bucket per socket)
const rateLimits = new Map(); // socketId -> { lastRequestTime, tokens }
const MAX_TOKENS = 10;
const REFILL_RATE_MS = 200; // 1 token every 200ms

function isRateLimited(socketId) {
  const now = Date.now();
  if (!rateLimits.has(socketId)) {
    rateLimits.set(socketId, { lastRequestTime: now, tokens: MAX_TOKENS - 1 });
    return false;
  }
  
  const limit = rateLimits.get(socketId);
  const timePassed = now - limit.lastRequestTime;
  const tokensToAdd = Math.floor(timePassed / REFILL_RATE_MS);
  
  if (tokensToAdd > 0) {
    limit.tokens = Math.min(MAX_TOKENS, limit.tokens + tokensToAdd);
    limit.lastRequestTime = now;
  }
  
  if (limit.tokens > 0) {
    limit.tokens--;
    return false;
  }
  return true;
}

io.on("connection", (socket) => {
  // Connection-level rate limiting to prevent JWT brute-forcing
  const clientIp = socket.handshake.address;
  if (isConnectionRateLimited(clientIp)) {
    socket.emit("error", { message: "Too many connection attempts. Please try again later." });
    socket.disconnect(true);
    return;
  }

  // Verify Supabase JWT from handshake auth
  const token = socket.handshake.auth?.token;
  const authPayload = verifyAuthToken(token);
  if (!authPayload) {
    socket.emit("error", { message: "Authentication required. Please sign in again." });
    socket.disconnect(true);
    return;
  }

  // Store verified userId from the JWT payload — never trust client-supplied userId
  socket.data.userId = authPayload.sub || authPayload.id;
  console.log(`Authenticated user connected: ${socket.id}, userId: ${socket.data.userId}`);

  socket.on("join_matchmaking", (data) => {
    if (isRateLimited(socket.id)) return;
    
    console.log(`User joined matchmaking: userId=${socket.data.userId}`);
    const targetTopic = data.topic || "Arrays";
    const targetDifficulty = data.difficulty || "Easy";

    // Remove any existing entry for this user to prevent duplicate queueing
    // Use server-verified userId instead of client-supplied data.userId
    matchmakingQueue = matchmakingQueue.filter(
      (p) => p.userId !== socket.data.userId && p.socketId !== socket.id
    );

    // Filter queue to find exact match
    const matchIndex = matchmakingQueue.findIndex(
      (p) => p.topic === targetTopic && p.difficulty === targetDifficulty && p.userId !== socket.data.userId
    );

    if (matchIndex !== -1) {
      // Match found!
      const opponent = matchmakingQueue.splice(matchIndex, 1)[0];
      console.log(`Match found: ${opponent.userId} vs ${socket.data.userId}`);
      
      const matchId = `match-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const matchDetails = {
        matchId,
        topic: targetTopic,
        difficulty: targetDifficulty,
        status: "in-progress",
        players: [
          { userId: opponent.userId, name: opponent.name, socketId: opponent.socketId },
          { userId: socket.data.userId, name: data.name || "Player", socketId: socket.id },
        ],
      };

      // Save to active matches state
      activeMatches.set(matchId, matchDetails);
      socketToMatch.set(socket.id, matchId);
      socketToMatch.set(opponent.socketId, matchId);

      // Notify both players
      io.to(opponent.socketId).emit("match_found", matchDetails);
      io.to(socket.id).emit("match_found", matchDetails);

      // Join room for real-time duel syncing
      socket.join(matchId);
      const opponentSocket = io.sockets.sockets.get(opponent.socketId);
      if (opponentSocket) opponentSocket.join(matchId);

    } else {
      // Add to queue with specific preferences
      matchmakingQueue.push({ userId: socket.data.userId, name: data.name || "Player", rating: data.rating, level: data.level, topic: targetTopic, difficulty: targetDifficulty, socketId: socket.id });
      console.log(`Added to queue. Queue length: ${matchmakingQueue.length}`);
    }
  });

  socket.on("leave_matchmaking", () => {
    if (isRateLimited(socket.id)) return;
    matchmakingQueue = matchmakingQueue.filter((p) => p.socketId !== socket.id);
  });

  socket.on("join_match", (data) => {
    // Verify the socket is a participant in the match before allowing room join
    const matchId = socketToMatch.get(socket.id);
    if (!matchId || matchId !== data.matchId) return;
    socket.join(data.matchId);
  });

  // Duel Room Events
  socket.on("code_update", (data) => {
    if (isRateLimited(socket.id)) return;
    // Broadcast code to opponent in the same room
    socket.to(data.matchId).emit("opponent_code_update", {
      code: data.code,
      userId: socket.data.userId
    });
  });

  socket.on("test_submit", (data) => {
    if (isRateLimited(socket.id)) return;
    socket.to(data.matchId).emit("opponent_test_submit", { userId: socket.data.userId });
  });

  socket.on("test_result", (data) => {
    if (isRateLimited(socket.id)) return;
    
    // Security: Validate the user is part of the active match before trusting the result broadcast
    const matchId = socketToMatch.get(socket.id);
    if (!matchId || matchId !== data.matchId) return;

    socket.to(data.matchId).emit("opponent_test_result", {
      userId: socket.data.userId,
      passed: data.passed,
      total: data.total,
      status: data.status
    });
  });

  socket.on("match_complete", (data) => {
    if (isRateLimited(socket.id)) return;
    
    // Security check: Only allow match end if coming from an active match participant
    const matchId = socketToMatch.get(socket.id);
    if (!matchId || matchId !== data.matchId) return;
    
    const match = activeMatches.get(matchId);
    if (match && match.status !== "completed") {
      match.status = "completed";
      // Use server-verified userId as winner — ignore client-supplied winnerId
      io.in(matchId).emit("match_ended", { winnerId: socket.data.userId });
      
      // Cleanup match state
      match.players.forEach(p => socketToMatch.delete(p.socketId));
      activeMatches.delete(matchId);
    }
  });

  socket.on("disconnect", () => {
    // 1. Remove from matchmaking queue if present
    matchmakingQueue = matchmakingQueue.filter((p) => p.socketId !== socket.id);
    
    // 2. Handle active match disconnects
    const matchId = socketToMatch.get(socket.id);
    if (matchId) {
      const match = activeMatches.get(matchId);
      if (match && match.status !== "completed") {
        match.status = "completed";
        // Find opponent and declare them the winner by default
        const opponent = match.players.find(p => p.socketId !== socket.id);
        if (opponent) {
          io.to(opponent.socketId).emit("opponent_disconnected", { winnerId: opponent.userId });
        }
        
        // Cleanup
        match.players.forEach(p => socketToMatch.delete(p.socketId));
        activeMatches.delete(matchId);
      }
    }
    
    rateLimits.delete(socket.id);
    console.log(`User disconnected: ${socket.id}. Queue length: ${matchmakingQueue.length}`);
  });
});

app.get("/debug", (req, res) => {
  res.json({
    queueLength: matchmakingQueue.length,
    activeMatchesCount: activeMatches.size,
    queue: matchmakingQueue,
    activeConnections: io.engine.clientsCount
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "Arena Socket Server is running" });
});

server.listen(PORT, () => {
  console.log(`Arena Socket Server running on port ${PORT}`);
});
