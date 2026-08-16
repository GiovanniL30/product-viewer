import { Button } from "./Button.js";

export class ConfirmModal {
  constructor({ title = "Confirm", message = "", confirmText = "Confirm", cancelText = "Cancel", onConfirm } = {}) {
    this.title = title;
    this.message = message;
    this.confirmText = confirmText;
    this.cancelText = cancelText;
    this.onConfirm = onConfirm;

    this.overlay = this.createModal();
  }

  get element() {
    return this.overlay;
  }

  createModal() {
    const overlay = document.createElement("div");
    overlay.classList.add("modal-overlay");

    const modal = document.createElement("div");
    modal.classList.add("modal", "modal-sm");

    const header = document.createElement("div");
    header.classList.add("modal-header");

    const title = document.createElement("h2");
    title.classList.add("modal-title");
    title.textContent = this.title;

    const close = new Button({ text: "×", type: "button", variant: "icon" });
    close.addClass("modal-close");
    close.onClick(() => this.close());

    header.append(title, close.element);

    const body = document.createElement("div");
    body.classList.add("modal-body");

    const message = document.createElement("p");
    message.textContent = this.message;
    message.classList.add("text-sm", "text-muted");

    body.append(message);

    const footer = document.createElement("div");
    footer.classList.add("modal-footer");

    const cancel = new Button({ text: this.cancelText, type: "button", variant: "secondary" });
    cancel.onClick(() => this.close());

    const confirm = new Button({ text: this.confirmText, type: "button", variant: "danger" });
    confirm.onClick(() => {
      this.close();
      this.onConfirm?.();
    });

    footer.append(cancel.element, confirm.element);

    modal.append(header, body, footer);
    overlay.append(modal);

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        this.close();
      }
    });

    return overlay;
  }

  open() {
    this.overlay.classList.add("open");
  }

  close() {
    this.overlay.classList.remove("open");
  }
}
