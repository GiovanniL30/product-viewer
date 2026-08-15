import { DummyJsonApi } from "../services/DummyJsonApi.js";
import { Button } from "../components/Button.js";
import { Page } from "./Page.js";
import { Icon } from "../components/Icon.js";

export class ProductsPage extends Page {
  api = new DummyJsonApi();

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

    this.container.append(container);

    this.loadProducts();
  }

  createContainer() {
    const container = document.createElement("div");
    container.classList.add("flex", "flex-col", "gap-20");

    return container;
  }

  createHeader() {
    const container = document.createElement("div");
    container.classList.add("flex", "items-center", "justify-between");
    const title = this.createTitle();

    this.viewToggleContainer = this.createViewToggle();

    container.append(title, this.viewToggleContainer);

    return container;
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
      });

      this.total = response.total;

      if (this.viewMode === "table") {
        this.renderTable(response.products);
        this.renderTablePagination();
      } else {
        this.renderCards(response.products);
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
    const table = document.createElement("table");

    table.classList.add("table");

    const thead = this.createTableHeader();

    const tbody = this.createTableBody(products);

    table.append(thead, tbody);

    this.tableContainer.replaceChildren(table);
  }

  createTableHeader() {
    const thead = document.createElement("thead");

    const row = document.createElement("tr");

    const headers = ["ID", "Product", "Price"];

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

    const id = document.createElement("td");

    id.textContent = product.id;

    const title = document.createElement("td");

    title.textContent = product.title;

    const price = document.createElement("td");

    price.textContent = `$${product.price}`;

    row.append(id, title, price);

    return row;
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

    grid.classList.add("grid", "grid-cols-3", "gap-20");

    products.forEach((product) => {
      const card = this.createProductCard(product);

      grid.append(card);
    });

    this.tableContainer.replaceChildren(grid);
  }

  createProductCard(product) {
    const card = document.createElement("div");

    card.classList.add("bg-white", "p-20", "rounded-lg");

    const title = document.createElement("h3");

    title.textContent = product.title;

    title.classList.add("font-bold", "text-lg");

    const id = document.createElement("p");

    id.textContent = `ID: ${product.id}`;

    id.classList.add("text-muted", "text-sm");

    const price = document.createElement("p");

    price.textContent = `$${product.price}`;

    price.classList.add("font-bold", "text-primary");

    card.append(title, id, price);

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
