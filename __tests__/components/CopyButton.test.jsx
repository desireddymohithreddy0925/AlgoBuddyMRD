import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import CopyButton from "@/app/components/ui/CopyButton";
import { toast } from "react-hot-toast";

jest.mock("react-hot-toast", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("CopyButton", () => {
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

  it("copies trimmed text and shows the success toast", async () => {
    render(
      <CopyButton
        text="  O(n log n)  "
        ariaLabel="Copy time complexity"
      />
    );

    const button = screen.getByRole("button", { name: /copy time complexity/i });
    expect(button).toHaveAttribute("title", "Copy time complexity");
    expect(button.className).toContain("focus-visible:ring-2");

    fireEvent.click(button);

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith("O(n log n)");
      expect(toast.success).toHaveBeenCalledWith("Copied to clipboard!");
    });
  });
});