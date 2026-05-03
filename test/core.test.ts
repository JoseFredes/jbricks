import { describe, it, expect, vi } from "vitest";
import { renderComponentFromJSON } from "../src/core";
import type { JSONComponent } from "../src/types";

describe("renderComponentFromJSON — input validation", () => {
  it("throws when input is null", () => {
    expect(() => renderComponentFromJSON(null as unknown as JSONComponent))
      .toThrow(TypeError);
  });

  it("throws when input is undefined", () => {
    expect(() => renderComponentFromJSON(undefined as unknown as JSONComponent))
      .toThrow(TypeError);
  });

  it("throws when input is a primitive", () => {
    expect(() => renderComponentFromJSON("div" as unknown as JSONComponent))
      .toThrow(TypeError);
    expect(() => renderComponentFromJSON(42 as unknown as JSONComponent))
      .toThrow(TypeError);
  });

  it("throws when type is missing", () => {
    expect(() => renderComponentFromJSON({} as JSONComponent)).toThrow(TypeError);
  });

  it("throws on tag with leading digit", () => {
    expect(() => renderComponentFromJSON({ type: "1div" })).toThrow(TypeError);
  });

  it("throws on tag containing a space (would allow attribute injection)", () => {
    expect(() =>
      renderComponentFromJSON({ type: "div onclick=alert(1)" })
    ).toThrow(TypeError);
  });

  it("throws on tag with angle brackets", () => {
    expect(() => renderComponentFromJSON({ type: "<script>" })).toThrow(TypeError);
  });

  it("accepts custom element tags with hyphens", () => {
    const el = renderComponentFromJSON({ type: "my-widget" });
    expect(el.tagName.toLowerCase()).toBe("my-widget");
  });
});

describe("renderComponentFromJSON — basic rendering", () => {
  it("creates the element with the requested tag", () => {
    const el = renderComponentFromJSON({ type: "section" });
    expect(el).toBeInstanceOf(HTMLElement);
    expect(el.tagName).toBe("SECTION");
  });

  it("renders without props or children", () => {
    const el = renderComponentFromJSON({ type: "div" });
    expect(el.attributes.length).toBe(0);
    expect(el.childNodes.length).toBe(0);
  });
});

describe("renderComponentFromJSON — className and style", () => {
  it("sets className", () => {
    const el = renderComponentFromJSON({
      type: "div",
      props: { className: "foo bar" },
    });
    expect(el.className).toBe("foo bar");
  });

  it("does not duplicate className as an attribute", () => {
    const el = renderComponentFromJSON({
      type: "div",
      props: { className: "foo" },
    });
    // className is set, but the loop should skip setAttribute("className", ...)
    expect(el.getAttribute("classname")).toBeNull();
  });

  it("applies camelCase style properties", () => {
    const el = renderComponentFromJSON({
      type: "div",
      props: { style: { backgroundColor: "red", fontSize: "12px" } },
    });
    expect(el.style.backgroundColor).toBe("red");
    expect(el.style.fontSize).toBe("12px");
  });

  it("does not also set style as an attribute string", () => {
    const el = renderComponentFromJSON({
      type: "div",
      props: { style: { color: "blue" } },
    });
    // The style key should be skipped in the generic attribute loop.
    // It should only be applied via element.style.
    expect(el.style.color).toBe("blue");
  });
});

describe("renderComponentFromJSON — attributes", () => {
  it("sets arbitrary string attributes", () => {
    const el = renderComponentFromJSON({
      type: "a",
      props: { href: "https://example.com", "data-id": "42" },
    });
    expect(el.getAttribute("href")).toBe("https://example.com");
    expect(el.getAttribute("data-id")).toBe("42");
  });

  it("coerces numeric attribute values to strings", () => {
    const el = renderComponentFromJSON({
      type: "input",
      props: { tabindex: 3 },
    });
    expect(el.getAttribute("tabindex")).toBe("3");
  });

  it("skips null and undefined attribute values", () => {
    const el = renderComponentFromJSON({
      type: "div",
      props: { id: null, title: undefined },
    });
    expect(el.hasAttribute("id")).toBe(false);
    expect(el.hasAttribute("title")).toBe(false);
  });

  it("stringifies boolean attributes (current behavior)", () => {
    // Documents existing behavior: booleans are coerced via String().
    const el = renderComponentFromJSON({
      type: "input",
      props: { disabled: true },
    });
    expect(el.getAttribute("disabled")).toBe("true");
  });
});

describe("renderComponentFromJSON — event handlers", () => {
  it("attaches onClick as a click listener", () => {
    const handler = vi.fn();
    const el = renderComponentFromJSON({
      type: "button",
      props: { onClick: handler },
    });
    el.dispatchEvent(new Event("click"));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("normalizes the event name to lowercase", () => {
    const handler = vi.fn();
    const el = renderComponentFromJSON({
      type: "div",
      props: { onMouseEnter: handler },
    });
    el.dispatchEvent(new Event("mouseenter"));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("does not set the handler as an attribute", () => {
    const el = renderComponentFromJSON({
      type: "button",
      props: { onClick: () => {} },
    });
    expect(el.hasAttribute("onclick")).toBe(false);
  });

  it("falls back to setAttribute when an on* prop is not a function", () => {
    const el = renderComponentFromJSON({
      type: "button",
      props: { onClick: "alert(1)" },
    });
    // Current behavior: non-function on* values become attributes (string-coerced).
    expect(el.getAttribute("onClick")).toBe("alert(1)");
  });
});

describe("renderComponentFromJSON — children", () => {
  it("renders string children as text nodes (no HTML interpretation)", () => {
    const el = renderComponentFromJSON({
      type: "div",
      children: ["<script>alert(1)</script>"],
    });
    expect(el.childNodes.length).toBe(1);
    expect(el.firstChild?.nodeType).toBe(Node.TEXT_NODE);
    expect(el.textContent).toBe("<script>alert(1)</script>");
    expect(el.querySelector("script")).toBeNull();
  });

  it("renders nested component children", () => {
    const el = renderComponentFromJSON({
      type: "ul",
      children: [
        { type: "li", children: ["one"] },
        { type: "li", children: ["two"] },
      ],
    });
    const items = el.querySelectorAll("li");
    expect(items.length).toBe(2);
    expect(items[0].textContent).toBe("one");
    expect(items[1].textContent).toBe("two");
  });

  it("renders mixed string and component children in order", () => {
    const el = renderComponentFromJSON({
      type: "p",
      children: ["before ", { type: "strong", children: ["bold"] }, " after"],
    });
    expect(el.childNodes.length).toBe(3);
    expect(el.textContent).toBe("before bold after");
  });

  it("handles deep nesting", () => {
    const tree: JSONComponent = {
      type: "div",
      children: [
        { type: "div", children: [{ type: "span", children: ["leaf"] }] },
      ],
    };
    const el = renderComponentFromJSON(tree);
    expect(el.querySelector("span")?.textContent).toBe("leaf");
  });

  it("renders an empty children array as no children", () => {
    const el = renderComponentFromJSON({ type: "div", children: [] });
    expect(el.childNodes.length).toBe(0);
  });
});
