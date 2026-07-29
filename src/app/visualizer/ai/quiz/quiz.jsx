"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const AIAlgorithmsQuiz = () => {
  const questions = [
    {
      question: "In the A* search algorithm, the evaluation function f(n) is defined as f(n) = g(n) + h(n). What does h(n) represent?",
      options: [
        "The exact cost to reach the goal node from node n",
        "The cost from the start node to node n",
        "A heuristic estimate of the cost from node n to the goal node",
        "The total number of nodes expanded so far"
      ],
      correctAnswer: 2,
      explanation: "In A*, h(n) is the heuristic function that estimates the cheapest path from the current node n to the goal. g(n) is the exact cost from the start node to n."
    },
    {
      question: "Which of the following conditions must a heuristic function satisfy for A* to be guaranteed to find the optimal path?",
      options: [
        "It must be admissible (never overestimate the true cost)",
        "It must be non-negative",
        "It must overestimate the cost to ensure quick convergence",
        "It must return a random value"
      ],
      correctAnswer: 0,
      explanation: "An admissible heuristic never overestimates the actual cost to reach the goal, ensuring that A* will find the shortest path."
    },
    {
      question: "What type of environment is the Minimax algorithm primarily designed for?",
      options: [
        "Single-player puzzle games",
        "Deterministic, two-player, zero-sum games",
        "Games with hidden information (like Poker)",
        "Cooperative multiplayer games"
      ],
      correctAnswer: 1,
      explanation: "Minimax is used for two-player adversarial games where one player's gain is the other player's loss (zero-sum), such as Chess or Tic-Tac-Toe."
    },
    {
      question: "In a Minimax game tree, what is the goal of the 'Maximizing' player?",
      options: [
        "To choose the child node with the lowest possible evaluation score",
        "To explore as many nodes as possible",
        "To choose the child node with the highest possible evaluation score",
        "To prevent the game from reaching a terminal state"
      ],
      correctAnswer: 2,
      explanation: "The Maximizing player tries to maximize their own score, hence they always pick the path that leads to the highest evaluated score."
    },
    {
      question: "What is the primary purpose of Alpha-Beta Pruning?",
      options: [
        "To replace the Minimax algorithm with a faster, approximate heuristic",
        "To eliminate branches in the game tree that cannot possibly influence the final decision",
        "To evaluate terminal nodes more accurately",
        "To allow Minimax to work in games with chance (like dice rolls)"
      ],
      correctAnswer: 1,
      explanation: "Alpha-Beta Pruning avoids evaluating branches of the game tree that are proven to be worse than previously examined branches, improving efficiency without changing the final result."
    },
    {
      question: "During Alpha-Beta Pruning, what do the 'Alpha' and 'Beta' values represent?",
      options: [
        "Alpha is the best value for the minimizer; Beta is the best value for the maximizer",
        "Alpha is the best value for the maximizer; Beta is the best value for the minimizer",
        "Alpha is the maximum depth; Beta is the current depth",
        "Alpha is the number of pruned nodes; Beta is the number of evaluated nodes"
      ],
      correctAnswer: 1,
      explanation: "Alpha is the highest value the maximizing player can guarantee, while Beta is the lowest value the minimizing player can guarantee."
    },
    {
      question: "Under which condition does Alpha-Beta pruning cut off a branch?",
      options: [
        "When Alpha < Beta",
        "When Alpha >= Beta",
        "When the depth limit is reached",
        "When the evaluation function returns 0"
      ],
      correctAnswer: 1,
      explanation: "A branch is pruned when Alpha >= Beta, because it means the current player already has a better guaranteed alternative elsewhere, so the current path will never be chosen."
    },
    {
      question: "Which of the following is NOT one of the four main phases of Monte Carlo Tree Search (MCTS)?",
      options: [
        "Selection",
        "Expansion",
        "Simulation (Playout)",
        "Heuristic Evaluation"
      ],
      correctAnswer: 3,
      explanation: "The four phases of MCTS are Selection, Expansion, Simulation (Playout), and Backpropagation. It does not strictly require a domain-specific heuristic evaluation function."
    },
    {
      question: "In the Selection phase of MCTS, what formula is commonly used to balance exploration and exploitation?",
      options: [
        "Minimax Evaluation",
        "Upper Confidence Bound for Trees (UCT)",
        "A* Heuristic",
        "Bellman Equation"
      ],
      correctAnswer: 1,
      explanation: "UCT (Upper Confidence Bound applied to Trees) is used to decide whether to exploit nodes that have a high win rate or explore nodes that haven't been visited often."
    },
    {
      question: "What happens during the Backpropagation phase of MCTS?",
      options: [
        "The game state is reset to the root node",
        "Neural network weights are updated using gradient descent",
        "The result of the simulation (win/loss/draw) is propagated up the tree to update the statistics of all visited nodes",
        "The algorithm prunes nodes with poor performance"
      ],
      correctAnswer: 2,
      explanation: "During backpropagation, the outcome of the simulation is sent back up the path to the root, updating the visit count and win/loss record of each node along the way."
    }
  ];

  return <QuizEngine title="AI Algorithms Quiz" questions={questions} />;
};

export default AIAlgorithmsQuiz;
