"use client";
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

const StackVisualizer = () => {
  /* ---------- state ---------- */
  const [stack, setStack] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [operation, setOperation] = useState(null);
  const [message, setMessage] = useState("Stack is empty");
  const [isAnimating, setIsAnimating] = useState(false);
  const [peekedItem, setPeekedItem] = useState(null);
  const [isEmptyStatus, setIsEmptyStatus] = useState(null);

  const itemRefs = useRef([]);

  /* ---------- helpers ---------- */
  const resetRefs = () => (itemRefs.current = []);

  /* ---------- push ---------- */
  const push = () => {
    const val = inputValue.trim();
    if (!val) {
      setMessage("Please enter a value to push");
      return;
    }
    setIsAnimating(true);
    setOperation(`Pushing "${val}"…`);
    setMessage("");
    setPeekedItem(null);
    setIsEmptyStatus(null);

    setStack((prev) => [val, ...prev]);

    setTimeout(() => {
      const el = itemRefs.current[0];
      gsap.set(el, { y: -60, scale: 0.8, opacity: 0 });
      gsap
        .timeline({ onComplete: () => setIsAnimating(false) })
        .to(el, { y: 0, scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" })
        .to(el, { boxShadow: "0 0 10px #3b82f6", duration: 0.2, yoyo: true, repeat: 1 }, "-=0.2")
        .call(() => setMessage(`"${val}" pushed to stack!`));
    }, 10);

    setInputValue("");
  };

  /* ---------- pop ---------- */
  const pop = () => {
    if (stack.length === 0) {
      setMessage("Stack is empty!");
      setIsEmptyStatus(true);
      return;
    }
    setIsAnimating(true);
    const val = stack[0];
    setOperation(`Popping "${val}"…`);
    setMessage("");
    setPeekedItem(null);
    setIsEmptyStatus(null);

    const el = itemRefs.current[0];
    gsap
      .timeline({ onComplete: () => {
        setStack((prev) => prev.slice(1));
        setIsAnimating(false);
        setMessage(`"${val}" popped from stack!`);
      } })
      .to(el, { scale: 0.5, rotation: 15, y: 80, opacity: 0, duration: 0.5, ease: "power2.in" });
  };

  /* ---------- peek ---------- */
  const peek = () => {
    if (stack.length === 0) {
      setMessage("Stack is empty!");
      setIsEmptyStatus(true);
      return;
    }
    setIsAnimating(true);
    setOperation("Peeking at top element…");
    setPeekedItem(stack[0]);
    setIsEmptyStatus(false);

    const el = itemRefs.current[0];
    gsap
      .timeline({ onComplete: () => setIsAnimating(false) })
      .to(el, { y: -6, boxShadow: "0 0 15px #a855f7", duration: 0.25 })
      .to(el, { y: 0, boxShadow: "0 0 0px transparent", duration: 0.25 })
      .to(el, { y: -6, duration: 0.25 })
      .to(el, { y: 0, duration: 0.25 })
      .call(() => setMessage(`Top element is "${stack[0]}"`));
  };

  /* ---------- isEmpty ---------- */
  const checkEmpty = () => {
    setIsAnimating(true);
    setOperation("Checking if stack is empty…");
    setPeekedItem(null);
    setTimeout(() => {
      const empty = stack.length === 0;
      setIsEmptyStatus(empty);
      setOperation(null);
      setMessage(empty ? "Stack is empty!" : "Stack is not empty");
      setIsAnimating(false);
    }, 1000);
  };

  /* ---------- reset ---------- */
  const reset = () => {
    setIsAnimating(true);
    gsap.to(itemRefs.current.filter(Boolean), {
      scale: 0,
      y: -60,
      opacity: 0,
      stagger: 0.06,
      duration: 0.3,
      onComplete: () => {
        setStack([]);
        setInputValue("");
        setOperation(null);
        setMessage("Stack is empty");
        setPeekedItem(null);
        setIsEmptyStatus(null);
        setIsAnimating(false);
        resetRefs();
      },
    });
  };

  return (
    <main className="container mx-auto">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visualize Push, Pop, Peek, and IsEmpty operations
      </p>

      <div className="max-w-4xl mx-auto">
        {/* Controls */}
        <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8">
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Enter Value
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter a value"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#a435f0] focus:outline-none focus:ring-2 focus:ring-[#a435f0]/30 transition duration-300"
                disabled={isAnimating}
              />
              <button
                onClick={push}
                disabled={isAnimating}
                className="px-6 py-2 font-bold bg-[#a435f0] text-white rounded-lg hover:bg-[#8f2cd6] transition-all duration-200"
              >
                Push
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={checkEmpty}
              disabled={isAnimating}
              className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all duration-200"
            >
              IsEmpty
            </button>
            <button
              onClick={reset}
              disabled={isAnimating}
              className="flex-1 border-2 border-[#1a1a1a] dark:border-[#f7f9fa] text-[#1a1a1a] dark:text-[#f7f9fa] font-bold py-[10px] rounded-lg hover:bg-[#1a1a1a] hover:text-white dark:hover:bg-white dark:hover:text-[#1a1a1a] disabled:opacity-50 transition-all duration-200"
            >
              Reset
            </button>
          </div>
        </div>

        {message && (
          <div className="max-w-4xl mx-auto mb-8 p-4 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
            <p className="text-center font-medium">{message}</p>
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

          {/* Vertical Stack */}
          <div className="flex flex-col items-center min-h-[300px]">
            {/* Top indicator */}
            <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
              {stack.length > 0 ? "↑ Top" : ""}
            </div>

            <div className="w-32 relative">
              {stack.length === 0 ? (
                <EmptyCloud />
              ) : (
                <div className="space-y-1">
                  {stack.map((item, index) => (
                    <div
                      key={index}
                      ref={(el) => (itemRefs.current[index] = el)}
                      className={`p-3 border-2 rounded text-center font-medium transition-all ${
                        index === 0 && peekedItem !== null
                          ? "bg-purple-200 dark:bg-purple-800 border-purple-400 dark:border-purple-600"
                          : index === 0
                          ? "bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700"
                          : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                      }`}
                    >
                      {item}
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

/* ---------- cute floating cloud (empty) ---------- */
const EmptyCloud = () => {
  const cloudRef = useRef(null);
  useEffect(() => {
    gsap.to(cloudRef.current, { y: -6, duration: 2, repeat: -1, yoyo: true, ease: "power1.inOut" });
  }, []);
  return (
    <div className="flex flex-col items-center pt-8 text-gray-400">
      <svg
        ref={cloudRef}
        xmlns="http://www.w3.org/2000/svg"
        className="h-16 w-16 mb-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
        />
      </svg>
      <span className="text-sm">Stack is empty</span>
    </div>
  );
};

export default StackVisualizer;