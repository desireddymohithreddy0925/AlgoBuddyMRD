"use client";

import React from "react";

import TailRecursionAnimation from "./animation";
import TailRecursionContent from "./content";
import TailRecursionCode from "./codeBlock";

import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";

import ExploreOther from "@/app/components/ui/exploreOther";

export default function TailRecursionClient() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Recursion", "Tail Recursion")}
      title="Tail Recursion"
      headerDescription="Learn how Tail Recursion works and how compilers optimize recursive calls."

      animation={<TailRecursionAnimation />}
      content={<TailRecursionContent />}
      code={<TailRecursionCode />}

      exploreOther={
        <ExploreOther
          title="Explore Other Topics"
          links={[
            {
              text: "Basic Recursion",
              url: "/visualizer/recursion/basic-recursion",
            },
            {
              text: "Functional & Parameterized",
              url: "/visualizer/recursion/functional-parameterized",
            },
            {
              text: "Multiple Recursive Calls",
              url: "/visualizer/recursion/multiple-calls",
            },
          ]}
        />
      }
    />
  );
}