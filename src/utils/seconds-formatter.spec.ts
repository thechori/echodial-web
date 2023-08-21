import { describe, it, expect } from "vitest";
import secondsFormatter from "./seconds-formatter";

describe("secondsFormatter", () => {
  it("properly formats a zero time", () => {
    const input = 0;
    const output = "00:00:00";
    expect(secondsFormatter(input)).toEqual(output);
  });

  it("properly formats a standard time under 1 minute", () => {
    const input = 30;
    const output = "00:00:30";
    expect(secondsFormatter(input)).toEqual(output);
  });

  it("properly formats a standard time under 1 hour", () => {
    const input = 600;
    const output = "00:10:00";
    expect(secondsFormatter(input)).toEqual(output);
  });

  it("properly formats a standard time over 1 hour", () => {
    const input = 6000;
    const output = "01:40:00";
    expect(secondsFormatter(input)).toEqual(output);
  });
});
