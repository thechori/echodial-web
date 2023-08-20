import { describe, it, expect } from "vitest";
//
import deltaPercentageCalculator from "./delta-percentage-calculator";

describe("delta percentage calculator", () => {
  it("handles all zero numbers", () => {
    const previousValue = 0;
    const currentValue = 0;
    const expectedOutput = 0;
    expect(deltaPercentageCalculator(previousValue, currentValue)).toEqual(
      expectedOutput
    );
  });

  it("handles a zero previous value", () => {
    const previousValue = 0;
    const currentValue = 10;
    const expectedOutput = 100;
    expect(deltaPercentageCalculator(previousValue, currentValue)).toEqual(
      expectedOutput
    );
  });

  it("handles a zero current value", () => {
    const previousValue = 100;
    const currentValue = 0;
    const expectedOutput = -100;
    expect(deltaPercentageCalculator(previousValue, currentValue)).toEqual(
      expectedOutput
    );
  });

  it("handles a standard increase of 10%", () => {
    const previousValue = 100;
    const currentValue = 110;
    const expectedOutput = 10;
    expect(deltaPercentageCalculator(previousValue, currentValue)).toEqual(
      expectedOutput
    );
  });

  it("handles a standard increase of 25%", () => {
    const previousValue = 100;
    const currentValue = 125;
    const expectedOutput = 25;
    expect(deltaPercentageCalculator(previousValue, currentValue)).toEqual(
      expectedOutput
    );
  });

  it("handles a standard decrease of 10%", () => {
    const previousValue = 100;
    const currentValue = 90;
    const expectedOutput = -10;
    expect(deltaPercentageCalculator(previousValue, currentValue)).toEqual(
      expectedOutput
    );
  });

  it("handles a standard decrease of 25%", () => {
    const previousValue = 100;
    const currentValue = 75;
    const expectedOutput = -25;
    expect(deltaPercentageCalculator(previousValue, currentValue)).toEqual(
      expectedOutput
    );
  });

  it("handles a rounded decrease of 66%", () => {
    const previousValue = 35;
    const currentValue = 12;
    const expectedOutput = -66;
    expect(deltaPercentageCalculator(previousValue, currentValue)).toEqual(
      expectedOutput
    );
  });
});
