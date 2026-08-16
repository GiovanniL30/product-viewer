import { AuthService } from "../services/AuthService.js";
import { Button } from "./Button.js";

export class Header {
  constructor(container) {
    this.container = container;
    this.authService = new AuthService();

    window.addEventListener("auth:change", () => {
      this.render();
    });

    this.render();
  }

  render() {
    this.container.replaceChildren();

    const currentUser = this.authService.getCurrentUser();

    const content = document.createElement("div");
    content.classList.add("container", "p-8", "flex", "justify-between", "items-center", "header-content");

    const logo = document.createElement("img");
    logo.classList.add("svi-logo");
    logo.src = "./src/assets/svi_logo.png";
    logo.alt = "svi logo";

    logo.addEventListener("click", () => {
      window.location.hash = "/";
    });

    content.append(logo);

    if (currentUser) {
      content.append(this.createUserMenu(currentUser));
    } else {
      content.append(this.createAuthActions());
    }

    this.container.append(content);
  }

  createAuthActions() {
    const wrapper = document.createElement("div");
    wrapper.classList.add("flex", "items-center", "gap-12");

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

    wrapper.append(login.element, register.element);

    return wrapper;
  }

  createUserMenu(currentUser) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("header-user");

    const username = document.createElement("p");
    username.classList.add("font-bold", "text-sm", "header-user-name");
    username.textContent = currentUser.username;

    const logout = new Button({
      text: "Logout",
      type: "button",
      variant: "secondary",
    });

    logout.addClass("text-xs", "header-logout");

    logout.onClick(() => this.handleLogout());

    wrapper.append(username, logout.element);

    return wrapper;
  }

  getInitials(name) {
    return name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  handleLogout() {
    this.authService.logout();

    window.dispatchEvent(new CustomEvent("auth:change"));

    window.location.hash = "/";
  }
}
