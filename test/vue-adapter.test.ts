import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { renderVueComponent } from "../src/adapters/vue-adapter";

describe("renderVueComponent", () => {
  it("mounts and renders the requested tag", () => {
    const wrapper = mount(renderVueComponent({ type: "section" }));
    expect(wrapper.element.tagName).toBe("SECTION");
  });

  it("renders text children", () => {
    const wrapper = mount(
      renderVueComponent({ type: "h2", children: ["Hello Vue"] })
    );
    expect(wrapper.text()).toBe("Hello Vue");
  });

  it("renders nested component children", () => {
    const wrapper = mount(
      renderVueComponent({
        type: "ul",
        children: [
          { type: "li", children: ["a"] },
          { type: "li", children: ["b"] },
        ],
      })
    );
    const items = wrapper.findAll("li");
    expect(items).toHaveLength(2);
    expect(items[0].text()).toBe("a");
    expect(items[1].text()).toBe("b");
  });

  it("does not interpret string children as HTML", () => {
    const wrapper = mount(
      renderVueComponent({
        type: "div",
        children: ["<script>alert(1)</script>"],
      })
    );
    expect(wrapper.html()).not.toContain("<script>");
    expect(wrapper.text()).toBe("<script>alert(1)</script>");
  });
});
