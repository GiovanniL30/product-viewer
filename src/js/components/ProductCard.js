import { getDiscountedPrice, hasDiscount } from "../utils/productPrice.js";
import { Button } from "./Button.js";
import { Icon } from "./Icon.js";

export class ProductCard {
  constructor({ product, onClick, onEdit, onDelete } = {}) {
    this.product = product;
    this.onClick = onClick;
    this.onEdit = onEdit;
    this.onDelete = onDelete;

    this.element = this.createElement();
  }

  createElement() {
    const card = document.createElement("div");
    card.classList.add("product-card");

    const imageWrap = document.createElement("div");
    imageWrap.classList.add("product-card-image");

    const image = document.createElement("img");
    image.src = this.product.thumbnail;
    image.alt = this.product.title;
    imageWrap.append(image);

    if (hasDiscount(this.product)) {
      const badge = document.createElement("span");
      badge.classList.add("discount-badge");
      badge.textContent = `-${Math.round(this.product.discountPercentage)}%`;
      imageWrap.append(badge);
    }

    const body = document.createElement("div");
    body.classList.add("product-card-body");

    const title = document.createElement("h3");
    title.textContent = this.product.title;

    let brand = null;

    if (this.product.brand) {
      brand = document.createElement("span");
      brand.classList.add("product-brand");
      brand.textContent = this.product.brand;
    }

    const rating = document.createElement("div");
    rating.classList.add("product-rating");
    const star = document.createElement("span");
    star.textContent = "★";
    const ratingValue = document.createElement("span");
    ratingValue.textContent = this.product.rating;
    rating.append(star, ratingValue);

    const description = document.createElement("p");
    description.classList.add("product-description");
    description.textContent = this.product.description;

    const priceRow = document.createElement("div");
    priceRow.classList.add("price-row");

    const current = document.createElement("span");
    current.classList.add("price-discounted");
    current.textContent = `$${getDiscountedPrice(this.product)}`;
    priceRow.append(current);

    if (hasDiscount(this.product)) {
      const original = document.createElement("span");
      original.classList.add("price-original");
      original.textContent = `$${this.product.price}`;
      priceRow.append(original);
    }

    const bodyElements = [];

    if (brand) {
      bodyElements.push(brand);
    }

    bodyElements.push(title, rating, description, priceRow);

    body.append(...bodyElements);

    const actions = this.createActions();

    card.append(imageWrap, body, actions);

    card.addEventListener("click", () => this.onClick?.());

    return card;
  }

  createActions() {
    const actions = document.createElement("div");
    actions.classList.add("product-card-actions");

    const edit = new Button({ type: "button", variant: "icon" });
    edit.addClass("action-btn", "action-btn-neutral");
    edit.append(new Icon({ src: "src/assets/icons/edit.svg", alt: "Edit product" }));
    edit.onClick((event) => {
      event.stopPropagation();
      this.onEdit?.(this.product);
    });

    const del = new Button({ type: "button", variant: "icon" });
    del.addClass("action-btn", "action-btn-danger");
    del.append(new Icon({ src: "src/assets/icons/delete.svg", alt: "Delete product" }));
    del.onClick((event) => {
      event.stopPropagation();
      this.onDelete?.(this.product);
    });

    actions.append(edit.element, del.element);

    return actions;
  }
}
