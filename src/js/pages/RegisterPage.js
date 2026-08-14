import { Page } from "./Page.js";

export class RegisterPage extends Page {
  render() {
    this.container.innerHTML = `
            <h1>Register Page</h1>
            <p>Here are our products.</p>
        `;
  }
}
