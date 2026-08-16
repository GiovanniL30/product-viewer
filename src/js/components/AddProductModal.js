import { Button } from "./Button.js";
import { Input } from "./Input.js";

export class AddProductModal {
  constructor({ onSave } = {}) {
    this.onSave = onSave;

    this.inputs = {};
    this.error;
    this.title;
    this.saveButton;
    this.editingProduct = null;

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

    this.title = document.createElement("h2");
    this.title.classList.add("modal-title");
    this.title.textContent = "Add Product";

    const close = new Button({ text: "×", type: "button", variant: "icon" });
    close.addClass("modal-close");
    close.onClick(() => this.close());

    header.append(this.title, close.element);

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

    const brand = new Input({
      name: "brand",
      placeholder: "e.g. Apple",
      required: true,
    });

    const price = new Input({
      type: "number",
      name: "price",
      min: "0",
      step: "any",
      placeholder: "0",
      required: true,
    });

    const discountPercentage = new Input({
      type: "number",
      name: "discountPercentage",
      min: "0",
      max: "100",
      step: "any",
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
      brand: brand.element,
      price: price.element,
      discountPercentage: discountPercentage.element,
      stock: stock.element,
    };

    return [
      { label: "Title", element: title.element },
      { label: "Description", element: description },
      { label: "Brand", element: brand.element },
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

  open(product = null) {
    this.editingProduct = product;

    if (product) {
      this.title.textContent = "Edit Product";
      this.saveButton.text = "Save Changes";
      this.fillForm(product);
    } else {
      this.title.textContent = "Add Product";
      this.saveButton.text = "Save";
      this.resetForm();
    }

    this.clearError();
    this.overlay.classList.add("open");
  }

  close() {
    this.overlay.classList.remove("open");
    this.editingProduct = null;
  }

  fillForm(product) {
    this.inputs.title.value = product.title;
    this.inputs.description.value = product.description;
    this.inputs.brand.value = product.brand;
    this.inputs.price.value = Math.round(product.price);
    this.inputs.discountPercentage.value = Math.round(product.discountPercentage);
    this.inputs.stock.value = product.stock;
  }

  async handleCreateProduct() {
    this.clearError();

    const payload = {
      title: this.inputs.title.value.trim(),
      description: this.inputs.description.value.trim(),
      brand: this.inputs.brand.value.trim(),
      price: Math.round(Number(this.inputs.price.value)),
      discountPercentage: Math.round(Number(this.inputs.discountPercentage.value)) || 0,
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
      const success = await this.onSave?.(payload, this.editingProduct);

      if (success) {
        this.close();
        this.resetForm();
      }
    } catch (error) {
      console.error(error);
      this.showError("Failed to save product.");
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