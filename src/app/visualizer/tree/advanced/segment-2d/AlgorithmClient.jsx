import Segment2DAnimation from "@/app/visualizer/tree/advanced/segment-2d/animation";
import Segment2DContent from "@/app/visualizer/tree/advanced/segment-2d/content";
import Segment2DCode from "@/app/visualizer/tree/advanced/segment-2d/codeBlock";
import Segment2DQuiz from "@/app/visualizer/tree/advanced/segment-2d/quiz";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export default function SegmentTree2DPage() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Tree", "Advanced Trees", "2D Segment Trees")}
      title="2D Segment Trees"
      animation={<Segment2DAnimation />}
      content={<Segment2DContent />}
      code={<Segment2DCode />}
      quiz={<Segment2DQuiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.segmentTree2D}
          description="Mark 2D Segment Tree as done and track your progress"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other Advanced Trees"
          links={[
            { text: "Segment Trees (1D)", url: "./segment" },
            { text: "Red-Black Trees", url: "./red-black" },
            { text: "B-Trees", url: "./b-trees" },
            { text: "Trie (Prefix Tree)", url: "./trie" },
            { text: "Fenwick Trees", url: "./fenwick" }
          ]}
        />
      }
    />
  );
}
