export class Task {
  constructor(data) {
    this.description = data.description;
    this.completed = data.completed;
  }

  toString() {
    return `${this.title} ${this.completed}`;
  }
}
