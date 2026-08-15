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
    this.container.replaceChildren();

    const path = window.location.hash.slice(1) || "/";

    const { PageClass, params } = this.matchRoute(path);

    if (!PageClass) {
      this.render404();
      return;
    }

    const page = new PageClass(this.container, { params });

    page.render();
  }

  matchRoute(path) {
    const segments = path.split("/").filter(Boolean);

    for (const [pattern, PageClass] of Object.entries(this.routes)) {
      const keys = pattern.split("/").filter(Boolean);

      if (keys.length !== segments.length) {
        continue;
      }

      const params = {};
      let matched = true;

      keys.forEach((key, index) => {
        if (key.startsWith(":")) {
          params[key.slice(1)] = decodeURIComponent(segments[index]);
        } else if (key !== segments[index]) {
          matched = false;
        }
      });

      if (matched) {
        return { PageClass, params };
      }
    }

    return { PageClass: null, params: {} };
  }

  render404() {
    this.container.innerHTML = `
            <h1>404</h1>
            <p>Page not found.</p>
        `;
  }
}