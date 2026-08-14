import { ApiClient } from "./ApiClient.js";

export class DummyJsonApi extends ApiClient {
  constructor() {
    super("https://fakestoreapi.com");
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

  updateProduct(id, product) {
    return this.put(`/products/${id}`, product);
  }

  deleteProduct(id) {
    return this.delete(`/products/${id}`);
  }
}
