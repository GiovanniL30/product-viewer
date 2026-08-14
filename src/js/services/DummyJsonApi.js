import { ApiClient } from "./ApiClient.js";

export class DummyJsonApi extends ApiClient {
  constructor() {
    super("https://dummyjson.com");
  }

  getProducts() {
    return this.get("/products");
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
