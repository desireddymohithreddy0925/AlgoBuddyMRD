"use client";

import React from "react";

export default function TailRecursionAnimation() {
  const calls = [
    "factorial(5,1)",
    "factorial(4,5)",
    "factorial(3,20)",
    "factorial(2,60)",
    "factorial(1,120)",
    "factorial(0,120)",
    "Return 120",
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border">
      <h2 className="text-xl font-bold mb-4">Tail Recursion Flow</h2>

      <div className="space-y-3">
        {calls.map((call, index) => (
          <div
            key={index}
            className="bg-teal-100 dark:bg-teal-900 p-3 rounded-lg font-mono text-center"
          >
            {call}
          </div>
        ))}
      </div>
    </div>
  );
}