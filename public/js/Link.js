export default class Link {
  constructor({ title, link, defaultLink }) {
    this.title = title;
    this.link = link;
    this.defaultLink = defaultLink;
  }

  toString() {
    return `${this.title} ${this.link}`;
  }
}
