import { Input } from "../components/Input.js";
import { Button } from "../components/Button.js";
import { Page } from "./Page.js";
import { AuthService } from "../services/AuthService.js";

export class RegisterPage extends Page {
  authService = new AuthService();

  usernameInput;
  passwordInput;
  confirmPasswordInput;
  registerButton;
  errorElement;

  render() {
    const pageContainer = this.createPageContainer();

    const container = this.createContainer();
    const card = this.createCard();

    card.append(this.createHeader(), this.createForm());

    container.append(card);

    pageContainer.append(container);

    this.container.append(pageContainer);
  }

  createPageContainer() {
    const container = document.createElement("div");

    container.classList.add("login-page-container");

    return container;
  }

  createContainer() {
    const container = document.createElement("div");

    container.classList.add("container-sm");

    return container;
  }

  createCard() {
    const card = document.createElement("div");

    card.classList.add("bg-white", "p-24", "rounded-lg");

    return card;
  }

  createHeader() {
    const container = document.createElement("div");

    container.classList.add("flex", "flex-col", "gap-4", "mb-24");

    const title = document.createElement("h1");

    title.classList.add("text-2xl", "font-bold", "text-primary");

    title.textContent = "Create an account";

    const description = document.createElement("p");

    description.classList.add("text-sm", "text-muted");

    description.textContent = "Register to start browsing products.";

    container.append(title, description);

    return container;
  }

  createForm() {
    const form = document.createElement("form");

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      this.handleRegister();
    });

    const fields = document.createElement("div");

    fields.classList.add("flex", "flex-col", "gap-20");

    fields.append(
      this.createUsernameField(),
      this.createPasswordField(),
      this.createConfirmPasswordField(),
      this.createSubmitButton(),
      this.createError(),
      this.createLoginLink(),
    );

    form.append(fields);

    return form;
  }

  createUsernameField() {
    const container = this.createFieldContainer();

    const label = this.createLabel("Username");

    this.usernameInput = new Input({
      type: "text",
      name: "username",
      id: "username",
      placeholder: "Enter a username",
      autocomplete: "username",
      required: true,
    });

    label.htmlFor = this.usernameInput.element.id;

    container.append(label, this.usernameInput.element);

    return container;
  }

  createPasswordField() {
    const container = this.createFieldContainer();

    const label = this.createLabel("Password");

    this.passwordInput = new Input({
      type: "password",
      name: "password",
      id: "password",
      placeholder: "Enter a password",
      autocomplete: "new-password",
      required: true,
    });

    label.htmlFor = this.passwordInput.element.id;

    container.append(label, this.passwordInput.element);

    return container;
  }

  createConfirmPasswordField() {
    const container = this.createFieldContainer();

    const label = this.createLabel("Confirm Password");

    this.confirmPasswordInput = new Input({
      type: "password",
      name: "confirmPassword",
      id: "confirmPassword",
      placeholder: "Repeat your password",
      autocomplete: "new-password",
      required: true,
    });

    label.htmlFor = this.confirmPasswordInput.element.id;

    container.append(label, this.confirmPasswordInput.element);

    return container;
  }

  createFieldContainer() {
    const container = document.createElement("div");

    container.classList.add("flex", "flex-col", "gap-4");

    return container;
  }

  createLabel(text) {
    const label = document.createElement("label");

    label.classList.add("font-bold", "text-sm");

    label.textContent = text;

    return label;
  }

  createSubmitButton() {
    this.registerButton = new Button({
      text: "Register",
      type: "submit",
      variant: "primary",
    });

    return this.registerButton.element;
  }

  createError() {
    this.errorElement = document.createElement("p");

    this.errorElement.classList.add("text-sm", "text-danger", "hidden");

    return this.errorElement;
  }

  createLoginLink() {
    const container = document.createElement("div");

    container.classList.add("text-center");

    const paragraph = document.createElement("p");

    paragraph.classList.add("text-sm", "text-muted");

    paragraph.textContent = "Already have an account? ";

    const link = document.createElement("a");

    link.textContent = "Login";

    link.href = "#/login";

    link.classList.add("font-bold", "text-primary");

    paragraph.append(link);

    container.append(paragraph);

    return container;
  }

  handleRegister() {
    const username = this.usernameInput.value.trim();
    const password = this.passwordInput.value;
    const confirmPassword = this.confirmPasswordInput.value;

    this.clearError();

    if (!username) {
      this.showError("Username is required.");

      this.usernameInput.focus();

      return;
    }

    if (!password) {
      this.showError("Password is required.");

      this.passwordInput.focus();

      return;
    }

    if (password !== confirmPassword) {
      this.showError("Passwords do not match.");

      this.confirmPasswordInput.clear();
      this.confirmPasswordInput.focus();

      return;
    }

    const result = this.authService.register({ username, password });

    if (result.error) {
      this.showError(result.error);

      return;
    }

    window.location.hash = "/login";
  }

  showError(message) {
    this.errorElement.textContent = message;

    this.errorElement.classList.remove("hidden");
  }

  clearError() {
    this.errorElement.textContent = "";

    this.errorElement.classList.add("hidden");
  }
}