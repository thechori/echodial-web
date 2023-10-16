import { describe, it, expect } from "vitest";
//
import { capitalizeFirstLetter } from "./string-formatters";

describe("capitalizeFirstLetter", () => {
  it("capitalizes a simple word", () => {
    const input = "new";
    const output = "New";
    expect(capitalizeFirstLetter(input)).toEqual(output);
  });

  it("handles empty string", () => {
    const input = "";
    const output = "";
    expect(capitalizeFirstLetter(input)).toEqual(output);
  });

  it("only capitalizes the first word in a sentence", () => {
    const input = "new world order";
    const output = "New world order";
    expect(capitalizeFirstLetter(input)).toEqual(output);
  });
});
