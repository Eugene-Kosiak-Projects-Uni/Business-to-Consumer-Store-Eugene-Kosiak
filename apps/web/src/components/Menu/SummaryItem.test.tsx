/*
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { SummaryItem } from "./SummaryItem";

test("renders non-selected summary item with count", async () => {
  const { getByText } = render(
    <SummaryItem
      count={10}
      isSelected={false}
      link="/my/link"
      name="Link to Content"
      title="Content Title"
    />,
  );
  await expect.element(getByText("10")).toBeInTheDocument();
  await expect.element(getByText("Link to Content")).toBeInTheDocument();
  await expect
    .element(getByText("Link to Content").element().parentElement!)
    .toHaveAttribute("href", "/my/link");

  await expect
    .element(getByText("Link to Content").element().parentElement!)
    .not.toHaveClass("selected");
});

test("renders selected summary item with count", async () => {
  const { getByText } = render(
    <SummaryItem
      count={10}
      isSelected={true}
      link="/my/link"
      name="Link to Content"
      title="Content Title"
    />,
  );

  await expect
    .element(getByText("Link to Content").element().parentElement!)
    .toHaveClass("selected");
});
*/
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { SummaryItem } from "./SummaryItem";


test("renders link text and count", async () => {
  const { getByText } = render(
    <SummaryItem
      name="Electronics"
      count={5}
      link="/category/electronics"
      isSelected={false}
    />
  );


  await expect
    .element(getByText("Electronics"))
    .toBeInTheDocument();


  await expect
    .element(getByText("5"))
    .toBeInTheDocument();
});


test("sets correct href", async () => {
  const { getByText } = render(
    <SummaryItem
      name="Gaming"
      count={3}
      link="/category/gaming"
      isSelected={false}
    />
  );


  await expect
    .element(
      getByText("Gaming")
        .element()
        .parentElement!
    )
    .toHaveAttribute(
      "href",
      "/category/gaming"
    );
});


test("adds selected styling when selected", async () => {
  const { getByText } = render(
    <SummaryItem
      name="Gaming"
      count={3}
      link="/category/gaming"
      isSelected={true}
    />
  );


  await expect
    .element(
      getByText("Gaming")
        .element()
        .parentElement!
    )
    .toHaveClass(
      "font-bold"
    );
});