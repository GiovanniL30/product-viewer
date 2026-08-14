import { HomePage } from "./pages/HomePage.js";
import { LoginPage } from "./pages/LoginPage.js";
import { ProductsPage } from "./pages/ProductsPage.js";
import { RegisterPage } from "./pages/RegisterPage.js";
import { Router } from "./pages/Router.js";

const container = document.querySelector("#app");

const routes = {
  "/": HomePage,
  "/login": LoginPage,
  "/register": RegisterPage,
  "/products": ProductsPage,
};

const router = new Router(container, routes);
