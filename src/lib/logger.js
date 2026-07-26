/**
 * logger.js
 *
 * Centralized structured logging utility for AlgoBuddy server-side modules.
 * Built on top of pino for high-performance JSON-structured log output.
 *
 * Usage (ESM):
 *   import logger from "@/lib/logger";
 *   import { createLogger } from "@/lib/logger";
 *   const log = createLogger("my-module");
 *   log.info("Server started");
 *   log.warn({ userId }, "Rate limit approaching");
 *   log.error({ err }, "Unhandled exception");
 *
 * Usage (CJS):
 *   const { createLogger } = require("../logger");
 *   const log = createLogger("sandbox");
 *
 * Log Levels (lowest → highest severity):
 *   trace  → very verbose debugging
 *   debug  → debugging details (disabled in production by default)
 *   info   → general operational events
 *   warn   → unexpected but recoverable situations
 *   error  → failures requiring attention
 *   fatal  → unrecoverable crashes
 *
 * The active log level is controlled by the LOG_LEVEL environment variable.
 * Defaults to "debug" in development and "info" in production.
 *
 * In production, logs are emitted as newline-delimited JSON (NDJSON).
 * In development, pino-pretty formatting is applied when available,
 * otherwise falling back to clean readable text output.
 */

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

let pino;
try {
  pino = require("pino");
} catch {
  pino = null;
}

// ─────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────

const IS_PRODUCTION = process.env.NODE_ENV === "production";

/** Active log level — override via LOG_LEVEL env var */
const LOG_LEVEL = process.env.LOG_LEVEL ?? (IS_PRODUCTION ? "info" : "debug");

// ─────────────────────────────────────────────────────────────
// Base logger instance
// ─────────────────────────────────────────────────────────────

function createConsoleFallbackLogger(context = {}) {
  const log = (level, arg1, arg2, ...rest) => {
    let bindings = {};
    let msg = arg1;
    if (typeof arg1 === "object" && arg1 !== null && !(arg1 instanceof Error)) {
      bindings = arg1;
      msg = arg2;
    } else if (arg1 instanceof Error) {
      bindings = { err: { message: arg1.message, name: arg1.name, stack: arg1.stack } };
      msg = arg2 || arg1.message;
    }

    const payload = {
      level,
      time: new Date().toISOString(),
      env: process.env.NODE_ENV ?? "development",
      ...context,
      ...bindings,
      msg: msg ?? "",
    };

    const str = JSON.stringify(payload);
    if (level === "error" || level === "fatal") {
      console.error(str, ...rest);
    } else if (level === "warn") {
      console.warn(str, ...rest);
    } else {
      console.log(str, ...rest);
    }
  };

  return {
    level: LOG_LEVEL,
    trace: (...args) => log("trace", ...args),
    debug: (...args) => log("debug", ...args),
    info: (...args) => log("info", ...args),
    warn: (...args) => log("warn", ...args),
    error: (...args) => log("error", ...args),
    fatal: (...args) => log("fatal", ...args),
    child: (bindings) => createConsoleFallbackLogger({ ...context, ...bindings }),
  };
}

let baseLogger;
if (pino) {
  let prettyTransport;
  if (!IS_PRODUCTION) {
    try {
      require.resolve("pino-pretty");
      prettyTransport = {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:HH:MM:ss",
          ignore: "pid,hostname,env",
          messageFormat: "[{module}] {msg}",
        },
      };
    } catch {
      // pino-pretty not installed — use default JSON output
    }
  }

  baseLogger = pino({
    level: LOG_LEVEL,
    base: {
      env: process.env.NODE_ENV ?? "development",
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    serializers: {
      err: pino.stdSerializers.err,
      error: pino.stdSerializers.err,
    },
    transport: prettyTransport,
  });
} else {
  baseLogger = createConsoleFallbackLogger();
}

// ─────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────

/**
 * Create a child logger scoped to a specific module or subsystem.
 * The module name is added as a permanent "module" field on every log line
 * emitted by this child, making it easy to filter in production.
 *
 * @param {string} moduleName - e.g. "sandbox", "rateLimit", "auth"
 * @returns {import("pino").Logger}
 */
export function createLogger(moduleName) {
  return baseLogger.child({ module: moduleName });
}

/**
 * Default root logger — use this when you don't need per-module scoping.
 * Prefer createLogger() for new modules to keep logs filterable.
 */
export default baseLogger;
