import { describe, it, expect, vi } from "vitest";
import { isValidElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { render, fireEvent } from "@testing-library/react";
import { renderReactComponent } from "../src/adapters/react-adapter";

describe("renderReactComponent", () => {
  it("returns a valid React element", () => {
    const el = renderReactComponent({ type: "div" });
    expect(isValidElement(el)).toBe(true);
  });

  it("renders a simple tag with text", () => {
    const html = renderToStaticMarkup(
      renderReactComponent({ type: "h1", children: ["Hello"] })
    );
    expect(html).toBe("<h1>Hello</h1>");
  });

  it("renders nested children in order", () => {
    const html = renderToStaticMarkup(
      renderReactComponent({
        type: "ul",
        children: [
          { type: "li", children: ["a"] },
          { type: "li", children: ["b"] },
        ],
      })
    );
    expect(html).toBe("<ul><li>a</li><li>b</li></ul>");
  });

  it("does not interpret string children as HTML", () => {
    const html = renderToStaticMarkup(
      renderReactComponent({
        type: "div",
        children: ["<script>alert(1)</script>"],
      })
    );
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>");
  });

  it("wires React event handlers", () => {
    const handler = vi.fn();
    const { container } = render(
      renderReactComponent({
        type: "button",
        props: { onClick: handler },
        children: ["click me"],
      })
    );
    fireEvent.click(container.querySelector("button")!);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("does not warn about missing keys for sibling children", () => {
    const warn = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      renderReactComponent({
        type: "ul",
        children: [
          { type: "li", children: ["a"] },
          { type: "li", children: ["b"] },
        ],
      })
    );
    const keyWarnings = warn.mock.calls.filter((args) =>
      String(args[0] ?? "").includes("unique \"key\"")
    );
    expect(keyWarnings).toEqual([]);
    warn.mockRestore();
  });
});
