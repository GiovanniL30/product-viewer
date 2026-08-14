import { Page } from "./Page.js";

export class HomePage extends Page {
  render() {
    this.container.innerHTML = `
            <h1>Home</h1>
            <p>Welcome to the application.</p>
        `;
  }
}
