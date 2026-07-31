"use client";

import { useRef, useEffect, useState } from "react";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import useSwipeGesture from "@/app/hooks/useSwipeGesture";

/**
 * VisualizerCanvas
 *
 * A responsive wrapper for algorithm visualizer canvases / SVG areas.
 * - Listens to window resize and scales down the inner content when it
 *   overflows the container (never scales above 1x).
 * - Attaches swipe-left / swipe-right gestures for step navigation on
 *   touch devices.
 * - Adds `touch-action: manipulation` to prevent the 300 ms tap delay
 *   and disable accidental pinch-zoom on the canvas area.
 * - Provides an optional Export PNG button to download visualization snapshots.
 *
 * @param {object}    props
 * @param {ReactNode} props.children          - the visualizer SVG / canvas
 * @param {Function}  [props.onSwipeLeft]      - step forward (swipe left)
 * @param {Function}  [props.onSwipeRight]     - step back   (swipe right)
 * @param {string}    [props.className]        - extra Tailwind classes
 * @param {*}         [props.watchKey]         - change this value to re-measure
 * @param {boolean}   [props.showExportButton=true] - toggle Export PNG snapshot button
 */
export function VisualizerCanvas({
  children,
  onSwipeLeft,
  onSwipeRight,
  className = "",
  watchKey,
  showExportButton = true,
}) {
  const wrapperRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  // Re-measure when container or data changes
  useEffect(() => {
    function measure() {
      const el = wrapperRef.current;
      if (!el) return;
      const containerWidth = el.parentElement?.clientWidth ?? el.clientWidth;
      const contentWidth   = el.scrollWidth;
      if (contentWidth > containerWidth) {
        setScale(containerWidth / contentWidth);
      } else {
        setScale(1);
      }
    }

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchKey]);

  // Swipe gestures for step navigation
  useSwipeGesture(wrapperRef, {
    onSwipeLeft,
    onSwipeRight,
    threshold: 50,
    enabled: !!(onSwipeLeft || onSwipeRight),
  });

  const handleExportPNG = async () => {
    if (!wrapperRef.current || isExporting) return;
    try {
      setIsExporting(true);
      const canvas = await html2canvas(wrapperRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `algobuddy-visualization-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export visualization PNG:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        // Prevent the 300 ms tap delay on all touch devices
        touchAction: "manipulation",
      }}
    >
      {showExportButton && (
        <button
          type="button"
          onClick={handleExportPNG}
          disabled={isExporting}
          aria-label="Export visualization snapshot as PNG image"
          title="Export PNG Snapshot"
          className="
            absolute top-2 right-2 z-30
            inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
            bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white
            border border-slate-700/80 text-xs font-semibold
            backdrop-blur-md transition-all shadow-sm
            focus:outline-none focus:ring-2 focus:ring-primary
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          <Download size={14} className={isExporting ? "animate-pulse" : ""} aria-hidden="true" />
          <span>{isExporting ? "Exporting..." : "Export PNG"}</span>
        </button>
      )}

      {children}

      {/* Mobile swipe hint — shown only on touch devices via Tailwind */}
      {(onSwipeLeft || onSwipeRight) && (
        <p
          className="
            block sm:hidden
            text-center text-[10px] text-surface-400 dark:text-surface-500
            mt-1 select-none pointer-events-none
          "
          aria-hidden="true"
        >
          ← swipe to step →
        </p>
      )}
    </div>
  );
}
