import { DummyJsonApi } from "../services/DummyJsonApi.js";
import { Button } from "../components/Button.js";
import { Page } from "./Page.js";
import { Icon } from "../components/Icon.js";
import { Input } from "../components/Input.js";

export class ProductsPage extends Page {
  api = new DummyJsonApi();

  localProducts = [];

  currentPage = 1;
  pageSize = 10;
  total = 0;

  viewMode = "table";

  tableContainer;
  paginationContainer;
  viewToggleContainer;

  render() {
    const container = this.createContainer();

    container.append(this.createHeader(), this.createContent());

    this.container.append(container, this.createModal());

    this.loadProducts();
  }

  createContainer() {
    const container = document.createElement("div");
    container.classList.add("flex", "flex-col", "gap-20");

    return container;
  }

  createHeader() {
    const container = document.createElement("div");
    container.classList.add("flex", "items-center", "justify-between", "products-header");

    const title = this.createTitle();

    const actions = document.createElement("div");
    actions.classList.add("flex", "items-center", "gap-12");

    actions.append(this.createAddButton(), this.createViewToggle());

    container.append(title, actions);

    return container;
  }

  createAddButton() {
    this.addButton = new Button({
      text: "Add Product",
      type: "button",
      variant: "primary",
    });

    const icon = new Icon({
      src: "src/assets/icons/add.svg",
      alt: "Add product",
      width: 16,
      height: 16,
    });

    this.addButton.element.prepend(icon.element);

    this.addButton.onClick(() => this.openModal());

    return this.addButton.element;
  }

  createTitle() {
    const title = document.createElement("h1");
    title.textContent = "Products";
    title.classList.add("text-2xl", "font-bold", "text-primary");

    return title;
  }

  createViewToggle() {
    const button = new Button({
      type: "button",
      variant: "icon",
    });

    this.viewToggleButton = button;

    button.onClick(() => {
      const nextView = this.viewMode === "table" ? "card" : "table";

      this.changeView(nextView);
    });

    this.updateViewToggle();

    return button.element;
  }

  createContent() {
    const container = document.createElement("div");

    container.classList.add("flex", "flex-col", "gap-20");

    this.tableContainer = document.createElement("div");

    this.paginationContainer = document.createElement("div");

    this.paginationContainer.classList.add("flex", "items-center", "justify-end", "gap-12", "pagination-container");

    container.append(this.tableContainer, this.paginationContainer);

    return container;
  }

  changeView(mode) {
    if (this.viewMode === mode) {
      return;
    }

    this.viewMode = mode;
    this.currentPage = 1;

    this.tableContainer.replaceChildren();
    this.paginationContainer.replaceChildren();

    this.updateViewToggle();

    this.loadProducts();
  }

  updateViewToggle() {
    if (!this.viewToggleButton) {
      return;
    }

    this.viewToggleButton.clear();

    const iconSrc = this.viewMode === "table" ? "src/assets/icons/list.svg" : "src/assets/icons/table.svg";

    const icon = new Icon({
      src: iconSrc,
      alt: this.viewMode === "table" ? "Switch to card view" : "Switch to table view",
    });

    this.viewToggleButton.append(icon);
  }

  async loadProducts() {
    const skip = (this.currentPage - 1) * this.pageSize;

    this.setLoading(true);

    try {
      const response = await this.api.getProducts({
        limit: this.pageSize,
        skip,
        select: "id,title,description,category,price,discountPercentage,rating,stock,thumbnail",
      });

      const localProducts = this.currentPage === 1 ? this.localProducts : [];

      this.total = response.total + localProducts.length;

      const products = [...localProducts, ...response.products];

      if (this.viewMode === "table") {
        this.renderTable(products);
        this.renderTablePagination();
      } else {
        this.renderCards(products);
        this.renderLoadMore();
      }
    } catch (error) {
      console.error(error);
      this.renderError("Failed to load products.");
    } finally {
      this.setLoading(false);
    }
  }

  renderTable(products) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("table-scroll");

    const table = document.createElement("table");

    table.classList.add("products-table");

    const thead = this.createTableHeader();

    const tbody = this.createTableBody(products);

    table.append(thead, tbody);

    wrapper.append(table);

    this.tableContainer.replaceChildren(wrapper);
  }

  createTableHeader() {
    const thead = document.createElement("thead");

    const row = document.createElement("tr");

    const headers = ["Product", "Price", "Stock", "Actions"];

    headers.forEach((text) => {
      const th = document.createElement("th");
      th.textContent = text;
      row.append(th);
    });

    thead.append(row);

    return thead;
  }

  createTableBody(products) {
    const tbody = document.createElement("tbody");

    products.forEach((product) => {
      const row = this.createProductRow(product);
      tbody.append(row);
    });

    return tbody;
  }

  createProductRow(product) {
    const row = document.createElement("tr");

    row.append(this.createProductCell(product), this.createPriceCell(product), this.createStockCell(product), this.createActionsCell(product));

    return row;
  }

  createProductCell(product) {
    const td = document.createElement("td");

    const container = document.createElement("div");
    container.classList.add("product-col");

    const image = document.createElement("img");
    image.classList.add("product-image");
    image.src = product.thumbnail;
    image.alt = product.title;

    const text = document.createElement("div");
    text.classList.add("product-col-text");

    const name = document.createElement("p");
    name.classList.add("product-name");
    name.textContent = product.title;

    const category = document.createElement("span");
    category.classList.add("product-category");
    category.textContent = product.category;

    text.append(name, category);
    container.append(image, text);
    td.append(container);

    return td;
  }

  getDiscountedPrice(product) {
    const discount = product.discountPercentage || 0;
    return (product.price * (1 - discount / 100)).toFixed(2);
  }

  hasDiscount(product) {
    return (product.discountPercentage || 0) > 0;
  }

  createPriceCell(product) {
    const td = document.createElement("td");
    td.classList.add("price-cell");

    const container = document.createElement("div");

    const current = document.createElement("span");
    current.classList.add("price-discounted");
    current.textContent = `$${this.getDiscountedPrice(product)}`;
    container.append(current);

    if (this.hasDiscount(product)) {
      const original = document.createElement("span");
      original.classList.add("price-original");
      original.textContent = `$${product.price}`;
      container.append(original);

      const badge = document.createElement("span");
      badge.classList.add("discount-badge");
      badge.textContent = `-${Math.round(product.discountPercentage)}%`;
      container.append(badge);
    }

    td.append(container);
    return td;
  }

  createStockCell(product) {
    const td = document.createElement("td");

    const stock = document.createElement("span");
    stock.classList.add("stock-badge");
    stock.textContent = product.stock;
    if (product.stock <= 5) {
      stock.classList.add("stock-low");
    }

    td.append(stock);

    return td;
  }

  createActionsCell(product) {
    const td = document.createElement("td");
    td.classList.add("actions-cell");

    td.append(
      this.createActionButton("src/assets/icons/view.svg", `View ${product.id}`, "View product", {
        onClick: () => this.viewProduct(product.id),
      }),
    );

    return td;
  }

  createActionButton(iconSrc, label, alt, { destructive = false, onClick } = {}) {
    const button = new Button({
      type: "button",
      variant: "icon",
    });

    button.addClass("action-btn");

    if (destructive) {
      button.addClass("action-btn-danger");
    } else {
      button.addClass("action-btn-neutral");
    }

    const icon = new Icon({
      src: iconSrc,
      alt,
    });

    button.append(icon);

    button.onClick(() => {
      if (onClick) {
        onClick();
      } else {
        console.log(label);
      }
    });

    return button.element;
  }

  viewProduct(id) {
    window.location.hash = `/product/${id}`;
  }

  createModal() {
    const overlay = document.createElement("div");
    overlay.classList.add("modal-overlay");
    this.modalOverlay = overlay;

    const modal = document.createElement("div");
    modal.classList.add("modal");

    const header = document.createElement("div");
    header.classList.add("modal-header");

    const title = document.createElement("h2");
    title.classList.add("modal-title");
    title.textContent = "Add Product";

    const close = new Button({ text: "×", type: "button", variant: "icon" });
    close.addClass("modal-close");
    close.onClick(() => this.closeModal());

    header.append(title, close.element);

    const form = document.createElement("form");
    form.classList.add("modal-body");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.handleCreateProduct();
    });

    this.modalError = document.createElement("p");
    this.modalError.classList.add("text-sm", "text-danger", "hidden");

    const fieldsContainer = document.createElement("div");
    fieldsContainer.classList.add("flex", "flex-col", "gap-16");

    this.createModalFields().forEach((field) => {
      fieldsContainer.append(this.createModalField(field));
    });

    const footer = document.createElement("div");
    footer.classList.add("modal-footer");

    const cancel = new Button({ text: "Cancel", type: "button", variant: "secondary" });
    cancel.onClick(() => this.closeModal());

    this.modalSaveButton = new Button({ text: "Save", type: "submit", variant: "primary" });

    footer.append(cancel.element, this.modalSaveButton.element);

    form.append(fieldsContainer, this.modalError, footer);
    modal.append(header, form);
    overlay.append(modal);

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        this.closeModal();
      }
    });

    return overlay;
  }

  createModalFields() {
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

    this.modalInputs = {
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

  createModalField({ label: labelText, element }) {
    const container = document.createElement("div");

    container.classList.add("flex", "flex-col", "gap-4");

    const label = document.createElement("label");

    label.classList.add("font-bold", "text-sm");
    label.textContent = labelText;

    container.append(label, element);

    return container;
  }

  openModal() {
    this.clearModalError();
    this.modalOverlay?.classList.add("open");
  }

  closeModal() {
    this.modalOverlay?.classList.remove("open");
  }

  async handleCreateProduct() {
    this.clearModalError();

    const payload = {
      title: this.modalInputs.title.value.trim(),
      description: this.modalInputs.description.value.trim(),
      category: this.modalInputs.category.value.trim().toLowerCase(),
      price: Number(this.modalInputs.price.value),
      discountPercentage: Number(this.modalInputs.discountPercentage.value) || 0,
      stock: Number(this.modalInputs.stock.value) || 0,
    };

    if (!payload.title) {
      this.showModalError("Title is required.");
      return;
    }

    if (!Number.isFinite(payload.price) || payload.price <= 0) {
      this.showModalError("Price must be greater than 0.");
      return;
    }

    this.modalSaveButton.disabled = true;

    try {
      this.localProducts.unshift({
        id: `local-${Date.now()}`,
        ...payload,
        thumbnail: this.api.createImageUrl(payload.title),
        rating: 0,
      });

      this.closeModal();
      this.resetModalForm();

      this.currentPage = 1;

      this.loadProducts();

      this.modalSaveButton.disabled = false;
    } catch (error) {
      console.error(error);
      this.showModalError("Failed to create product.");
      this.modalSaveButton.disabled = false;
    }
  }

  resetModalForm() {
    Object.values(this.modalInputs).forEach((input) => {
      input.value = "";
    });
  }

  showModalError(message) {
    this.modalError.textContent = message;
    this.modalError.classList.remove("hidden");
  }

  clearModalError() {
    this.modalError.textContent = "";
    this.modalError.classList.add("hidden");
  }

  renderTablePagination() {
    this.paginationContainer.replaceChildren();

    const totalPages = Math.ceil(this.total / this.pageSize);

    const previousButton = this.createPaginationButton("Previous", this.currentPage - 1, "secondary");

    const pageInfo = this.createPageInfo(totalPages);

    const nextButton = this.createPaginationButton("Next", this.currentPage + 1, "primary");

    this.paginationContainer.append(previousButton, pageInfo, nextButton);
  }

  createPaginationButton(text, page, variant = "secondary") {
    const totalPages = Math.ceil(this.total / this.pageSize);

    const isDisabled = page < 1 || page > totalPages;

    const button = new Button({
      text,
      type: "button",
      variant,
    });

    button.addClass("text-xs");

    button.disabled = isDisabled;

    if (!isDisabled) {
      button.onClick(() => {
        this.currentPage = page;

        this.loadProducts();
      });
    }

    return button.element;
  }

  createPageInfo(totalPages) {
    const element = document.createElement("span");

    element.textContent = `Page ${this.currentPage} of ${totalPages}`;

    element.classList.add("text-muted", "text-xs");

    return element;
  }

  renderCards(products) {
    const grid = document.createElement("div");

    grid.classList.add("products-grid");

    products.forEach((product) => {
      const card = this.createProductCard(product);

      grid.append(card);
    });

    this.tableContainer.replaceChildren(grid);
  }

  createProductCard(product) {
    const card = document.createElement("div");
    card.classList.add("product-card");

    const imageWrap = document.createElement("div");
    imageWrap.classList.add("product-card-image");

    const image = document.createElement("img");
    image.src = product.thumbnail;
    image.alt = product.title;
    imageWrap.append(image);

    if (this.hasDiscount(product)) {
      const badge = document.createElement("span");
      badge.classList.add("discount-badge");
      badge.textContent = `-${Math.round(product.discountPercentage)}%`;
      imageWrap.append(badge);
    }

    const body = document.createElement("div");
    body.classList.add("product-card-body");

    const category = document.createElement("span");
    category.classList.add("product-category");
    category.textContent = product.category;

    const title = document.createElement("h3");
    title.textContent = product.title;

    const rating = document.createElement("div");
    rating.classList.add("product-rating");
    const star = document.createElement("span");
    star.textContent = "★";
    const ratingValue = document.createElement("span");
    ratingValue.textContent = product.rating;
    rating.append(star, ratingValue);

    const description = document.createElement("p");
    description.classList.add("product-description");
    description.textContent = product.description;

    const priceRow = document.createElement("div");
    priceRow.classList.add("price-row");

    const current = document.createElement("span");
    current.classList.add("price-discounted");
    current.textContent = `$${this.getDiscountedPrice(product)}`;
    priceRow.append(current);

    if (this.hasDiscount(product)) {
      const original = document.createElement("span");
      original.classList.add("price-original");
      original.textContent = `$${product.price}`;
      priceRow.append(original);
    }

    body.append(category, title, rating, description, priceRow);
    card.append(imageWrap, body);

    card.addEventListener("click", () => this.viewProduct(product.id));

    return card;
  }

  renderLoadMore() {
    this.paginationContainer.replaceChildren();

    const loaded = this.currentPage * this.pageSize;

    const hasMore = loaded < this.total;

    if (!hasMore) {
      const message = document.createElement("p");

      message.textContent = "All products loaded.";

      message.classList.add("text-muted");

      this.paginationContainer.append(message);

      return;
    }

    const button = new Button({
      text: "Load More",
      type: "button",
      variant: "primary",
    });

    button.onClick(() => {
      this.currentPage++;

      this.loadMoreProducts();
    });

    this.paginationContainer.append(button.element);
  }

  async loadMoreProducts() {
    const skip = (this.currentPage - 1) * this.pageSize;

    try {
      const response = await this.api.getProducts({
        limit: this.pageSize,
        skip,
      });

      this.total = response.total;

      this.appendCards(response.products);

      this.renderLoadMore();
    } catch (error) {
      console.error(error);

      this.renderError("Failed to load more products.");
    }
  }

  appendCards(products) {
    const grid = this.tableContainer.firstChild;

    products.forEach((product) => {
      const card = this.createProductCard(product);

      grid.append(card);
    });
  }

  renderError(message) {
    const error = document.createElement("p");

    error.textContent = message;

    error.classList.add("text-danger");

    this.tableContainer.replaceChildren(error);
  }

  setLoading(loading) {
    if (!loading) {
      return;
    }

    const message = document.createElement("p");

    message.textContent = "Loading products...";

    message.classList.add("text-muted");

    this.tableContainer.replaceChildren(message);
  }
}
