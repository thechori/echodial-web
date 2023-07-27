import { describe, it, expect } from "vitest";
//
import phoneFormatter from "./phone-formatter";

describe("phone number formatter", () => {
  it("properly formats phone numbers to be human readable", () => {
    const input = "+18326460869";
    const expectedOutput = "(832) 646-0869";
    expect(phoneFormatter(input)).toEqual(expectedOutput);
  });
});
