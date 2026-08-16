import { Page } from "./Page.js";
import { Button } from "../components/Button.js";
import { AuthService } from "../services/AuthService.js";

export class HomePage extends Page {
  authService = new AuthService();

  render() {
    const currentUser = this.authService.getCurrentUser();

    const container = this.createContainer();
    const card = this.createCard();

    if (currentUser) {
      card.append(this.createWelcome(currentUser), this.createUserActions());
    } else {
      card.append(this.createGuestHeader(), this.createAuthActions());
    }

    container.append(card);

    this.container.append(container);
  }

  createContainer() {
    const container = document.createElement("div");

    container.classList.add("container-sm");

    return container;
  }

  createCard() {
    const card = document.createElement("div");

    card.classList.add("bg-white", "p-24", "rounded-lg", "flex", "flex-col", "gap-20");

    return card;
  }

  createWelcome(currentUser) {
    const container = document.createElement("div");

    container.classList.add("flex", "flex-col", "gap-8");

    const title = document.createElement("h1");

    title.classList.add("text-2xl", "font-bold", "text-primary");

    title.textContent = `Welcome back, ${currentUser.username}!`;

    const description = document.createElement("p");

    description.classList.add("text-sm", "text-muted");

    description.textContent = `You are signed in as ${currentUser.username}. Browse and manage the product catalog.`;

    container.append(title, description);

    return container;
  }

  createGuestHeader() {
    const container = document.createElement("div");

    container.classList.add("flex", "flex-col", "gap-8");

    const title = document.createElement("h1");

    title.classList.add("text-2xl", "font-bold", "text-primary");

    title.textContent = "Welcome";

    const description = document.createElement("p");

    description.classList.add("text-sm", "text-muted");

    description.textContent = "Log in to your account or create one to start browsing products.";

    container.append(title, description);

    return container;
  }

  createUserActions() {
    const actions = document.createElement("div");

    actions.classList.add("flex", "gap-12");

    const products = new Button({
      text: "View Products",
      type: "button",
      variant: "primary",
    });

    products.onClick(() => {
      window.location.hash = "/products";
    });

    const logout = new Button({
      text: "Logout",
      type: "button",
      variant: "secondary",
    });

    logout.onClick(() => this.handleLogout());

    actions.append(products.element, logout.element);

    return actions;
  }

  createAuthActions() {
    const actions = document.createElement("div");

    actions.classList.add("flex", "gap-12");

    const login = new Button({
      text: "Login",
      type: "button",
      variant: "primary",
    });

    login.onClick(() => {
      window.location.hash = "/login";
    });

    const register = new Button({
      text: "Register",
      type: "button",
      variant: "secondary",
    });

    register.onClick(() => {
      window.location.hash = "/register";
    });

    actions.append(login.element, register.element);

    return actions;
  }

  handleLogout() {
    this.authService.logout();

    window.dispatchEvent(new CustomEvent("auth:change"));

    this.container.replaceChildren();

    this.render();
  }
}