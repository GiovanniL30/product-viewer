import { DummyJsonApi } from "../services/DummyJsonApi.js";
import { Button } from "../components/Button.js";
import { Page } from "./Page.js";
import { Icon } from "../components/Icon.js";
import { AddProductModal } from "../components/AddProductModal.js";
import { ConfirmModal } from "../components/ConfirmModal.js";
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
  confirmModal;

  render() {
    const container = this.createContainer();

    this.addModal = this.createAddModal();
    this.confirmModal = this.createConfirmModal();

    container.append(this.createHeader(), this.createContent());

    this.container.append(container, this.addModal.element, this.confirmModal.element);

    this.loadProducts();
  }

  createAddModal() {
    return new AddProductModal({
      onSave: async (payload, editingProduct) => {
        if (editingProduct) {
          const index = this.localProducts.findIndex((product) => product.id === editingProduct.id);

          if (index !== -1) {
            this.localProducts[index] = { ...this.localProducts[index], ...payload };
          }
        } else {
          this.localProducts.unshift({
            id: `local-${Date.now()}`,
            ...payload,
            thumbnail: "https://demofree.sirv.com/nope-not/here.jpg",
            rating: 0,
          });
        }

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
    this.setLoading(true);

    try {
      if (this.localProducts.length === 0) {
        const response = await this.api.getProducts({
          limit: 0,
          select: "id,title,description,brand,price,discountPercentage,rating,stock,thumbnail",
        });

        this.localProducts = response.products;
      }

      this.total = this.localProducts.length;

      this.renderCurrentPage();
    } catch (error) {
      console.error(error);
      this.renderError("Failed to load products.");
    } finally {
      this.setLoading(false);
    }
  }

  getPageProducts() {
    const start = (this.currentPage - 1) * this.pageSize;

    return this.localProducts.slice(start, start + this.pageSize);
  }

  renderCurrentPage() {
    const products = this.getPageProducts();

    if (this.viewMode === "table") {
      this.renderTable(products);
      this.renderTablePagination();
    } else {
      this.renderCards(products);
      this.renderLoadMore();
    }
  }

  renderTable(products) {
    this.tableContainer.replaceChildren(
      new ProductTable({
        products,
        onView: (id) => this.viewProduct(id),
        onEdit: (product) => this.editProduct(product),
        onDelete: (product) => this.deleteProduct(product),
      }).element,
    );
  }

  renderCards(products) {
    const grid = document.createElement("div");

    grid.classList.add("products-grid");

    products.forEach((product) => {
      grid.append(this.createCard(product).element);
    });

    this.tableContainer.replaceChildren(grid);
  }

  createCard(product) {
    return new ProductCard({
      product,
      onClick: () => this.viewProduct(product.id),
      onEdit: () => this.editProduct(product),
      onDelete: () => this.deleteProduct(product),
    });
  }

  editProduct(product) {
    this.addModal?.open(product);
  }

  deleteProduct(product) {
    this.pendingDeleteProduct = product;
    this.confirmModal?.open();
  }

  createConfirmModal() {
    return new ConfirmModal({
      title: "Delete Product",
      message: "Are you sure you want to delete this product? This action cannot be undone.",
      confirmText: "Delete",
      onConfirm: () => {
        const product = this.pendingDeleteProduct;

        if (!product) {
          return;
        }

        this.pendingDeleteProduct = null;

        this.localProducts = this.localProducts.filter((localProduct) => localProduct.id !== product.id);

        if (this.getPageProducts().length === 0 && this.currentPage > 1) {
          this.currentPage--;
        }

        this.loadProducts();
      },
    });
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

      this.appendCards();
    });

    this.paginationContainer.append(button.element);
  }

  appendCards() {
    const grid = this.tableContainer.firstChild;

    this.getPageProducts().forEach((product) => {
      grid.append(this.createCard(product).element);
    });

    this.renderLoadMore();
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