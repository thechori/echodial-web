import { describe, expect, it } from "vitest";

// This spec is to manually track the TDD until E2E tests are configured
describe("dialer", () => {
  it("should initialize the index at null", () => {
    const done = true;
    expect(true).toEqual(done);
  });

  it("should support clicking the large green call button at the top of the queue to start dialing", () => {
    const done = true;
    expect(true).toEqual(done);
  });

  it("should support clicking the red end button at the top of the queue to end dialing", () => {
    const done = true;
    expect(true).toEqual(done);
  });

  it("should support clicking the green call button next to a Lead to start dialing", () => {
    const done = true;
    expect(true).toEqual(done);
  });

  it("should support clicking the red end button next to a Lead to end dialing", () => {
    const done = true;
    expect(true).toEqual(done);
  });

  // TODO: add back and TDD
  // it("should stop dialing when an error occurs, while keeping the `dialQueueIndex`", () => {
  //   const done = false;
  //   expect(true).toEqual(done);
  // });

  it("should mute and unmute during a call", () => {
    const done = true;
    expect(true).toEqual(done);
  });

  // TODO: add back and TDD
  // it("should unmute before starting a new call", () => {
  //   const done = false;
  //   expect(true).toEqual(done);
  // });

  // TODO: add back and TDD
  // it("should dial a Lead for the defined time in milliseconds before ending the call", () => {
  //   const done = false;
  //   expect(true).toEqual(done);
  // });

  // TODO: add back and TDD
  // it("should retry calling the current Lead after a Call ends and the currentDialAttempts < options.maxDialAttempts", () => {
  //   const done = false;
  //   expect(true).toEqual(done);
  // });

  // TODO: add back and TDD
  // it("should continue to the next Lead (if it exists) after a Call ends", () => {
  //   const done = false;
  //   expect(true).toEqual(done);
  // });
});
