export default class Task {
  constructor({ description, completed }) {
    this.description = description;
    this.completed = completed;
  }

  toString() {
    return `${this.title} ${this.completed}`;
  }
}
