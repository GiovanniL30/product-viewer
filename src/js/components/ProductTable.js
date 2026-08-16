import { Button } from "./Button.js";
import { Icon } from "./Icon.js";
import { getDiscountedPrice, hasDiscount } from "../utils/productPrice.js";

export class ProductTable {
  constructor({ products = [], onView } = {}) {
    this.products = products;
    this.onView = onView;

    this.element = this.createElement();
  }

  createElement() {
    const wrapper = document.createElement("div");
    wrapper.classList.add("table-scroll");

    const table = document.createElement("table");
    table.classList.add("products-table");

    table.append(this.createHeader(), this.createBody());

    wrapper.append(table);

    return wrapper;
  }

  createHeader() {
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

  createBody() {
    const tbody = document.createElement("tbody");

    this.products.forEach((product) => {
      tbody.append(this.createRow(product));
    });

    return tbody;
  }

  createRow(product) {
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

  createPriceCell(product) {
    const td = document.createElement("td");
    td.classList.add("price-cell");

    const container = document.createElement("div");

    const current = document.createElement("span");
    current.classList.add("price-discounted");
    current.textContent = `$${getDiscountedPrice(product)}`;
    container.append(current);

    if (hasDiscount(product)) {
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

    const button = new Button({
      type: "button",
      variant: "icon",
    });

    button.addClass("action-btn", "action-btn-neutral");

    const icon = new Icon({
      src: "src/assets/icons/view.svg",
      alt: "View product",
    });

    button.append(icon);

    button.onClick(() => this.onView?.(product.id));

    td.append(button.element);

    return td;
  }
}