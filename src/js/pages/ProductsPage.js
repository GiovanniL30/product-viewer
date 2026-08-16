import { DummyJsonApi } from "../services/DummyJsonApi.js";
import { Button } from "../components/Button.js";
import { Page } from "./Page.js";
import { Icon } from "../components/Icon.js";
import { AddProductModal } from "../components/AddProductModal.js";
import { ProductTable } from "../components/ProductTable.js";
import { ProductCard } from "../components/ProductCard.js";

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
  addModal;

  render() {
    const container = this.createContainer();

    this.addModal = this.createAddModal();

    container.append(this.createHeader(), this.createContent());

    this.container.append(container, this.addModal.element);

    this.loadProducts();
  }

  createAddModal() {
    return new AddProductModal({
      onSave: async (payload) => {
        this.localProducts.unshift({
          id: `local-${Date.now()}`,
          ...payload,
          thumbnail: "https://demofree.sirv.com/nope-not/here.jpg",
          rating: 0,
        });

        this.currentPage = 1;

        await this.loadProducts();

        return true;
      },
    });
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
        select: "id,title,description,brand,price,discountPercentage,rating,stock,thumbnail",
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
    this.tableContainer.replaceChildren(new ProductTable({ products, onView: (id) => this.viewProduct(id) }).element);
  }

  renderCards(products) {
    const grid = document.createElement("div");

    grid.classList.add("products-grid");

    products.forEach((product) => {
      const card = new ProductCard({ product, onClick: () => this.viewProduct(product.id) });

      grid.append(card.element);
    });

    this.tableContainer.replaceChildren(grid);
  }

  viewProduct(id) {
    window.location.hash = `/product/${id}`;
  }

  openModal() {
    this.addModal?.open();
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
      const card = new ProductCard({ product, onClick: () => this.viewProduct(product.id) });

      grid.append(card.element);
    });

    this.tableContainer.replaceChildren(grid);
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

    button.addClass("w-full");

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
      const card = new ProductCard({ product, onClick: () => this.viewProduct(product.id) });

      grid.append(card.element);
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
