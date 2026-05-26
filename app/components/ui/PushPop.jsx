'use client';

import { useState } from 'react';

const PushPop = ({ stack, setStack, isAnimating, setIsAnimating, setMessage, setOperation }) => {
  const [inputValue, setInputValue] = useState('');

  // Push operation
  const push = () => {
    if (!inputValue.trim()) {
      setMessage('Please enter a value');
      return;
    }

    setIsAnimating(true);
    setOperation(`Pushing "${inputValue}"...`);
    
    setTimeout(() => {
      setStack(prev => [inputValue, ...prev]);
      setOperation(null);
      setMessage(`"${inputValue}" pushed to stack`);
      setInputValue('');
      setIsAnimating(false);
    }, 1000);
  };

  // Pop operation
  const pop = () => {
    if (stack.length === 0) {
      setMessage('Stack is empty!');
      return;
    }

    setIsAnimating(true);
    const poppedValue = stack[0];
    setOperation(`Popping "${poppedValue}"...`);
    
    setTimeout(() => {
      setStack(prev => prev.slice(1));
      setOperation(null);
      setMessage(`"${poppedValue}" popped from stack`);
      setIsAnimating(false);
    }, 1000);
  };

  // Peek operation
  const peek = () => {
    if (stack.length === 0) {
      setMessage('Stack is empty!');
      return;
    }

    setIsAnimating(true);
    setOperation(`Peeking at "${stack[0]}"`);
    
    setTimeout(() => {
      setOperation(null);
      setMessage(`Top element is "${stack[0]}"`);
      setIsAnimating(false);
    }, 1000);
  };

  return (
    <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8 max-w-4xl mx-auto">
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          Enter Value
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter value"
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
          onClick={pop}
          disabled={isAnimating || stack.length === 0}
          className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all duration-200"
        >
          Pop
        </button>
        <button
          onClick={peek}
          disabled={isAnimating || stack.length === 0}
          className="flex-1 bg-amber-600 text-white font-bold py-3 rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-all duration-200"
        >
          Peek
        </button>
        <button
          onClick={() => setStack([])}
          className="flex-1 border-2 border-[#1a1a1a] dark:border-[#f7f9fa] text-[#1a1a1a] dark:text-[#f7f9fa] font-bold py-[10px] rounded-lg hover:bg-[#1a1a1a] hover:text-white dark:hover:bg-white dark:hover:text-[#1a1a1a] disabled:opacity-50 transition-all duration-200"
          disabled={isAnimating}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default PushPop;