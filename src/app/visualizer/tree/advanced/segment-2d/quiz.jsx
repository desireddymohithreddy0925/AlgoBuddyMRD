"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const Segment2DQuiz = () => {
  const questions = [
    {
      question: "For a matrix of size M × N, what is the worst-case time complexity of a 2D range sum query using a 2D Segment Tree?",
      options: [
        "O(M + N)",
        "O(log M + log N)",
        "O(log M × log N)",
        "O(M × N)"
      ],
      correctAnswer: 2,
      explanation: "A 2D range query performs a row range query in O(log M) time, and for each row tree node visited, it triggers a 1D column query in O(log N) time, resulting in O(log M × log N) overall."
    },
    {
      question: "What is the approximate maximum number of node entries needed in a standard array representation of a 2D Segment Tree for an M × N matrix?",
      options: [
        "4(M + N)",
        "4 × M × N",
        "8 × M × N",
        "16 × M × N"
      ],
      correctAnswer: 3,
      explanation: "A 1D segment tree over M elements takes 4M space. A 2D segment tree consists of an outer tree of size 4M where each node is an inner tree of size 4N. Therefore, the total space is 4M × 4N = 16MN."
    },
    {
      question: "Which of the following is the main reason to prefer a 2D Segment Tree over a 2D Prefix Sum array?",
      options: [
        "2D Prefix Sum takes more space",
        "2D Segment Tree handles dynamic updates in O(log M × log N) time",
        "2D Prefix Sum cannot do range queries",
        "2D Segment Tree queries are O(1) time"
      ],
      correctAnswer: 1,
      explanation: "A 2D Prefix Sum array can perform queries in O(1) time but takes O(M × N) time for point updates. A 2D Segment Tree balances both updates and queries in O(log M × log N) time, making it ideal for dynamic grids."
    }
  ];

  return <QuizEngine title="2D Segment Tree Module Quiz" questions={questions} />;
};

export default Segment2DQuiz;
