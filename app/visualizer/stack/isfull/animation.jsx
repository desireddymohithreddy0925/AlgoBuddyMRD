"use client";
import React, { useState, useEffect } from "react";
import PushPop from "@/app/components/ui/PushPop";

const StackVisualizer = () => {
  const [stack, setStack] = useState([]);
  const [operation, setOperation] = useState(null);
  const [message, setMessage] = useState("Stack is empty");
  const [isAnimating, setIsAnimating] = useState(false);
  const [stackLimit] = useState(5); // Set stack capacity
  const [isFull, setIsFull] = useState(false);

  // Check if stack is full
  const checkIfFull = () => {
    setIsAnimating(true);
    setOperation("Checking if stack is full...");

    setTimeout(() => {
      const fullStatus = stack.length >= stackLimit;
      setIsFull(fullStatus);
      setOperation(null);
      setMessage(fullStatus ? "Stack is FULL!" : "Stack is NOT full");
      setIsAnimating(false);
    }, 1000);
  };

  // Reset stack
  const reset = () => {
    setStack([]);
    setMessage("Stack is empty");
    setOperation(null);
    setIsFull(false);
  };

  // Effect to update isFull status when stack changes
  useEffect(() => {
    setIsFull(stack.length >= stackLimit);
  }, [stack, stackLimit]);

  return (
    <main className="container mx-auto">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visualize the LIFO (Last In, First Out) principle
      </p>

      <div className="max-w-4xl mx-auto">
        {/* Use the PushPop component */}
        <PushPop
          stack={stack}
          setStack={setStack}
          isAnimating={isAnimating}
          setIsAnimating={setIsAnimating}
          setMessage={setMessage}
          setOperation={setOperation}
          stackLimit={stackLimit}
        />

        <div className="max-w-4xl mx-auto mb-8">
          <button
            onClick={checkIfFull}
            disabled={isAnimating}
            className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold px-6 py-4 rounded-xl transition-all duration-200 disabled:opacity-50 shadow-sm flex items-center justify-center gap-2 group"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Check If Full (isFull)
          </button>
        </div>

        {operation && (
          <div className="max-w-4xl mx-auto mb-4 p-3 rounded-lg bg-[#a435f0]/10 dark:bg-[#a435f0]/20 text-[#a435f0] border border-[#a435f0]/20">
            <span className="font-semibold uppercase text-xs tracking-wider mr-2">Operation:</span>
            {operation}
          </div>
        )}

        {message && (
          <div className="max-w-4xl mx-auto mb-8 p-6 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 text-blue-800 dark:text-blue-200">
            <p className="text-center font-medium text-lg italic">&quot;{message}&quot;</p>
          </div>
        )}

        {/* Stack Visualization */}
        <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Stack Visualization</h2>

          {/* Operation Status */}
          {operation && (
            <div className="mb-4 p-3 rounded-lg bg-[#a435f0]/10 dark:bg-[#a435f0]/20 text-[#a435f0] border border-[#a435f0]/20">
              <span className="font-semibold uppercase text-xs tracking-wider mr-2">Status:</span>
              {operation}
            </div>
          )}

          {/* Stack capacity indicator */}
          <div className="mb-4 text-center text-sm font-medium">
            Capacity: <span className={stack.length >= stackLimit ? "text-red-500" : "text-green-500"}>{stack.length}</span>/{stackLimit}
          </div>

          {/* Vertical Stack */}
          <div className="flex flex-col items-center min-h-[300px]">
            {/* Top indicator */}
            <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
              {stack.length > 0 ? "↑ Top" : ""}
            </div>

            {/* Stack elements with full state animation */}
            <div className="w-32 relative">
              {stack.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Stack is empty
                </div>
              ) : (
                <div className="space-y-1">
                  {stack.map((item, index) => (
                    <div
                      key={index}
                      className={`p-3 border-2 rounded text-center font-medium transition-all duration-300 ${
                        index === 0
                          ? "bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700"
                          : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                      } ${
                        isAnimating &&
                        index === 0 &&
                        operation?.includes("Peek")
                          ? "animate-pulse"
                          : isAnimating && index === 0
                          ? "animate-bounce"
                          : ""
                      } ${
                        isFull && isAnimating && operation?.includes("full")
                          ? "border-red-500 dark:border-red-500 animate-pulse"
                          : ""
                      }`}
                    >
                      {item}
                      {index === 0 && (
                        <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                          (Top)
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom indicator */}
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {stack.length > 0 ? "↓ Bottom" : ""}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default StackVisualizer;
