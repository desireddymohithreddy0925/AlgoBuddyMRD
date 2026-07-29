"use client";

import React from "react";

export default function TailRecursionContent() {
  return (
    <div className="space-y-6">

      <section>
        <h2 className="text-2xl font-bold mb-2">What is Tail Recursion?</h2>

        <p>
          Tail recursion is a special type of recursion where the recursive call
          is the last operation performed before returning from the function.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-2">Key Characteristics</h2>

        <ul className="list-disc ml-6 space-y-2">
          <li>Recursive call is the final operation.</li>
          <li>No work remains after the recursive call.</li>
          <li>Can be optimized using Tail Call Optimization (TCO).</li>
          <li>Often uses an accumulator variable.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-2">Complexity</h2>

        <ul className="list-disc ml-6">
          <li>Time Complexity : O(n)</li>
          <li>Space Complexity : O(n)</li>
          <li>With Tail Call Optimization : O(1)</li>
        </ul>
      </section>

    </div>
  );
}