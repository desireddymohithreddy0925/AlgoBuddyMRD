"use client";
import ComplexityGraph from "@/app/components/ui/graph";

const Segment2DContent = () => {
  return (
    <main className="max-w-4xl mx-auto mt-8 mb-8">
      <article className="bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden shadow-sm">

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            What is a 2D Segment Tree?
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db] leading-relaxed space-y-4">
            <p>
              A 2D Segment Tree (also known as a <strong>Tree of Trees</strong>) is an extension of the standard 1D Segment Tree to two dimensions. It is designed to perform range queries (such as sum, min, or max) and updates on a 2D grid/matrix efficiently.
            </p>
            <p>
              While a standard 2D prefix-sum matrix answers subgrid queries in O(1) time, updating any cell takes O(N&sup2;) in the worst case to recompute. A 2D Segment Tree resolves this balance, executing both subgrid queries and point updates in O(log M &times; log N) time.
            </p>
          </div>
        </section>

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Structural Concept
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db] leading-relaxed">
            <ul className="space-y-3 list-disc pl-5 marker:text-gray-500">
              <li><strong>Outer Segment Tree:</strong> Built along the rows of the matrix. Each node of this tree represents a range of rows.</li>
              <li>
                <strong>Inner Segment Trees:</strong> Instead of holding single values, every node in the outer tree points to an entire 1D Segment Tree built along the columns of the matrix.
              </li>
              <li>
                <strong>Leaf of Outer Tree:</strong> Represents a single row, and stores a 1D Segment Tree over columns for that row.
              </li>
              <li>
                <strong>Ancestor of Outer Tree:</strong> Represents a range of rows. Its column-wise Segment Tree is formed by merging the column trees of its two children nodes.
              </li>
              <li>
                <strong>Tree Size:</strong> For a matrix of size M &times; N, the memory required is approximately O(16 &times; M &times; N) in a static array representation.
              </li>
            </ul>
          </div>
        </section>

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Three Core Operations
          </h2>
          <div className="grid sm:grid-cols-3 gap-3 text-[#374151] dark:text-[#d1d5db]">
            {[
              { op: "Build", cost: "O(M × N)", desc: "Build row trees bottom-up. Column trees are initialized at outer leaves and recursively merged for parent rows." },
              { op: "Matrix Range Query", cost: "O(log M × log N)", desc: "Queries row intervals covering the range, triggering inner 1D queries on those nodes." },
              { op: "Point Update", cost: "O(log M × log N)", desc: "Walk down the row tree to target row leaf, update its column tree, then update ancestor column trees." },
            ].map(({ op, cost, desc }) => (
              <div key={op} className="p-4 rounded-xl bg-gray-50 dark:bg-[#1b1b1b] border border-gray-200 dark:border-gray-800">
                <p className="font-bold text-[#1a1a1a] dark:text-white">{op}</p>
                <p className="text-xs font-mono text-purple-600 dark:text-purple-400 mb-1">{cost}</p>
                <p className="text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="p-6">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Performance Complexity (Square Matrix N × N)
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db]">
            <ul className="space-y-2 font-mono text-sm bg-gray-50 dark:bg-[#1b1b1b] p-4 rounded-xl border border-gray-200 dark:border-gray-800">
              <li>Matrix Construction: O(N&sup2;)</li>
              <li>Subgrid Range Query Time: O(log&sup2; N)</li>
              <li>Point Update Time: O(log&sup2; N)</li>
              <li>Space Complexity: O(N&sup2;)</li>
            </ul>
            <div className="mt-8">
              <ComplexityGraph
                bestCase={(n) => Math.log2(n) * Math.log2(n)}
                averageCase={(n) => Math.log2(n) * Math.log2(n)}
                worstCase={(n) => Math.log2(n) * Math.log2(n)}
                maxN={50}
              />
            </div>
          </div>
        </section>

      </article>
    </main>
  );
};

export default Segment2DContent;
