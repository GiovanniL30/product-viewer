import { Page } from "./Page.js";
import { Button } from "../components/Button.js";
import { DummyJsonApi } from "../services/DummyJsonApi.js";
import { getDiscountedPrice, hasDiscount } from "../utils/productPrice.js";

export class ProductDetailPage extends Page {
  api = new DummyJsonApi();

  id;
  content;

  render() {
    this.id = this.options.params?.id;

    const container = document.createElement("div");
    container.classList.add("flex", "flex-col", "gap-20");

    container.append(this.createBackButton());

    this.content = document.createElement("div");

    container.append(this.content);

    this.container.append(container);

    this.loadProduct();
  }

  createBackButton() {
    const back = new Button({
      text: "Back to products",
      type: "button",
      variant: "secondary",
    });

    back.onClick(() => {
      window.location.hash = "/products";
    });

    return back.element;
  }

  async loadProduct() {
    this.content.replaceChildren(this.createLoading());

    try {
      const product = await this.api.getProduct(this.id);

      this.content.replaceChildren(this.createDetail(product));
    } catch (error) {
      console.error(error);

      const message = error.status === 404 ? "Product not found." : "Failed to load product.";

      this.content.replaceChildren(this.createError(message));
    }
  }

  createLoading() {
    const message = document.createElement("p");
    message.textContent = "Loading product...";
    message.classList.add("text-muted");

    return message;
  }

  createError(message) {
    const error = document.createElement("p");
    error.textContent = message;
    error.classList.add("text-danger");

    return error;
  }

  createDetail(product) {
    const card = document.createElement("div");
    card.classList.add("product-detail");

    const imageWrap = document.createElement("div");
    imageWrap.classList.add("product-detail-image");

    const image = document.createElement("img");
    image.src = product.thumbnail;
    image.alt = product.title;
    imageWrap.append(image);

    if (hasDiscount(product)) {
      const badge = document.createElement("span");
      badge.classList.add("discount-badge");
      badge.textContent = `-${Math.round(product.discountPercentage)}%`;
      imageWrap.append(badge);
    }

    const info = document.createElement("div");
    info.classList.add("product-detail-info");

    const category = document.createElement("span");
    category.classList.add("product-category");
    category.textContent = product.category;

    const title = document.createElement("h1");
    title.classList.add("product-title");
    title.textContent = product.title;

    const rating = document.createElement("div");
    rating.classList.add("product-rating");

    const star = document.createElement("span");
    star.textContent = "★";

    const ratingValue = document.createElement("span");
    ratingValue.textContent = product.rating;

    rating.append(star, ratingValue);

    const priceRow = document.createElement("div");
    priceRow.classList.add("price-row", "mt-16");

    const current = document.createElement("span");
    current.classList.add("price-discounted");
    current.textContent = `$${getDiscountedPrice(product)}`;
    priceRow.append(current);

    if (hasDiscount(product)) {
      const original = document.createElement("span");
      original.classList.add("price-original");
      original.textContent = `$${product.price}`;
      priceRow.append(original);
    }

    const meta = document.createElement("div");
    meta.classList.add("flex", "flex-col", "my-16");

    meta.append(
      this.createDetailMeta("Brand", product.brand || "Unknown"),
      this.createDetailMeta("Category", product.category),
      this.createDetailMeta("Stock", product.stock),
      this.createDetailMeta("Rating", `${product.rating} / 5`),
    );

    const description = document.createElement("p");
    description.classList.add("product-detail-description");
    description.textContent = product.description;

    info.append(category, title, rating, priceRow, meta, description);
    card.append(imageWrap, info);

    return card;
  }

  createDetailMeta(labelText, value) {
    const row = document.createElement("div");
    row.classList.add("detail-meta");

    const label = document.createElement("span");
    label.classList.add("detail-meta-label");
    label.textContent = labelText;

    const text = document.createElement("span");
    text.textContent = value;

    row.append(label, text);

    return row;
  }
}
