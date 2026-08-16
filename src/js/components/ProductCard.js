import { getDiscountedPrice, hasDiscount } from "../utils/productPrice.js";

export class ProductCard {
  constructor({ product, onClick } = {}) {
    this.product = product;
    this.onClick = onClick;

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
    card.append(imageWrap, body);

    card.addEventListener("click", () => this.onClick?.());

    return card;
  }
}
