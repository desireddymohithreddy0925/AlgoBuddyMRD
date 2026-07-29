"use client";

import React from "react";

export default function TailRecursionCode() {
  const code = `int factorial(int n, int ans)
{
    if(n == 0)
        return ans;

    return factorial(n - 1, ans * n);
}

int main()
{
    cout << factorial(5,1);
}`;

  return (
    <div className="bg-gray-900 text-green-400 rounded-xl p-5 overflow-auto">
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}