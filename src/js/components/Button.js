export class Button {
  constructor({ text = "", type = "button", variant = "primary", disabled = false } = {}) {
    this.element = document.createElement("button");

    this.element.type = type;
    this.element.textContent = text;
    this.element.disabled = disabled;

    this.element.classList.add("btn", `btn-${variant}`);
  }

  get disabled() {
    return this.element.disabled;
  }

  set disabled(value) {
    this.element.disabled = value;
  }

  get text() {
    return this.element.textContent;
  }

  set text(value) {
    this.element.textContent = value;
  }

  setVariant(variant) {
    this.element.classList.remove("btn-primary", "btn-secondary", "btn-icon");

    this.element.classList.add(`btn-${variant}`);
  }

  addClass(...classes) {
    this.element.classList.add(...classes);
  }

  append(component) {
    this.element.append(component.element);
  }

  clear() {
    this.element.replaceChildren();
  }

  onClick(callback) {
    this.element.addEventListener("click", callback);
  }
}
