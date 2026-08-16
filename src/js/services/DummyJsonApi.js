import { ApiClient } from "./ApiClient.js";

export class DummyJsonApi extends ApiClient {
  constructor() {
    super("https://dummyjson.com");
  }

  getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();

    return this.get(`/products?${query}`);
  }

  getProduct(id) {
    return this.get(`/products/${id}`);
  }

  createProduct(product) {
    return this.post("/products/add", product);
  }

  createImageUrl(text, { width = 300, height = 300 } = {}) {
    const size = width === height ? width : `${width}x${height}`;

    const params = new URLSearchParams({
      text,
      fontFamily: "poppins",
      fontSize: 24,
    });

    return `https://dummyjson.com/image/${size}/da5047/ffffff?${params}`;
  }

  updateProduct(id, product) {
    return this.put(`/products/${id}`, product);
  }

  deleteProduct(id) {
    return this.delete(`/products/${id}`);
  }
}
