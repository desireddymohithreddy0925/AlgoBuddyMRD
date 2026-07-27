import { buildBIT, updateGenerator, queryGenerator } from "../src/features/algorithms/tree/fenwickTreeLogic.js";

describe("fenwickTreeLogic", () => {
  describe("buildBIT", () => {
    it("should correctly build a 1-indexed BIT from an input array", () => {
      // 1-indexed array: [0, 3, 2, -1, 6, 5, 4, -3, 3, 7, 2, 3]
      const arr = [0, 3, 2, -1, 6, 5, 4, -3, 3, 7, 2, 3];
      const bit = buildBIT(arr);

      expect(bit.length).toBe(arr.length);
      // Index 1 prefix sum = 3
      expect(bit[1]).toBe(3);
      // Index 2 prefix sum = 3 + 2 = 5
      expect(bit[2]).toBe(5);
    });
  });

  describe("updateGenerator", () => {
    it("yields an error step when index is out of bounds", () => {
      const arr = [0, 1, 2, 3];
      const bit = buildBIT(arr);
      const gen = updateGenerator(0, 5, arr, bit, 3);
      const first = gen.next().value;

      expect(first.type).toBe("error");
      expect(first.message).toContain("Please enter a valid index");
    });

    it("yields update steps and completes correctly for valid index and delta", () => {
      const baseArray = [0, 1, 2, 3, 4]; // n = 4
      const bit = buildBIT(baseArray);
      const gen = updateGenerator(2, 3, baseArray, bit, 4);

      const steps = [];
      let res = gen.next();
      while (!res.done) {
        steps.push(res.value);
        res = gen.next();
      }

      const initialStep = steps[0];
      expect(initialStep.type).toBe("step");
      expect(initialStep.highlightedBIT).toEqual({ 2: "visiting" });

      const lastStep = steps[steps.length - 1];
      expect(lastStep.type).toBe("complete");
      expect(lastStep.newBase[2]).toBe(5); // 2 + 3
    });
  });

  describe("queryGenerator", () => {
    it("yields error when range L > R or indices are invalid", () => {
      const bit = [0, 1, 3, 3, 10];
      const gen = queryGenerator(3, 2, bit, 4);
      const step = gen.next().value;

      expect(step.type).toBe("error");
      expect(step.message).toContain("valid range");
    });

    it("calculates correct range sum for valid range L..R", () => {
      const baseArray = [0, 2, 4, 6, 8, 10]; // 1-indexed values: 2, 4, 6, 8, 10
      const n = 5;
      const bit = buildBIT(baseArray);

      // Range 2..4: sum of [4, 6, 8] = 18
      const gen = queryGenerator(2, 4, bit, n);
      const steps = [];
      let res = gen.next();
      while (!res.done) {
        steps.push(res.value);
        res = gen.next();
      }

      const completeStep = steps[steps.length - 1];
      expect(completeStep.type).toBe("complete");
      expect(completeStep.result).toBe("Sum[2..4] = 18");
    });
  });
});
