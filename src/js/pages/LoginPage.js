import { Page } from "./Page.js";

export class LoginPage extends Page {
  render() {
    this.container.innerHTML = `
            <h1>Login Page</h1>
            <p>Welcome to the application.</p>
        `;
  }
}
