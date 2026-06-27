import Link from "next/link";

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#1c1d1f] p-6">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold text-center mb-10">
          🎯 Quiz Mode
        </h1>

        <p className="text-center text-gray-600 dark:text-gray-400 mb-10">
          Choose an algorithm quiz to test your understanding.
        </p>

        <div className="grid gap-6 md:grid-cols-2">

          {/* Linear Search Quiz */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-lg transition-all">
            <h2 className="text-2xl font-semibold mb-3">
              📘 Linear Search Quiz
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Test your understanding of Linear Search with multiple-choice questions.
            </p>

            <Link href="/visualizer/array/linearsearch/quiz">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg">
                Start Quiz
              </button>
            </Link>
          </div>

          {/* Binary Search Quiz */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-lg transition-all">
            <h2 className="text-2xl font-semibold mb-3">
              📘 Binary Search Quiz
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Test your understanding of Binary Search with multiple-choice questions.
            </p>

            <Link href="/visualizer/array/binarysearch/quiz">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg">
                Start Quiz
              </button>
            </Link>
          </div>

          {/* Bubble Sort Quiz */}

          <Link href="/visualizer/array/bubblesort/quiz">
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-lg transition-all">
              <h2 className="text-2xl font-semibold mb-3">
                📘 Bubble Sort Quiz
              </h2>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Test your understanding of Bubble Sort with multiple-choice questions.
              </p>

              <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg">
                Start Quiz
              </button>
            </div>
          </Link>

          {/* Selection Sort Quiz */}
          
          <Link href="/visualizer/array/selectionsort/quiz">
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-lg transition-all">
              <h2 className="text-2xl font-semibold mb-3">
                📘 Selection Sort Quiz
              </h2>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Test your understanding of Selection Sort with multiple-choice questions.
              </p>

              <button className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-lg">
                Start Quiz
              </button>
            </div>
          </Link>
          

        </div>
      </div>
    </div>
  );
}