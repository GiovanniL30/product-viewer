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

    content.append(logo);

    if (currentUser) {
      content.append(this.createUserMenu(currentUser));
    }

    this.container.append(content);
  }

  createUserMenu(currentUser) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("header-user");

    const avatar = document.createElement("div");
    avatar.classList.add("header-avatar");
    avatar.textContent = this.getInitials(currentUser.username);

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

    wrapper.append(avatar, username, logout.element);

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