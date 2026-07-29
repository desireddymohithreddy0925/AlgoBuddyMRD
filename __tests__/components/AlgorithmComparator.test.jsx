import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AlgorithmComparator from "@/app/visualizer/complexity-analyzer/components/AlgorithmComparator";
import { toast } from "react-hot-toast";

jest.mock("react-hot-toast", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("AlgorithmComparator copy controls", () => {
  let writeTextMock;

  beforeEach(() => {
    jest.clearAllMocks();
    writeTextMock = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(global.navigator, "clipboard", {
      value: {
        writeText: writeTextMock,
      },
      writable: true,
      configurable: true,
    });
  });

  it("copies the exact time and space complexity values", async () => {
    render(
      <AlgorithmComparator
        algorithms={[
          { name: "Binary Search", time: "O(log n)", space: "O(1)" },
        ]}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /copy time complexity for binary search/i }));
    fireEvent.click(screen.getByRole("button", { name: /copy space complexity for binary search/i }));

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenNthCalledWith(1, "O(log n)");
      expect(writeTextMock).toHaveBeenNthCalledWith(2, "O(1)");
      expect(toast.success).toHaveBeenCalledTimes(2);
      expect(toast.success).toHaveBeenCalledWith("Copied to clipboard!");
    });
  });
});