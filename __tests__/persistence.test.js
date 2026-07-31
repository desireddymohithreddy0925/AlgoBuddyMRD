import { persistence } from "../src/lib/persistence.js";

describe("PersistenceManager", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("get, set, and remove", () => {
    it("returns null for non-existent storage keys", async () => {
      const result = await persistence.get("PRACTICE_PROGRESS");
      expect(result).toBeNull();
    });

    it("stores and retrieves JSON object values correctly", async () => {
      const data = { problem1: { status: "completed" } };
      persistence.set("PRACTICE_PROGRESS", data);

      const result = await persistence.get("PRACTICE_PROGRESS");
      expect(result).toEqual(data);
    });

    it("handles invalid JSON string gracefully by returning null", async () => {
      localStorage.setItem("algobuddy_bookmarks", "invalid-json-{");
      const result = await persistence.get("BOOKMARKS");
      expect(result).toBeNull();
    });

    it("removes items from localStorage", async () => {
      persistence.set("THEME", "dark");
      expect(await persistence.get("THEME")).toBe("dark");

      persistence.remove("THEME");
      expect(await persistence.get("THEME")).toBeNull();
    });
  });

  describe("mergeProgress", () => {
    it("merges local and server progress, giving precedence to newer server timestamp", () => {
      const local = {
        two_sum: { status: "in_progress", updatedAt: "2026-01-01T00:00:00Z" }
      };
      const server = [
        { problem_id: "two_sum", status: "completed", updated_at: "2026-01-02T00:00:00Z" }
      ];

      const merged = persistence.mergeProgress(local, server, "user-123");
      expect(merged.two_sum.status).toBe("completed");
    });

    it("retains local progress if local timestamp is newer than server timestamp", () => {
      const local = {
        two_sum: { status: "completed", updatedAt: "2026-02-01T00:00:00Z" }
      };
      const server = [
        { problem_id: "two_sum", status: "in_progress", updated_at: "2026-01-01T00:00:00Z" }
      ];

      const merged = persistence.mergeProgress(local, server, "user-123");
      expect(merged.two_sum.status).toBe("completed");
    });
  });

  describe("mergeBookmarks", () => {
    it("deduplicates and merges local and server bookmark arrays", () => {
      const local = [{ id: "1", title: "Two Sum" }, { id: "2", title: "3Sum" }];
      const server = [{ id: "2", title: "3Sum Updated" }, { id: "3", title: "4Sum" }];

      const merged = persistence.mergeBookmarks(local, server, "id");
      expect(merged).toHaveLength(3);
      expect(merged.find((b) => b.id === "2").title).toBe("3Sum Updated");
    });
  });
});
