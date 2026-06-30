"use client";

import Link from "next/link";

const quizzes = [
  {
    title: "Bubble Sort Quiz",
    href: "/visualizer/array/sorting/quiz/bubblesort",
  },
  {
    title: "Selection Sort Quiz",
    href: "/visualizer/array/sorting/quiz/selectionsort",
  },
  {
    title: "Insertion Sort Quiz",
    href: "/visualizer/array/sorting/quiz/insertionsort",
  },
  {
    title: "Merge Sort Quiz",
    href: "/visualizer/array/sorting/quiz/mergesort",
  },
  {
    title: "Quick Sort Quiz",
    href: "/visualizer/array/sorting/quiz/quicksort",
  },
  {
    title: "Heap Sort Quiz",
    href: "/visualizer/array/sorting/quiz/heapsort",
  },
  {
    title: "Radix Sort Quiz",
    href: "/visualizer/array/sorting/quiz/radixsort",
  },
  {
    title: "Counting Sort Quiz",
    href: "/visualizer/array/sorting/quiz/countingsort",
  },
];

export default function SortingQuizClient() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-4xl font-bold text-center">
          Sorting Quiz
        </h1>

        <p className="mb-10 text-center text-muted-foreground">
          Choose a sorting algorithm quiz to test your understanding.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {quizzes.map((quiz) => (
            <div
              key={quiz.title}
              className="rounded-xl border bg-card p-6 shadow-sm"
            >
              <h2 className="mb-4 text-2xl font-semibold">
                {quiz.title}
              </h2>

              <Link
                href={quiz.href}
                className="inline-flex rounded-lg bg-purple-600 px-5 py-2.5 font-medium text-white hover:bg-purple-700"
              >
                Start Quiz
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}