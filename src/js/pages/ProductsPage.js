import { DummyJsonApi } from "../services/DummyJsonApi.js";
import { Page } from "./Page.js";

export class ProductsPage extends Page {
  #api = new DummyJsonApi();
  #currentPage = 1;
  #pageSize = 10;
  #total = 0;

  async render() {
    this.container.innerHTML = `
      <div>
        <h1>Products</h1>

        <div id="products-table"></div>
        <div id="pagination"></div>
      </div>
    `;

    await this.#loadProducts();
  }

  async #loadProducts() {
    const skip = (this.#currentPage - 1) * this.#pageSize;

    try {
      const response = await this.#api.getProducts({
        limit: this.#pageSize,
        skip: skip,
      });

      this.#total = response.total;

      this.#renderProductsTable(response.products);
      this.#renderPagination();
    } catch (error) {
      console.error(error);

      this.container.querySelector("#products-table").innerHTML = `
        <p>Failed to load products.</p>
      `;
    }
  }

  #renderProductsTable(products) {
    const table = this.container.querySelector("#products-table");

    table.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Price</th>
          </tr>
        </thead>

        <tbody>
          ${products
            .map(
              (product) => `
                <tr>
                  <td>${product.id}</td>
                  <td>${product.title}</td>
                  <td>$${product.price}</td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    `;
  }

  #renderPagination() {
    const pagination = this.container.querySelector("#pagination");

    const totalPages = Math.ceil(this.#total / this.#pageSize);

    pagination.innerHTML = `
      <button
        data-page="${this.#currentPage - 1}"
        ${this.#currentPage === 1 ? "disabled" : ""}
      >
        Previous
      </button>

      <span>
        Page ${this.#currentPage} of ${totalPages}
      </span>

      <button
        data-page="${this.#currentPage + 1}"
        ${this.#currentPage === totalPages ? "disabled" : ""}
      >
        Next
      </button>
    `;

    pagination.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        this.#currentPage = Number(button.dataset.page);

        this.#loadProducts();
      });
    });
  }
}
