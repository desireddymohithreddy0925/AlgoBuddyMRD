"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is Tail Recursion?",
    options: [
      "A recursion where the recursive call is the last operation",
      "A recursion with multiple recursive calls",
      "A recursion without a base case",
      "A recursion that uses loops",
    ],
    correctAnswer: 0,
    explanation:
      "In tail recursion, the recursive call is the final operation before the function returns.",
  },
  {
    question: "Which statement is true about Tail Recursion?",
    options: [
      "The recursive call is the last statement executed",
      "The recursive call happens before all computations",
      "There are two recursive calls",
      "It never needs a base case",
    ],
    correctAnswer: 0,
    explanation:
      "Tail recursion performs no computation after the recursive call returns.",
  },
  {
    question: "Why is Tail Recursion considered efficient?",
    options: [
      "It always runs in O(1) time",
      "It can be optimized into iteration by some compilers",
      "It never uses memory",
      "It avoids recursion completely",
    ],
    correctAnswer: 1,
    explanation:
      "Some compilers perform Tail Call Optimization (TCO), reducing stack usage.",
  },
  {
    question: "What is Tail Call Optimization (TCO)?",
    options: [
      "Converting recursion into iteration",
      "Sorting recursively",
      "Reducing time complexity to O(1)",
      "Removing the base case",
    ],
    correctAnswer: 0,
    explanation:
      "Tail Call Optimization allows a compiler to reuse the current stack frame.",
  },
  {
    question: "Which function is tail recursive?",
    options: [
      "return factorial(n - 1, ans * n);",
      "return n * factorial(n - 1);",
      "return factorial(n - 1) + 1;",
      "return factorial(n - 1) * n;",
    ],
    correctAnswer: 0,
    explanation:
      "The recursive call is the last operation in the first option.",
  },
  {
    question: "Which recursion is NOT tail recursion?",
    options: [
      "return factorial(n - 1, ans * n);",
      "return sum(n - 1, ans + n);",
      "return n * factorial(n - 1);",
      "return gcd(b, a % b);",
    ],
    correctAnswer: 2,
    explanation:
      "Multiplication happens after the recursive call returns.",
  },
  {
    question: "Does Tail Recursion still require a base case?",
    options: [
      "Yes",
      "No",
      "Only for factorial",
      "Only for trees",
    ],
    correctAnswer: 0,
    explanation:
      "Every recursive function requires a base case.",
  },
  {
    question: "What is the time complexity of tail recursive factorial?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n²)",
    ],
    correctAnswer: 2,
    explanation:
      "The function performs one recursive call for each value of n.",
  },
  {
    question: "Without Tail Call Optimization, the space complexity is:",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n²)",
    ],
    correctAnswer: 2,
    explanation:
      "Each recursive call occupies one stack frame.",
  },
  {
    question: "With Tail Call Optimization, the space complexity becomes:",
    options: [
      "O(n)",
      "O(log n)",
      "O(1)",
      "O(n²)",
    ],
    correctAnswer: 2,
    explanation:
      "The current stack frame can be reused.",
  },
  {
    question: "Which of the following is an example of tail recursion?",
    options: [
      "Tail Recursive Factorial",
      "Recursive Fibonacci",
      "Merge Sort",
      "Tree Traversal",
    ],
    correctAnswer: 0,
    explanation:
      "Tail recursive factorial is a classic example.",
  },
  {
    question: "What happens after the recursive call returns in tail recursion?",
    options: [
      "More computation is performed",
      "The function immediately returns",
      "Another recursive call is made",
      "The base case is checked again",
    ],
    correctAnswer: 1,
    explanation:
      "No work remains after the recursive call.",
  },
  {
    question: "Which parameter is commonly added in tail-recursive factorial?",
    options: [
      "Accumulator",
      "Index",
      "Pointer",
      "Boolean",
    ],
    correctAnswer: 0,
    explanation:
      "An accumulator stores the intermediate result.",
  },
  {
    question: "Which statement correctly describes an accumulator?",
    options: [
      "Stores intermediate results",
      "Stores array indices",
      "Controls loops",
      "Stores recursion depth",
    ],
    correctAnswer: 0,
    explanation:
      "An accumulator carries the computed value through recursive calls.",
  },
  {
    question: "What is the main benefit of Tail Recursion?",
    options: [
      "Improved memory efficiency with optimization",
      "Removes the need for recursion",
      "Always executes faster than loops",
      "Never needs a stack",
    ],
    correctAnswer: 0,
    explanation:
      "Tail recursion can reduce stack usage when Tail Call Optimization is supported.",
  },
];

const TailRecursionQuiz = () => {
  return (
    <QuizEngine
      title="Tail Recursion Quiz Challenge"
      questions={questions}
    />
  );
};

export default TailRecursionQuiz;