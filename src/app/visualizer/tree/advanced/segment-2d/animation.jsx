"use client";
import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw, AlertCircle } from "lucide-react";
import { VisualizerCard } from "@/app/visualizer/components/VisualizerInteractiveLayout";

const INITIAL_MATRIX = [
  [3, 8, 4, 1],
  [5, 2, 9, 6],
  [7, 3, 2, 8],
  [4, 6, 5, 3]
];

export default function Segment2DAnimation() {
  const [matrix, setMatrix] = useState(() => INITIAL_MATRIX.map(row => [...row]));
  const [mode, setMode] = useState("query"); // "query" | "update"
  
  // Input fields
  const [qR1, setQR1] = useState("1");
  const [qR2, setQR2] = useState("3");
  const [qC1, setQC1] = useState("1");
  const [qC2, setQC2] = useState("3");
  
  const [upR, setUpR] = useState("2");
  const [upC, setUpC] = useState("2");
  const [upVal, setUpVal] = useState("10");

  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500); // ms per step
  const [errorMessage, setErrorMessage] = useState("");
  const playTimerRef = useRef(null);

  // Playback timer effect
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setCurrentStepIdx(prev => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, speed);
    } else {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, steps, speed]);

  const handleStepForward = () => {
    setIsPlaying(false);
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIdx(-1);
    setSteps([]);
    setErrorMessage("");
    setMatrix(INITIAL_MATRIX.map(row => [...row]));
  };

  // Range Query Step Generator
  const generateQuerySteps = (r1, r2, c1, c2) => {
    const generatedSteps = [];
    let accumulatedSum = 0;

    // Define outer row segment tree nodes
    // Node struct: { id, rStart, rEnd, label }
    const outerNodes = [
      { id: 0, rStart: 0, rEnd: 3, label: "Rows 0-3" },
      { id: 1, rStart: 0, rEnd: 1, label: "Rows 0-1" },
      { id: 2, rStart: 2, rEnd: 3, label: "Rows 2-3" },
      { id: 3, rStart: 0, rEnd: 0, label: "Row 0" },
      { id: 4, rStart: 1, rEnd: 1, label: "Row 1" },
      { id: 5, rStart: 2, rEnd: 2, label: "Row 2" },
      { id: 6, rStart: 3, rEnd: 3, label: "Row 3" }
    ];

    const innerNodes = [
      { id: 0, cStart: 0, cEnd: 3, label: "Cols 0-3" },
      { id: 1, cStart: 0, cEnd: 1, label: "Cols 0-1" },
      { id: 2, cStart: 2, cEnd: 3, label: "Cols 2-3" },
      { id: 3, cStart: 0, cEnd: 0, label: "Col 0" },
      { id: 4, cStart: 1, cEnd: 1, label: "Col 1" },
      { id: 5, cStart: 2, cEnd: 2, label: "Col 2" },
      { id: 6, cStart: 3, cEnd: 3, label: "Col 3" }
    ];

    // Helper to calculate segment sum for a row range and col range directly from current matrix
    const getGridSum = (rs, re, cs, ce) => {
      let sum = 0;
      for (let r = rs; r <= re; r++) {
        for (let c = cs; c <= ce; c++) {
          sum += matrix[r][c];
        }
      }
      return sum;
    };

    // Helper to record cells highlighted in various colors
    const getCellsMap = (rs, re, cs, ce, status) => {
      const map = {};
      for (let r = rs; r <= re; r++) {
        for (let c = cs; c <= ce; c++) {
          map[`${r}-${c}`] = status;
        }
      }
      return map;
    };

    generatedSteps.push({
      explanation: `Initializing 2D Range Query for subgrid Row [${r1}, ${r2}], Col [${c1}, ${c2}]. Start traversal at outer root node (Rows 0-3).`,
      outerHighlight: { 0: "visiting" },
      innerHighlight: {},
      highlightedCells: {},
      currentSum: 0,
      activeRowNode: 0,
      activeColNode: null
    });

    const traverseRow = (rowNodeId) => {
      const node = outerNodes.find(n => n.id === rowNodeId);
      if (!node) return;

      const { rStart, rEnd, label } = node;

      // Check overlap of [rStart, rEnd] and query range [r1, r2]
      if (rEnd < r1 || rStart > r2) {
        // No overlap
        generatedSteps.push({
          explanation: `Outer node ${label} does not overlap with query row range [${r1}, ${r2}]. Skipping subtree.`,
          outerHighlight: { [rowNodeId]: "inactive" },
          innerHighlight: {},
          highlightedCells: {},
          currentSum: accumulatedSum,
          activeRowNode: rowNodeId,
          activeColNode: null
        });
        return;
      }

      if (r1 <= rStart && rEnd <= r2) {
        // Total overlap: trigger inner column tree query for this outer row node
        generatedSteps.push({
          explanation: `Outer node ${label} is fully inside query row range [${r1}, ${r2}]. Initiating inner column tree traversal for this node.`,
          outerHighlight: { [rowNodeId]: "matched" },
          innerHighlight: { 0: "visiting" },
          highlightedCells: getCellsMap(rStart, rEnd, 0, 3, "active"),
          currentSum: accumulatedSum,
          activeRowNode: rowNodeId,
          activeColNode: 0
        });

        const traverseCol = (colNodeId) => {
          const colNode = innerNodes.find(n => n.id === colNodeId);
          if (!colNode) return;

          const { cStart, cEnd, label: colLabel } = colNode;

          if (cEnd < c1 || cStart > c2) {
            // No overlap
            generatedSteps.push({
              explanation: `Inner column node ${colLabel} does not overlap with query column range [${c1}, ${c2}]. Skipping column subtree.`,
              outerHighlight: { [rowNodeId]: "matched" },
              innerHighlight: { [colNodeId]: "inactive" },
              highlightedCells: getCellsMap(rStart, rEnd, cStart, cEnd, "inactive"),
              currentSum: accumulatedSum,
              activeRowNode: rowNodeId,
              activeColNode: colNodeId
            });
            return;
          }

          if (c1 <= cStart && cEnd <= qC2) {
            // Total overlap of column node
            const segmentVal = getGridSum(rStart, rEnd, cStart, cEnd);
            accumulatedSum += segmentVal;

            generatedSteps.push({
              explanation: `Inner column node ${colLabel} is fully inside query column range [${c1}, ${c2}]. Adding segment value of ${segmentVal} to sum.`,
              outerHighlight: { [rowNodeId]: "matched" },
              innerHighlight: { [colNodeId]: "matched" },
              highlightedCells: getCellsMap(rStart, rEnd, cStart, cEnd, "matched"),
              currentSum: accumulatedSum,
              activeRowNode: rowNodeId,
              activeColNode: colNodeId
            });
            return;
          }

          // Partial overlap of column node: traverse children
          generatedSteps.push({
            explanation: `Inner column node ${colLabel} partially overlaps column range [${c1}, ${c2}]. Splitting into children.`,
            outerHighlight: { [rowNodeId]: "matched" },
            innerHighlight: { [colNodeId]: "visiting" },
            highlightedCells: getCellsMap(rStart, rEnd, cStart, cEnd, "active"),
            currentSum: accumulatedSum,
            activeRowNode: rowNodeId,
            activeColNode: colNodeId
          });

          const mid = Math.floor((cStart + cEnd) / 2);
          traverseCol(2 * colNodeId + 1);
          traverseCol(2 * colNodeId + 2);
        };

        traverseCol(0);
        return;
      }

      // Partial overlap: split row range
      generatedSteps.push({
        explanation: `Outer row node ${label} partially overlaps query row range [${r1}, ${r2}]. Splitting into left and right row subtrees.`,
        outerHighlight: { [rowNodeId]: "visiting" },
        innerHighlight: {},
        highlightedCells: {},
        currentSum: accumulatedSum,
        activeRowNode: rowNodeId,
        activeColNode: null
      });

      traverseRow(2 * rowNodeId + 1);
      traverseRow(2 * rowNodeId + 2);
    };

    traverseRow(0);

    generatedSteps.push({
      explanation: `2D Range Query finished! Final accumulated subgrid sum is: ${accumulatedSum}`,
      outerHighlight: {},
      innerHighlight: {},
      highlightedCells: getCellsMap(r1, r2, c1, c2, "matched"),
      currentSum: accumulatedSum,
      activeRowNode: null,
      activeColNode: null,
      isFinal: true
    });

    return generatedSteps;
  };

  // Point Update Step Generator
  const generateUpdateSteps = (uRow, uCol, uValue) => {
    const generatedSteps = [];
    const tempMatrix = matrix.map(row => [...row]);

    // Visited outer/inner nodes trace
    // Walk down the row tree to row uRow
    // Outer nodes matching the path
    const rowPath = [];
    let rNode = 0;
    let rS = 0, rE = 3;
    rowPath.push({ id: rNode, rS, rE });
    while (rS < rE) {
      let mid = Math.floor((rS + rE) / 2);
      if (uRow <= mid) {
        rNode = 2 * rNode + 1;
        rE = mid;
      } else {
        rNode = 2 * rNode + 2;
        rS = mid + 1;
      }
      rowPath.push({ id: rNode, rStart: rS, rEnd: rE });
    }

    generatedSteps.push({
      explanation: `Initializing Point Update. First, traverse down the outer row tree to find the leaf node for Row ${uRow}. Path: Row Nodes ${rowPath.map(p => `[${p.rS !== undefined ? p.rS : p.rStart}-${p.rE !== undefined ? p.rE : p.rEnd}]`).join(" → ")}.`,
      outerHighlight: rowPath.reduce((acc, p) => ({ ...acc, [p.id]: "visiting" }), {}),
      innerHighlight: {},
      highlightedCells: { [`${uRow}-${uCol}`]: "active" },
      activeRowNode: rNode,
      activeColNode: null,
      matrixState: tempMatrix.map(row => [...row])
    });

    // We update the column tree of the leaf row
    const colPath = [];
    let cNode = 0;
    let cS = 0, cE = 3;
    colPath.push({ id: cNode, cS, cE });
    while (cS < cE) {
      let mid = Math.floor((cS + cE) / 2);
      if (uCol <= mid) {
        cNode = 2 * cNode + 1;
        cE = mid;
      } else {
        cNode = 2 * cNode + 2;
        cS = mid + 1;
      }
      colPath.push({ id: cNode, cS, cE });
    }

    generatedSteps.push({
      explanation: `Row leaf found. Now traverse down its inner column tree to find the leaf node for Col ${uCol}. Path: Col Nodes ${colPath.map(p => `[${p.cS}-${p.cE}]`).join(" → ")}.`,
      outerHighlight: { [rNode]: "matched" },
      innerHighlight: colPath.reduce((acc, p) => ({ ...acc, [p.id]: "visiting" }), {}),
      highlightedCells: { [`${uRow}-${uCol}`]: "active" },
      activeRowNode: rNode,
      activeColNode: cNode,
      matrixState: tempMatrix.map(row => [...row])
    });

    // Update leaf value
    tempMatrix[uRow][uCol] = uValue;
    generatedSteps.push({
      explanation: `Updating cell (${uRow}, ${uCol}) value from ${matrix[uRow][uCol]} to ${uValue} in the leaf row tree.`,
      outerHighlight: { [rNode]: "matched" },
      innerHighlight: { [cNode]: "matched" },
      highlightedCells: { [`${uRow}-${uCol}`]: "matched" },
      activeRowNode: rNode,
      activeColNode: cNode,
      matrixState: tempMatrix.map(row => [...row])
    });

    // Recalculate inner ancestors for this row tree node
    generatedSteps.push({
      explanation: `Recalculate parent nodes in the inner column tree of Row ${uRow} bottom-up by combining child values.`,
      outerHighlight: { [rNode]: "matched" },
      innerHighlight: colPath.reduce((acc, p) => ({ ...acc, [p.id]: "matched" }), {}),
      highlightedCells: { [`${uRow}-${uCol}`]: "matched" },
      activeRowNode: rNode,
      activeColNode: 0,
      matrixState: tempMatrix.map(row => [...row])
    });

    // Recalculate outer row ancestors bottom-up
    // Walk back up the row tree, updating the column trees at index uCol
    for (let i = rowPath.length - 2; i >= 0; i--) {
      const ancestorRow = rowPath[i];
      generatedSteps.push({
        explanation: `Propagating point update to outer row tree ancestor node [${ancestorRow.rS !== undefined ? ancestorRow.rS : ancestorRow.rStart}-${ancestorRow.rE !== undefined ? ancestorRow.rE : ancestorRow.rEnd}]. Recalculating its column tree node for Col ${uCol} by combining its children row trees' column values.`,
        outerHighlight: { [ancestorRow.id]: "visiting", [rowPath[i+1].id]: "matched" },
        innerHighlight: { 0: "visiting" },
        highlightedCells: { [`${uRow}-${uCol}`]: "active" },
        activeRowNode: ancestorRow.id,
        activeColNode: 0,
        matrixState: tempMatrix.map(row => [...row])
      });
    }

    generatedSteps.push({
      explanation: `Point update complete! Matrix values successfully updated in all containing 2D Segment Tree segments.`,
      outerHighlight: {},
      innerHighlight: {},
      highlightedCells: { [`${uRow}-${uCol}`]: "matched" },
      activeRowNode: null,
      activeColNode: null,
      matrixState: tempMatrix.map(row => [...row]),
      isFinal: true
    });

    return generatedSteps;
  };

  const handleRunQuery = () => {
    setErrorMessage("");
    const r1 = parseInt(qR1);
    const r2 = parseInt(qR2);
    const c1 = parseInt(qC1);
    const c2 = parseInt(qC2);

    if (isNaN(r1) || isNaN(r2) || isNaN(c1) || isNaN(c2) ||
        r1 < 0 || r1 > 3 || r2 < 0 || r2 > 3 || r1 > r2 ||
        c1 < 0 || c1 > 3 || c2 < 0 || c2 > 3 || c1 > c2) {
      setErrorMessage("Please check indices. They must be between 0 and 3, with Start <= End.");
      return;
    }

    const newSteps = generateQuerySteps(r1, r2, c1, c2);
    setSteps(newSteps);
    setCurrentStepIdx(0);
    setIsPlaying(true);
  };

  const handleRunUpdate = () => {
    setErrorMessage("");
    const r = parseInt(upR);
    const c = parseInt(upC);
    const val = parseInt(upVal);

    if (isNaN(r) || isNaN(c) || isNaN(val) || r < 0 || r > 3 || c < 0 || c > 3) {
      setErrorMessage("Indices must be between 0 and 3.");
      return;
    }

    const newSteps = generateUpdateSteps(r, c, val);
    setSteps(newSteps);
    setCurrentStepIdx(0);
    setIsPlaying(true);
  };

  // Retrieve current step variables
  const currentStep = currentStepIdx >= 0 && currentStepIdx < steps.length ? steps[currentStepIdx] : null;
  const explanation = currentStep ? currentStep.explanation : "Click Run to start visualizing the 2D Segment Tree operations.";
  const highlightedCells = currentStep ? currentStep.highlightedCells : {};
  const outerHighlight = currentStep ? currentStep.outerHighlight : {};
  const innerHighlight = currentStep ? currentStep.innerHighlight : {};
  const currentSum = currentStep && currentStep.currentSum !== undefined ? currentStep.currentSum : 0;
  const currentMatrix = currentStep && currentStep.matrixState ? currentStep.matrixState : matrix;

  // Apply matrix state modification when update completes
  useEffect(() => {
    if (currentStep && currentStep.isFinal && mode === "update" && currentStep.matrixState) {
      setMatrix(currentStep.matrixState.map(row => [...row]));
    }
  }, [currentStepIdx]);

  // Color functions
  const getCellClassName = (r, c) => {
    const key = `${r}-${c}`;
    const status = highlightedCells[key];
    if (status === "active") return "bg-purple-100 dark:bg-purple-950/40 border-purple-500 border-2 font-bold text-purple-700 dark:text-purple-300";
    if (status === "matched") return "bg-emerald-100 dark:bg-emerald-950/40 border-emerald-500 border-2 font-bold text-emerald-700 dark:text-emerald-300";
    if (status === "inactive") return "opacity-40 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800";
    return "bg-white dark:bg-[#181818] border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200";
  };

  return (
    <VisualizerCard className="w-full flex flex-col gap-6">
      
      {/* Tab controls */}
      <div className="flex border-b border-[#e5e7eb] dark:border-[#222]">
        <button
          onClick={() => { setMode("query"); handleReset(); }}
          className={`px-6 py-3 font-semibold transition-all border-b-2 text-sm ${
            mode === "query"
              ? "border-[#a435f0] text-[#a435f0] dark:text-[#d38cff]"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          2D Range Query
        </button>
        <button
          onClick={() => { setMode("update"); handleReset(); }}
          className={`px-6 py-3 font-semibold transition-all border-b-2 text-sm ${
            mode === "update"
              ? "border-[#a435f0] text-[#a435f0] dark:text-[#d38cff]"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Point Update
        </button>
      </div>

      {/* Input controller */}
      <div className="flex flex-wrap gap-4 items-center justify-between p-4 bg-gray-50 dark:bg-[#1b1b1b] rounded-2xl border border-gray-150 dark:border-gray-800">
        {mode === "query" ? (
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Subgrid Rows:</span>
            <input
              type="number"
              min="0"
              max="3"
              value={qR1}
              onChange={e => setQR1(e.target.value)}
              className="w-14 rounded-lg border p-1.5 text-center focus:outline-none focus:ring-2 focus:ring-[#a435f0] dark:bg-[#222] dark:border-gray-700"
              placeholder="R1"
            />
            <span className="text-gray-500">to</span>
            <input
              type="number"
              min="0"
              max="3"
              value={qR2}
              onChange={e => setQR2(e.target.value)}
              className="w-14 rounded-lg border p-1.5 text-center focus:outline-none focus:ring-2 focus:ring-[#a435f0] dark:bg-[#222] dark:border-gray-700"
              placeholder="R2"
            />

            <span className="font-semibold text-gray-700 dark:text-gray-300 ml-4">Cols:</span>
            <input
              type="number"
              min="0"
              max="3"
              value={qC1}
              onChange={e => setQC1(e.target.value)}
              className="w-14 rounded-lg border p-1.5 text-center focus:outline-none focus:ring-2 focus:ring-[#a435f0] dark:bg-[#222] dark:border-gray-700"
              placeholder="C1"
            />
            <span className="text-gray-500">to</span>
            <input
              type="number"
              min="0"
              max="3"
              value={qC2}
              onChange={e => setQC2(e.target.value)}
              className="w-14 rounded-lg border p-1.5 text-center focus:outline-none focus:ring-2 focus:ring-[#a435f0] dark:bg-[#222] dark:border-gray-700"
              placeholder="C2"
            />

            <button
              onClick={handleRunQuery}
              className="ml-4 rounded-xl bg-[#a435f0] px-5 py-2 text-white font-semibold transition hover:bg-[#8f2cd6]"
            >
              Run Query
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Cell:</span>
            <input
              type="number"
              min="0"
              max="3"
              value={upR}
              onChange={e => setUpR(e.target.value)}
              className="w-14 rounded-lg border p-1.5 text-center focus:outline-none focus:ring-2 focus:ring-[#a435f0] dark:bg-[#222] dark:border-gray-700"
              placeholder="Row"
            />
            <span className="text-gray-500">,</span>
            <input
              type="number"
              min="0"
              max="3"
              value={upC}
              onChange={e => setUpC(e.target.value)}
              className="w-14 rounded-lg border p-1.5 text-center focus:outline-none focus:ring-2 focus:ring-[#a435f0] dark:bg-[#222] dark:border-gray-700"
              placeholder="Col"
            />

            <span className="font-semibold text-gray-700 dark:text-gray-300 ml-4">New Value:</span>
            <input
              type="number"
              value={upVal}
              onChange={e => setUpVal(e.target.value)}
              className="w-20 rounded-lg border p-1.5 text-center focus:outline-none focus:ring-2 focus:ring-[#a435f0] dark:bg-[#222] dark:border-gray-700"
              placeholder="Val"
            />

            <button
              onClick={handleRunUpdate}
              className="ml-4 rounded-xl bg-[#a435f0] px-5 py-2 text-white font-semibold transition hover:bg-[#8f2cd6]"
            >
              Run Update
            </button>
          </div>
        )}

        <button
          onClick={handleReset}
          className="rounded-xl border border-gray-300 dark:border-gray-700 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-semibold transition"
        >
          Reset
        </button>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-950/20 p-3 rounded-xl text-sm">
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main split-screen visualizer */}
      <div className="grid md:grid-cols-2 gap-8 items-start">
        
        {/* Left Side: 2D Matrix Grid */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-[#1a1a1a] dark:text-white text-base">4 × 4 Grid Matrix</h3>
          <div className="grid grid-cols-4 gap-2 w-full max-w-[320px] mx-auto md:mx-0">
            {currentMatrix.map((row, rIdx) =>
              row.map((val, cIdx) => (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`aspect-square flex flex-col items-center justify-center border-2 rounded-xl text-lg font-bold transition-all duration-300 ${getCellClassName(rIdx, cIdx)}`}
                >
                  <span className="text-xs font-normal text-gray-400 dark:text-gray-500">({rIdx},{cIdx})</span>
                  <span>{val}</span>
                </div>
              ))
            )}
          </div>

          {mode === "query" && (
            <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-100 dark:border-purple-900/30 text-sm">
              <div className="flex justify-between items-center font-bold text-gray-800 dark:text-gray-200">
                <span>Accumulated Subgrid Sum:</span>
                <span className="text-xl text-[#a435f0] dark:text-[#d38cff]">{currentSum}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Tree of Trees Segment Tree Structure Visualization */}
        <div className="flex flex-col gap-6">
          <h3 className="font-bold text-[#1a1a1a] dark:text-white text-base">
            Tree of Trees Representation
          </h3>

          <div className="flex flex-col gap-4">
            {/* Outer Row Tree */}
            <div className="bg-gray-50 dark:bg-[#161616] p-4 rounded-2xl border border-gray-150 dark:border-gray-800">
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wide">
                Outer Row Tree (Segments rows)
              </p>
              <div className="flex justify-center">
                <svg width="300" height="120" className="overflow-visible">
                  {/* Edges */}
                  <line x1="150" y1="20" x2="80" y2="60" stroke="#94a3b8" strokeWidth="1.5" />
                  <line x1="150" y1="20" x2="220" y2="60" stroke="#94a3b8" strokeWidth="1.5" />
                  <line x1="80" y1="60" x2="40" y2="100" stroke="#94a3b8" strokeWidth="1.5" />
                  <line x1="80" y1="60" x2="120" y2="100" stroke="#94a3b8" strokeWidth="1.5" />
                  <line x1="220" y1="60" x2="180" y2="100" stroke="#94a3b8" strokeWidth="1.5" />
                  <line x1="220" y1="60" x2="260" y2="100" stroke="#94a3b8" strokeWidth="1.5" />

                  {/* Nodes */}
                  {[
                    { id: 0, x: 150, y: 20, txt: "[0-3]" },
                    { id: 1, x: 80, y: 60, txt: "[0-1]" },
                    { id: 2, x: 220, y: 60, txt: "[2-3]" },
                    { id: 3, x: 40, y: 100, txt: "[0]" },
                    { id: 4, x: 120, y: 100, txt: "[1]" },
                    { id: 5, x: 180, y: 100, txt: "[2]" },
                    { id: 6, x: 260, y: 100, txt: "[3]" }
                  ].map(n => {
                    const status = outerHighlight[n.id];
                    let fill = "var(--background, #fff)";
                    let stroke = "#64748b";
                    let textWeight = "font-medium";
                    if (status === "visiting") { fill = "#c084fc"; stroke = "#a435f0"; textWeight = "font-bold"; }
                    else if (status === "matched") { fill = "#34d399"; stroke = "#10b981"; textWeight = "font-bold"; }
                    else if (status === "inactive") { fill = "#e2e8f0"; stroke = "#cbd5e1"; }

                    return (
                      <g key={n.id}>
                        <circle cx={n.x} cy={n.y} r="16" fill={fill} stroke={stroke} strokeWidth="2" className="transition-all duration-300" />
                        <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="10" className={`fill-gray-800 dark:fill-gray-250 ${textWeight}`}>
                          {n.txt}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Inner Column Tree */}
            <div className="bg-gray-50 dark:bg-[#161616] p-4 rounded-2xl border border-gray-150 dark:border-gray-800 min-h-[160px] flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wide">
                  Inner Column Tree (Segment cols for active row node)
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-2">
                  {currentStep && currentStep.activeRowNode !== null 
                    ? `Showing columns tree for Row node [${currentStep.activeRowNode === 0 ? "0-3" : currentStep.activeRowNode === 1 ? "0-1" : currentStep.activeRowNode === 2 ? "2-3" : currentStep.activeRowNode === 3 ? "0" : currentStep.activeRowNode === 4 ? "1" : currentStep.activeRowNode === 5 ? "2" : "3"}]`
                    : "No active row node. Start/step the query to view."}
                </p>
              </div>

              {currentStep && currentStep.activeRowNode !== null ? (
                <div className="flex justify-center transition-all duration-350">
                  <svg width="300" height="120" className="overflow-visible">
                    {/* Edges */}
                    <line x1="150" y1="20" x2="80" y2="60" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="150" y1="20" x2="220" y2="60" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="80" y1="60" x2="40" y2="100" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="80" y1="60" x2="120" y2="100" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="220" y1="60" x2="180" y2="100" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="220" y1="60" x2="260" y2="100" stroke="#94a3b8" strokeWidth="1.5" />

                    {/* Nodes */}
                    {[
                      { id: 0, x: 150, y: 20, txt: "[0-3]" },
                      { id: 1, x: 80, y: 60, txt: "[0-1]" },
                      { id: 2, x: 220, y: 60, txt: "[2-3]" },
                      { id: 3, x: 40, y: 100, txt: "[0]" },
                      { id: 4, x: 120, y: 100, txt: "[1]" },
                      { id: 5, x: 180, y: 100, txt: "[2]" },
                      { id: 6, x: 260, y: 100, txt: "[3]" }
                    ].map(n => {
                      const status = innerHighlight[n.id];
                      let fill = "var(--background, #fff)";
                      let stroke = "#64748b";
                      let textWeight = "font-medium";
                      if (status === "visiting") { fill = "#c084fc"; stroke = "#a435f0"; textWeight = "font-bold"; }
                      else if (status === "matched") { fill = "#34d399"; stroke = "#10b981"; textWeight = "font-bold"; }
                      else if (status === "inactive") { fill = "#e2e8f0"; stroke = "#cbd5e1"; }

                      return (
                        <g key={n.id}>
                          <circle cx={n.x} cy={n.y} r="16" fill={fill} stroke={stroke} strokeWidth="2" className="transition-all duration-300" />
                          <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="10" className={`fill-gray-800 dark:fill-gray-250 ${textWeight}`}>
                            {n.txt}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl py-8">
                  <span className="text-gray-400 text-xs">Waiting for tree traversal...</span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Narrative Board / Controls */}
      <div className="border-t border-[#e5e7eb] dark:border-[#222] pt-6 flex flex-col gap-4">
        
        {/* Narrative Box */}
        <div className="bg-[#fcf8ff] dark:bg-purple-950/10 border border-purple-100 dark:border-purple-950/30 p-4 rounded-xl text-sm min-h-[64px] flex items-center">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
            {explanation}
          </p>
        </div>

        {/* Playback Button Group */}
        {steps.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handleStepBackward}
                disabled={currentStepIdx <= 0}
                className="p-2 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 transition"
                title="Step Backward"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="h-10 px-5 rounded-xl bg-[#a435f0] hover:bg-[#8f2cd6] text-white flex items-center gap-2 font-bold text-sm shadow-sm transition"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                <span>{isPlaying ? "Pause" : "Play"}</span>
              </button>

              <button
                onClick={handleStepForward}
                disabled={currentStepIdx >= steps.length - 1}
                className="p-2 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 transition"
                title="Step Forward"
              >
                <ChevronRight size={20} />
              </button>

              <button
                onClick={() => setCurrentStepIdx(0)}
                className="p-2 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                title="Reset Animation"
              >
                <RotateCcw size={18} />
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <span>Step {currentStepIdx + 1} of {steps.length}</span>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1.5">
                <span>Speed:</span>
                <select
                  value={speed}
                  onChange={e => setSpeed(Number(e.target.value))}
                  className="rounded-lg border p-1 dark:bg-gray-800 dark:border-gray-700 focus:outline-none"
                >
                  <option value={2500}>0.5x</option>
                  <option value={1500}>1.0x</option>
                  <option value={800}>2.0x</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

    </VisualizerCard>
  );
}
