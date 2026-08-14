export class Router {
  constructor(container, routes = {}) {
    this.container = container;
    this.routes = routes;

    this.load();

    window.addEventListener("hashchange", () => {
      this.load();
    });
  }

  navigate(path) {
    window.location.hash = path;
  }

  load() {
    const path = window.location.hash.slice(1) || "/";

    const PageClass = this.routes[path];

    if (!PageClass) {
      this.render404();
      return;
    }

    const page = new PageClass(this.container);

    page.render();
  }

  render404() {
    this.container.innerHTML = `
            <h1>404</h1>
            <p>Page not found.</p>
        `;
  }
}
