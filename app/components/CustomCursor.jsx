"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  // Smooth tracking k lye motion values
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Modern spring physics k lye lag effect (Safest configuration)
  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const savedPreference = localStorage.getItem("customCursorEnabled");
    if (savedPreference !== null) {
      setIsEnabled(savedPreference === "true");
    }

    const handleToggle = (e) => setIsEnabled(e.detail);
    window.addEventListener("toggleCustomCursor", handleToggle);

    return () => window.removeEventListener("toggleCustomCursor", handleToggle);
  }, []);

  useEffect(() => {
    if (!isEnabled) {
      document.body.classList.remove("custom-cursor-active");
      return;
    }

    document.body.classList.add("custom-cursor-active");

    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const addHoverEvents = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, [role="button"], input, select, textarea, .interactive-card'
      );
      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", () => setIsHovered(true));
        el.addEventListener("mouseleave", () => setIsHovered(false));
        el.addEventListener("mousedown", () => setIsActive(true));
        el.addEventListener("mouseup", () => setIsActive(false));
      });
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    const observer = new MutationObserver(addHoverEvents);
    observer.observe(document.body, { childList: true, subtree: true });
    addHoverEvents();

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      observer.disconnect();
      document.body.classList.remove("custom-cursor-active");
    };
  }, [isEnabled, cursorX, cursorY, isVisible]);

  // SAFEST: Mobile touch pointers par default fall-back safe mechanism
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  if (!isEnabled || !isVisible) return null;

  return (
    <>
      {/* Central Solid Dot: Exact mouse pointer point */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-purple-500 rounded-full pointer-events-none z-[9999]"
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
      />
      {/* Dynamic Trailing Glow Ring: Fluid movement effect */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-purple-500 rounded-full pointer-events-none z-[9998]"
        style={{ x: cursorXSpring, y: cursorYSpring, translateX: "-50%", translateY: "-50%" }}
        animate={{
          scale: isActive ? 0.8 : isHovered ? 1.6 : 1,
          backgroundColor: isHovered ? "rgba(147, 51, 234, 0.15)" : "rgba(147, 51, 234, 0)",
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.2 }}
      />
    </>
  );
}