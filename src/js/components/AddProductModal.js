import { Button } from "./Button.js";
import { Input } from "./Input.js";

export class AddProductModal {
  constructor({ onSave } = {}) {
    this.onSave = onSave;

    this.inputs = {};
    this.error;
    this.saveButton;

    this.overlay = this.createModal();
  }

  get element() {
    return this.overlay;
  }

  createModal() {
    const overlay = document.createElement("div");
    overlay.classList.add("modal-overlay");

    const modal = document.createElement("div");
    modal.classList.add("modal");

    const header = document.createElement("div");
    header.classList.add("modal-header");

    const title = document.createElement("h2");
    title.classList.add("modal-title");
    title.textContent = "Add Product";

    const close = new Button({ text: "×", type: "button", variant: "icon" });
    close.addClass("modal-close");
    close.onClick(() => this.close());

    header.append(title, close.element);

    const form = document.createElement("form");
    form.classList.add("modal-body");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.handleCreateProduct();
    });

    this.error = document.createElement("p");
    this.error.classList.add("text-sm", "text-danger", "hidden");

    const fieldsContainer = document.createElement("div");
    fieldsContainer.classList.add("flex", "flex-col", "gap-16");

    this.createFields().forEach((field) => {
      fieldsContainer.append(this.createField(field));
    });

    const footer = document.createElement("div");
    footer.classList.add("modal-footer");

    const cancel = new Button({ text: "Cancel", type: "button", variant: "secondary" });
    cancel.onClick(() => this.close());

    this.saveButton = new Button({ text: "Save", type: "submit", variant: "primary" });

    footer.append(cancel.element, this.saveButton.element);

    form.append(fieldsContainer, this.error, footer);
    modal.append(header, form);
    overlay.append(modal);

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        this.close();
      }
    });

    return overlay;
  }

  createFields() {
    const title = new Input({
      name: "title",
      placeholder: "Enter product title",
      required: true,
    });

    const description = this.createTextArea("Enter a short product description");

    const category = new Input({
      name: "category",
      placeholder: "e.g. beauty",
      required: true,
    });

    const price = new Input({
      type: "number",
      name: "price",
      min: "0",
      step: "0.01",
      placeholder: "0.00",
      required: true,
    });

    const discountPercentage = new Input({
      type: "number",
      name: "discountPercentage",
      min: "0",
      max: "100",
      step: "0.01",
      placeholder: "0",
    });

    const stock = new Input({
      type: "number",
      name: "stock",
      min: "0",
      step: "1",
      placeholder: "0",
    });

    this.inputs = {
      title: title.element,
      description,
      category: category.element,
      price: price.element,
      discountPercentage: discountPercentage.element,
      stock: stock.element,
    };

    return [
      { label: "Title", element: title.element },
      { label: "Description", element: description },
      { label: "Category", element: category.element },
      { label: "Price", element: price.element },
      { label: "Discount %", element: discountPercentage.element },
      { label: "Stock", element: stock.element },
    ];
  }

  createTextArea(placeholder) {
    const textarea = document.createElement("textarea");

    textarea.classList.add("input");
    textarea.name = "description";
    textarea.rows = 3;
    textarea.placeholder = placeholder;

    return textarea;
  }

  createField({ label: labelText, element }) {
    const container = document.createElement("div");

    container.classList.add("flex", "flex-col", "gap-4");

    const label = document.createElement("label");

    label.classList.add("font-bold", "text-sm");
    label.textContent = labelText;

    container.append(label, element);

    return container;
  }

  open() {
    this.clearError();
    this.overlay.classList.add("open");
  }

  close() {
    this.overlay.classList.remove("open");
  }

  async handleCreateProduct() {
    this.clearError();

    const payload = {
      title: this.inputs.title.value.trim(),
      description: this.inputs.description.value.trim(),
      category: this.inputs.category.value.trim().toLowerCase(),
      price: Number(this.inputs.price.value),
      discountPercentage: Number(this.inputs.discountPercentage.value) || 0,
      stock: Number(this.inputs.stock.value) || 0,
    };

    if (!payload.title) {
      this.showError("Title is required.");
      return;
    }

    if (!Number.isFinite(payload.price) || payload.price <= 0) {
      this.showError("Price must be greater than 0.");
      return;
    }

    this.saveButton.disabled = true;

    try {
      const success = await this.onSave?.(payload);

      if (success) {
        this.close();
        this.resetForm();
      }
    } catch (error) {
      console.error(error);
      this.showError("Failed to create product.");
    } finally {
      this.saveButton.disabled = false;
    }
  }

  resetForm() {
    Object.values(this.inputs).forEach((input) => {
      input.value = "";
    });
  }

  showError(message) {
    this.error.textContent = message;
    this.error.classList.remove("hidden");
  }

  clearError() {
    this.error.textContent = "";
    this.error.classList.add("hidden");
  }
}