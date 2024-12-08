import { registerComponent } from "../core";

registerComponent("Card", (props: { title?: string; content?: string }) => {
  const card = document.createElement("div");
  card.className = "card";

  if (props.title) {
    const title = document.createElement("h2");
    title.textContent = props.title;
    card.appendChild(title);
  }

  if (props.content) {
    const content = document.createElement("p");
    content.textContent = props.content;
    card.appendChild(content);
  }

  return card;
});
