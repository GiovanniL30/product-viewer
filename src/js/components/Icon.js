export class Icon {
  constructor({ src, alt = "", width = 20, height = 20, className = "" } = {}) {
    this.element = document.createElement("img");

    this.element.src = src;
    this.element.alt = alt;

    this.element.width = width;
    this.element.height = height;

    if (className) {
      this.element.classList.add(className);
    }
  }
}
