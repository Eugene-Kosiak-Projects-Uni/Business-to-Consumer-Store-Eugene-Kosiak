/*
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { LinkList } from "./LinkList";

test("renders content with title", async () => {
  const { getByText } = render(
    <LinkList title={"My List"}>Hello World</LinkList>,
  );
  await expect.element(getByText("My List")).toBeInTheDocument();
  await expect.element(getByText("Hello World")).toBeInTheDocument();
});
*/
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { LinkList } from "./LinkList";

test("renders title and children", async () => {
  const { getByText } = render(
    <LinkList title="Categories">
      <p>Product Category</p>
    </LinkList>
  );

  await expect
    .element(getByText("Categories"))
    .toBeInTheDocument();

  await expect
    .element(getByText("Product Category"))
    .toBeInTheDocument();
});


test("renders multiple children", async () => {
  const { getByText } = render(
    <LinkList title="Tags">
      <>
        <p>Gaming</p>
        <p>Technology</p>
      </>
    </LinkList>
  );

  await expect
    .element(getByText("Gaming"))
    .toBeInTheDocument();

  await expect
    .element(getByText("Technology"))
    .toBeInTheDocument();
});