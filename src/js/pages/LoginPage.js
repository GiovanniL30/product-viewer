import { Page } from "./Page.js";

export class LoginPage extends Page {
  render() {
    const container = this.#createContainer();
    const card = this.#createCard();

    card.append(this.#createHeader(), this.#createForm());

    container.append(card);
    this.container.append(container);
  }

  #createContainer() {
    const element = document.createElement("div");
    element.classList.add("container-sm");

    return element;
  }

  #createCard() {
    const element = document.createElement("div");

    element.classList.add("bg-white", "p-24", "rounded-lg");

    return element;
  }

  #createHeader() {
    const container = document.createElement("div");

    container.classList.add("flex", "flex-col", "gap-4", "mb-24");

    const title = document.createElement("h1");

    title.classList.add("text-2xl", "font-bold", "text-primary");

    title.textContent = "Login";

    const description = document.createElement("p");

    description.classList.add("text-sm", "text-muted");

    description.textContent = "Enter your credentials to continue.";

    container.append(title, description);

    return container;
  }

  #createForm() {
    const form = document.createElement("form");

    form.id = "login-form";

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      this.#handleLogin();
    });

    const fields = document.createElement("div");

    fields.classList.add("flex", "flex-col", "gap-20");

    fields.append(
      this.#createUsernameField(),
      this.#createPasswordField(),
      this.#createSubmitButton(),
      this.#createError(),
    );

    form.append(fields);

    return form;
  }

  #createUsernameField() {
    const container = this.#createFieldContainer();

    const label = this.#createLabel("username", "Username");

    const input = document.createElement("input");

    input.id = "username";
    input.name = "username";
    input.type = "text";
    input.classList.add("input");
    input.placeholder = "Enter your username";
    input.autocomplete = "username";
    input.required = true;

    container.append(label, input);

    return container;
  }

  #createPasswordField() {
    const container = this.#createFieldContainer();

    const label = this.#createLabel("password", "Password");

    const input = document.createElement("input");

    input.id = "password";
    input.name = "password";
    input.type = "password";
    input.classList.add("input");
    input.placeholder = "Enter your password";
    input.autocomplete = "current-password";
    input.required = true;

    container.append(label, input);

    return container;
  }

  #createFieldContainer() {
    const element = document.createElement("div");

    element.classList.add("flex", "flex-col", "gap-4");

    return element;
  }

  #createLabel(forId, text) {
    const label = document.createElement("label");

    label.htmlFor = forId;
    label.classList.add("font-bold", "text-sm");

    label.textContent = text;

    return label;
  }

  #createSubmitButton() {
    const button = document.createElement("button");

    button.type = "submit";
    button.classList.add("btn", "btn-primary");

    button.textContent = "Login";

    return button;
  }

  #createError() {
    const element = document.createElement("p");

    element.id = "login-error";

    element.classList.add("text-sm", "text-danger", "hidden");

    return element;
  }

  #handleLogin() {
    const username = this.container.querySelector("#username").value.trim();

    const password = this.container.querySelector("#password").value;

    if (!username || !password) {
      this.#showError("Username and password are required.");

      return;
    }

    this.#clearError();

    console.log({
      username,
      password,
    });
  }

  #showError(message) {
    const error = this.container.querySelector("#login-error");

    error.textContent = message;
    error.classList.remove("hidden");
  }

  #clearError() {
    const error = this.container.querySelector("#login-error");

    error.textContent = "";
    error.classList.add("hidden");
  }
}
