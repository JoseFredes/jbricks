import { describe, it, expect } from "vitest";
import { renderDOMComponent } from "../src/adapters/generic-adapter";

describe("renderDOMComponent", () => {
  it("returns an HTMLElement", () => {
    const el = renderDOMComponent({ type: "div" });
    expect(el).toBeInstanceOf(HTMLElement);
  });

  it("delegates to renderComponentFromJSON for nested trees", () => {
    const el = renderDOMComponent({
      type: "section",
      props: { className: "wrap" },
      children: [{ type: "h1", children: ["Title"] }],
    });
    expect(el.tagName).toBe("SECTION");
    expect(el.className).toBe("wrap");
    expect(el.querySelector("h1")?.textContent).toBe("Title");
  });

  it("propagates validation errors from core", () => {
    expect(() => renderDOMComponent({ type: "<bad>" })).toThrow(TypeError);
  });
});
