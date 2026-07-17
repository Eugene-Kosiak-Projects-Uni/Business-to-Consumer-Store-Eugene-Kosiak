/*
import { expect, test } from "vitest";
import { toUrlPath } from "./url.js";

test("converts path to URL-friendly format", () => {
  expect(toUrlPath("Hello World!")).toBe("hello-world");
  expect(toUrlPath("This is a test")).toBe("this-is-a-test");
  expect(toUrlPath("Multiple---hyphens")).toBe("multiple-hyphens");
  expect(toUrlPath("Leading and trailing hyphens-")).toBe(
    "leading-and-trailing-hyphens",
  );
  expect(toUrlPath("Special@#%characters")).toBe("special-characters");
  expect(toUrlPath("UPPERCASE and lowercase")).toBe("uppercase-and-lowercase");
  expect(toUrlPath("")).toBe("");
});
*/
import { expect, test } from "vitest";
import { toUrlPath } from "./url.js";


test("converts spaces into hyphens", () => {
  expect(toUrlPath("Hello World")).toBe("hello-world");
});


test("converts uppercase characters to lowercase", () => {
  expect(toUrlPath("UPPERCASE")).toBe("uppercase");
});


test("removes special characters", () => {
  expect(toUrlPath("Special@#%characters"))
    .toBe("special-characters");
});


test("removes multiple sequential hyphens", () => {
  expect(toUrlPath("Multiple---hyphens"))
    .toBe("multiple-hyphens");
});


test("removes leading and trailing hyphens", () => {
  expect(
    toUrlPath("-Hello World-"),
  ).toBe("hello-world");
});


test("handles empty strings", () => {
  expect(toUrlPath("")).toBe("");
});


test("handles numbers", () => {
  expect(toUrlPath("Product 123"))
    .toBe("product-123");
});


test("handles already formatted URLs", () => {
  expect(
    toUrlPath("my-product-page"),
  ).toBe("my-product-page");
});


test("removes only invalid characters", () => {
  expect(
    toUrlPath("hello_world.test"),
  ).toBe("hello-world-test");
});
