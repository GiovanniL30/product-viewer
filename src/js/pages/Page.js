export class Page {
  constructor(container, options = {}) {
    this.container = container;
    this.options = options;
  }

  render() {
    throw new Error("render() must be implemented");
  }
}