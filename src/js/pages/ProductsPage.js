import { Page } from "./Page.js";

export class ProductsPage extends Page {
  render() {
    this.container.innerHTML = `
            <h1>Products</h1>
            <p>Here are our products.</p>
        `;
  }
}
