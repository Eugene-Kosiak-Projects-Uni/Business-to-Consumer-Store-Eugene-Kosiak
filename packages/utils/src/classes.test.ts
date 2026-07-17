/*
import { expect, test } from "vitest";
import { cx } from "./classes.js";

test("classes correctly combines classes", () => {
  expect(cx("a", "b", "c")).toBe("a b c");
  expect(cx("a", null, undefined)).toBe("a");
  expect(cx("a", { b: true, c: false, d: null })).toBe("a b");
});
*/

import { expect, test } from "vitest";
import { cx } from "./classes.js";


test("combines string classes", () => {
  expect(cx("a", "b", "c")).toBe("a b c");
});


test("ignores null and undefined values", () => {
  expect(cx("a", null, undefined)).toBe("a");
});


test("handles conditional object classes", () => {
  expect(
    cx("a", {
      b: true,
      c: false,
      d: null,
    }),
  ).toBe("a b");
});


test("returns empty string when no classes are provided", () => {
  expect(cx()).toBe("");
});


test("ignores false boolean values", () => {
  expect(cx("a", false)).toBe("a");
});


test("supports multiple object arguments", () => {
  expect(
    cx(
      {
        active: true,
        hidden: false,
      },
      {
        large: true,
      },
    ),
  ).toBe("active large");
});


test("supports mixed string and object classes", () => {
  expect(
    cx(
      "button",
      {
        primary: true,
        disabled: false,
      },
      "rounded",
    ),
  ).toBe("button primary rounded");
});
