"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  // --- BEGINNER (1-12) ---
  {
    question: "What is the fundamental structural concept behind a 2D Segment Tree?",
    options: [
      "A nested tree structure (Tree of Trees) where outer tree nodes represent row ranges and point to inner column segment trees",
      "A balanced binary search tree where each node contains a 2D matrix",
      "A tree with 4 children per node representing quadrants of a matrix",
      "A collection of independent 1D segment trees, one for each diagonal of a grid"
    ],
    correctAnswer: 0,
    explanation: "A 2D Segment Tree is structured as a Tree of Trees. The outer tree segment tree handles row intervals, and each node in this outer tree stores a complete 1D segment tree that manages column intervals for that row range."
  },
  {
    question: "Why is a standard 1D Segment Tree inadequate for direct 2D rectangular subgrid range queries?",
    options: [
      "1D trees cannot store integer values in grids",
      "A contiguous 2D subgrid does not map to a single contiguous index range in a flattened 1D array representation",
      "1D trees only support prefix sums, not range minimum queries",
      "1D segment trees cannot perform point updates"
    ],
    correctAnswer: 1,
    explanation: "If you flatten a 2D matrix into a 1D array, a rectangular subgrid becomes multiple non-contiguous segment slices. A 1D segment tree cannot query these separate slices in a single logarithmic query."
  },
  {
    question: "In a 2D Segment Tree representing an M × N matrix, what does the root node of the outer tree represent?",
    options: [
      "The entire row range [0, M-1]",
      "The entire column range [0, N-1]",
      "The single top-left cell (0, 0)",
      "The sum of all cells in the matrix"
    ],
    correctAnswer: 0,
    explanation: "The outer tree partitions rows. The root node of the outer tree covers the complete range of rows from index 0 to M-1."
  },
  {
    question: "What does each leaf node in the outer row-wise segment tree of a 2D Segment Tree contain?",
    options: [
      "A single floating-point decimal value",
      "A complete 1D segment tree representing that specific row's columns",
      "A linked list of active grid coordinates",
      "An array of row indices"
    ],
    correctAnswer: 1,
    explanation: "A leaf node in the outer tree represents a single row interval [i, i]. It contains a 1D column segment tree built over the elements of that specific row."
  },
  {
    question: "What is the time complexity of building a 2D Segment Tree for an N × N matrix?",
    options: [
      "O(log N)",
      "O(N log N)",
      "O(N²)",
      "O(N³)"
    ],
    correctAnswer: 2,
    explanation: "Building the 2D segment tree requires constructing 1D segment trees for all nodes in the row tree. The leaf rows take O(N²), and merging them upward takes O(N²), giving an overall O(N²) build time complexity."
  },
  {
    question: "Which dimensions are typically indexed by the outer tree and the inner trees of a 2D Segment Tree, respectively?",
    options: [
      "Outer indexes row ranges; inner indexes column ranges",
      "Outer indexes column ranges; inner indexes row ranges",
      "Outer indexes diagonal ranges; inner indexes anti-diagonals",
      "Outer indexes grid quadrants; inner indexes grid cells"
    ],
    correctAnswer: 0,
    explanation: "By convention, the outer tree handles row intervals (Y-axis partitioning), and the inner trees handle column intervals (X-axis partitioning)."
  },
  {
    question: "What type of problem is a 2D Segment Tree primarily designed to solve?",
    options: [
      "Matrix multiplication",
      "Subgrid/rectangular range queries and point updates",
      "Finding the shortest path in a grid",
      "Transposing a matrix"
    ],
    correctAnswer: 1,
    explanation: "2D Segment Trees are used to answer range queries (Sum, Minimum, Maximum, GCD) on rectangular regions of a matrix while supporting dynamic point updates."
  },
  {
    question: "In a 2D Segment Tree, how many children does a non-leaf node in the outer tree have?",
    options: [
      "2",
      "4",
      "8",
      "Varies based on matrix aspect ratio"
    ],
    correctAnswer: 0,
    explanation: "The outer tree is a standard binary segment tree structure, so every non-leaf row node has exactly 2 children (representing the left and right halves of the row range)."
  },
  {
    question: "Which of the following is a primary advantage of a 2D Segment Tree over a naive cell-by-cell loop query?",
    options: [
      "It requires no additional memory",
      "It reduces range query time from O(N²) to O(log² N) for N × N grids",
      "It makes cell updates O(1) time",
      "It sorts the matrix automatically"
    ],
    correctAnswer: 1,
    explanation: "For an N × N grid, a naive subgrid query traverses every cell in O(N²) time. A 2D Segment Tree cuts this query complexity to O(log² N) using interval partitioning."
  },
  {
    question: "What is a major limitation of a 2D Segment Tree?",
    options: [
      "It cannot handle updates",
      "It can only answer sum queries",
      "High memory consumption",
      "It is restricted to strictly square matrices"
    ],
    correctAnswer: 2,
    explanation: "Because each node of the row segment tree contains a full column segment tree, the space complexity is O(16 × M × N) in static arrays, which represents a large memory overhead."
  },
  {
    question: "If you perform a query on a 2D Segment Tree where the query ranges are [r, r] and [c, c], what does this query perform?",
    options: [
      "A point query (finding the value of a single cell)",
      "A row query",
      "A column query",
      "A total sum query"
    ],
    correctAnswer: 0,
    explanation: "Querying a single row index r and a single column index c retrieves the exact cell value at (r, c), which is equivalent to a point query."
  },
  {
    question: "In a 2D Segment Tree for range sum queries, what value should be returned by a node whose range has zero overlap with the query?",
    options: [
      "-1",
      "Infinity",
      "0",
      "Null"
    ],
    correctAnswer: 2,
    explanation: "For range sum queries, 0 is the additive identity and does not alter the sum. For range minimum queries, infinity would be returned; for range maximums, negative infinity."
  },

  // --- INTERMEDIATE (13-24) ---
  {
    question: "What is the worst-case time complexity of updating a single cell (point update) in a 2D Segment Tree of size N × N?",
    options: [
      "O(N)",
      "O(log² N)",
      "O(N log N)",
      "O(1)"
    ],
    correctAnswer: 1,
    explanation: "Updating a cell requires traversing O(log N) row nodes. At each row node, we perform a 1D column tree update which takes O(log N) steps. Thus, the total complexity is O(log² N)."
  },
  {
    question: "What is the worst-case time complexity of a 2D range query in a 2D Segment Tree of size N × N?",
    options: [
      "O(N log N)",
      "O(log² N)",
      "O(log N)",
      "O(N)"
    ],
    correctAnswer: 1,
    explanation: "A 2D query visits O(log N) row tree segments, and for each visited row segment, queries its inner column segment tree in O(log N) time, resulting in O(log² N) time."
  },
  {
    question: "What is the space complexity of a 2D Segment Tree for an M × N matrix in a standard flat array implementation?",
    options: [
      "O(M + N)",
      "O(M × N log(M × N))",
      "O(M × N)",
      "O(M² × N²)"
    ],
    correctAnswer: 2,
    explanation: "Though the constant factor is large (approx 16), the space complexity is asymptotically O(M × N) because the number of elements is directly proportional to M × N."
  },
  {
    question: "During a point update at cell (r, c), which of the following describes the correct update propagation in the 2D Segment Tree?",
    options: [
      "First update the leaf row's column tree at c, then walk up the row tree, updating the column trees of parent row nodes at index c by merging values from children row nodes",
      "Update the outer row tree first, then recursively update all inner columns from index 0 to N-1",
      "Update only the root node of the outer row tree and defer child updates",
      "Update all leaf nodes in all row and column trees simultaneously"
    ],
    correctAnswer: 0,
    explanation: "Updates are bottom-up. First, we find leaf row r and update its col tree at index c. Then, we walk back up to the root, updating column tree node c of each row ancestor by combining child row node column values."
  },
  {
    question: "Which of the following statements is true when comparing a 2D Segment Tree with a 2D Fenwick Tree (Binary Indexed Tree)?",
    options: [
      "2D Fenwick trees use more space than 2D Segment Trees",
      "2D Segment Trees are more flexible because they support non-invertible operators (like Range Max) easily, whereas standard 2D Fenwick Trees require invertible operators (like Sum)",
      "2D Segment Trees have a smaller constant factor in execution time",
      "2D Fenwick Trees do not support point updates"
    ],
    correctAnswer: 1,
    explanation: "A 2D Fenwick tree is highly space efficient, but relies on prefix subtraction (invertibility) to answer subgrid queries. A 2D Segment Tree only needs associativity, allowing it to easily support RMQ (Range Max/Min)."
  },
  {
    question: "To support 2D Range Maximum Queries (RMQ), how is a parent row node's inner column tree constructed from its children row nodes' column trees?",
    options: [
      "Each node in the parent's column tree stores the maximum of the corresponding nodes in the children's column trees",
      "We add the values of the children row nodes' column tree nodes",
      "We concatenate the children row nodes' column tree arrays",
      "Only the root node of the parent column tree contains the maximum value"
    ],
    correctAnswer: 0,
    explanation: "To merge two column trees, we define parent_tree[col_node] = max(left_child_tree[col_node], right_child_tree[col_node]) at every node of the column segment tree."
  },
  {
    question: "Which mathematical property is REQUIRED for an operation (like sum, min, gcd) to be valid on a 2D Segment Tree?",
    options: [
      "Commutativity",
      "Invertibility",
      "Associativity",
      "Distributivity"
    ],
    correctAnswer: 2,
    explanation: "Associativity is required because segment trees partition ranges into arbitrary binary cuts, and merging results must yield the same answer regardless of the grouping of operations."
  },
  {
    question: "Why are static 2D prefix sum arrays insufficient compared to 2D Segment Trees in dynamic grid applications?",
    options: [
      "2D prefix sum arrays cannot handle negative numbers",
      "Updating a cell in a 2D prefix sum array requires O(M × N) time, which is too slow for frequent updates",
      "2D prefix sum arrays take O(N²) space for queries",
      "2D prefix sum arrays do not work with rectangular grids"
    ],
    correctAnswer: 1,
    explanation: "A 2D prefix sum array can query in O(1) time but cell updates require recomputing the prefix sum of all cells below and to the right, which takes O(M × N) time in the worst case."
  },
  {
    question: "When querying a row range [r1, r2] and column range [c1, c2] in a 2D Segment Tree, how many inner column segment trees are queried in the worst case?",
    options: [
      "O(1)",
      "O(M) where M is the number of rows",
      "O(log M) where M is the number of rows",
      "O(M × N)"
    ],
    correctAnswer: 2,
    explanation: "The outer row tree is traversed, and exactly O(log M) disjoint row intervals covering [r1, r2] are selected. For each of these row nodes, we query their inner column tree, thus querying O(log M) column trees."
  },
  {
    question: "During a point update at coordinates (r, c), which of the following is true regarding node updates?",
    options: [
      "We update column trees of exactly O(log M) row nodes, traversing O(log N) column nodes in each",
      "We update all N² nodes of the 2D segment tree",
      "We only update the root node of the outer tree",
      "We only update the column tree of leaf row r"
    ],
    correctAnswer: 0,
    explanation: "We traverse the path from root to leaf row r (which has O(log M) nodes). For each node on this path, we update the column tree node corresponding to index c (which has O(log N) nodes)."
  },
  {
    question: "If we change the query operation from Range Sum to Range Greatest Common Divisor (GCD), what modification is required?",
    options: [
      "No changes; the code is exactly identical",
      "We must add a hash map to the segment tree nodes",
      "Replace the addition (+) operator with the GCD operator in both inner and outer tree node combining steps",
      "The tree must be reconstructed as a trie"
    ],
    correctAnswer: 2,
    explanation: "Because GCD is associative, we can simply replace the combination step. Instead of summing child nodes, we take their GCD during builds, updates, and query returns."
  },
  {
    question: "In competitive programming, when is a 2D Segment Tree preferred over a 2D Fenwick Tree?",
    options: [
      "When the grid never changes after construction",
      "When the range query operation is not invertible (like Range Max/Min) and dynamic point updates are required",
      "When memory is extremely limited and constant factor speed is critical",
      "When only 1D range queries are needed"
    ],
    correctAnswer: 1,
    explanation: "For Range Sum, a 2D Fenwick tree is better due to simplicity and memory. For Range Max/Min (which are non-invertible), a 2D Fenwick tree cannot answer arbitrary range queries easily, making 2D Segment Tree the tool of choice."
  },

  // --- ADVANCED (25-30) ---
  {
    question: "Why is a general 2D range update (e.g., adding val to subgrid) with lazy propagation extremely complex in a standard 2D Segment Tree?",
    options: [
      "Lazy tags cannot be represented as numbers",
      "Row nodes do not have left and right children",
      "Columns do not have a binary midpoint",
      "Propagating a lazy update tag down a row node's children requires updating or creating lazy flags on their entire inner column trees, which cannot be done in O(log N) time"
    ],
    correctAnswer: 3,
    explanation: "In 1D, lazy propagation is O(1) because you store a tag at a node. In 2D, a row node covers many columns. Propagating a row tag down requires modifying column segments, which results in O(N) or O(N log N) work, destroying the O(log² N) update complexity."
  },
  {
    question: "How can you support 2D range updates (add to subgrid) and point queries (value at a cell) efficiently without using complex 2D lazy propagation?",
    options: [
      "By using a 'championship' approach: apply the update to covered segment nodes in the row/col trees, and accumulate the sum of these nodes along the search paths during point queries",
      "By using a 1D segment tree and flattening the grid",
      "By rebuilding the entire tree from scratch after each update",
      "By locking the matrix to prevent simultaneous operations"
    ],
    correctAnswer: 0,
    explanation: "This is the 'update-range, query-point' duality. Instead of pushing lazy tags down, we add the value to the matching nodes. A point query at (r,c) sums up all values stored in the nodes covering (r,c) along the root-to-leaf paths."
  },
  {
    question: "For a sparse grid of size 10⁹ × 10⁹ with K non-zero elements, how can a 2D Segment Tree be represented without running out of memory?",
    options: [
      "Using a 1D array of size 10¹⁸ elements",
      "By using an adjacency list of a graph",
      "By utilizing dynamic node allocation (pointer-based sparse segment tree) for both outer and inner trees, keeping space to O(K log M log N)",
      "By compressing the coordinates into a hash table and querying it linearly"
    ],
    correctAnswer: 2,
    explanation: "A sparse segment tree allocates nodes dynamically only when they are updated. By using dynamic node creation for both row and column trees, we only instantiate nodes along paths of updated elements, saving space."
  },
  {
    question: "During a bottom-up build of a 2D Segment Tree, how is the inner column tree of a parent row node constructed from its children row nodes' column trees?",
    options: [
      "By building it from scratch from the base matrix, taking O(N) time",
      "By merging the children row nodes' column trees node-by-node recursively, taking O(N) time",
      "By copying the left child's column tree and ignoring the right",
      "By summing only the root nodes of children column trees"
    ],
    correctAnswer: 1,
    explanation: "To build a parent's column tree, we recursively combine the corresponding column tree nodes of the left child row tree and the right child row tree: parent[node] = merge(left_child[node], right_child[node]). This takes O(N) time, equivalent to the column tree size."
  },
  {
    question: "What is the time complexity of a 2D range query on a static grid if each node of a 1D row segment tree contains a sorted array of columns (queried via binary search or fractional cascading)?",
    options: [
      "O(log M + log N) with fractional cascading, or O(log M × log N) with binary search",
      "O(M × N)",
      "O(1)",
      "O(log(M + N))"
    ],
    correctAnswer: 0,
    explanation: "If rows are partitioned by a segment tree where each node holds sorted elements of columns, we query O(log M) nodes. Using binary search takes O(log N) per node, totaling O(log M × log N). Fractional cascading optimizes this to O(log M + log N)."
  },
  {
    question: "In a 2D Segment Tree, why does combining inner trees node-by-node during parent row tree calculations preserve mathematical correctness?",
    options: [
      "Because the row-wise range merge operation and the column-wise range merge operation are commutative and associative, ensuring consistency",
      "Because parent nodes are always twice the value of their children",
      "Because column trees are always sorted in ascending order",
      "Because the matrix values are strictly positive integers"
    ],
    correctAnswer: 0,
    explanation: "Since the operations are associative and commutative (or combine independently), merging row intervals first, then column intervals, yields the same result as column-wise merging first, then row-wise."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="2D Segment Tree Quiz"
      questions={questions}
    />
  );
}
