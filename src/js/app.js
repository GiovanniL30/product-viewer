import { HomePage } from "./pages/HomePage.js";
import { LoginPage } from "./pages/LoginPage.js";
import { ProductDetailPage } from "./pages/ProductDetailPage.js";
import { ProductsPage } from "./pages/ProductsPage.js";
import { RegisterPage } from "./pages/RegisterPage.js";
import { Router } from "./pages/Router.js";
import { Header } from "./components/Header.js";

const container = document.querySelector("#app");

const routes = {
  "/": HomePage,
  "/login": LoginPage,
  "/register": RegisterPage,
  "/products": ProductsPage,
  "/product/:id": ProductDetailPage,
};

const router = new Router(container, routes);

new Header(document.querySelector("#app-header"));
