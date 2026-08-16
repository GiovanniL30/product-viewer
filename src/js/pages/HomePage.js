import { Page } from "./Page.js";
import { Button } from "../components/Button.js";

export class HomePage extends Page {
  render() {
    const container = document.createElement("div");

    container.classList.add("page-center");

    const title = document.createElement("h1");

    title.classList.add("text-3xl", "font-bold", "text-primary");

    title.textContent = "Welcome";

    const description = document.createElement("p");

    description.classList.add("text-sm", "text-muted", "mt-8");

    description.textContent = "Browse the product catalog and discover great deals.";

    const browse = new Button({
      text: "Browse Products",
      type: "button",
      variant: "text",
    });

    browse.addClass("mt-24");

    browse.onClick(() => {
      window.location.hash = "/products";
    });

    container.append(title, description, browse.element);

    this.container.append(container);
  }
}