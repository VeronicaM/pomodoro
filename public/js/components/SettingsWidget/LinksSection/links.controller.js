import Link from "./Link";

export default class LinksController {

  constructor() {
    // view elements
    this.container = $("#js-links");
    this.listSelector = "#js-links table";
    this.deleteIconSelector = "settings-widget-links__delete";
    this.addBtn = $("#js-add-Link-btn");
    this.titleInput = $("#js-link-title");
    this.valueInput = $("#js-link-value");

    // props
    this.links = [];

    this.initView();

    // add event listeners
    this.addBtn.on("click", this.onAddLink.bind(this));
  }

  initView() {
    this.links = this.getLinks();
    this.display(); // eslint-disable-line no-use-before-define
  }

  getLinks() {
    const defaultLinks = [
      new Link({
        title: "CodeWars",
        link: "https://www.codewars.com",
        defaultLink: true,
      }),
      new Link({
        title: "Hackerrank",
        link: "https://www.hackerrank.com/",
        defaultLink: true,
      }),
      new Link({
        title: "Freecodecamp",
        link: "https://www.freecodecamp.org",
        defaultLink: true,
      })
    ];

    let links = JSON.parse(localStorage.getItem("links")) || [];

    if (!links.length) {
      links = defaultLinks;
    }

    localStorage.setItem("links", JSON.stringify(links));

    return links;
  }

  saveLink(link) {
    this.links = [...this.links, link];
    localStorage.setItem("links", JSON.stringify(this.links));
  }

  removeLink(link) {
    const filteredLinks = this.links.filter(
      (linkItem) => linkItem.title !== link.title || linkItem.link !== link.link
    );

    localStorage.setItem("links", JSON.stringify(filteredLinks));
    this.links = filteredLinks;
  }

  generateLinksTemplate() {
    let content = "<table>";
    let appendDelete = "";

    for (let i = 0; i < this.links.length; i = i + 1) {

      // default links cannot be removed
      if (!this.links[i].defaultLink) {
        appendDelete = `<td class='${this.deleteIconSelector}' data-linkValue='${JSON.stringify(this.links[i])}'> X </td>`;
      }

      content += `<tr>
                    <td>${this.links[i].title}</td>
                    <td>
                      <a href='${this.links[i].link}' target="_blank">${this.links[i].link}</a>
                    </td>
                      ${appendDelete}
                </tr>`;
    }

    content += "</table>";

    return content;
  };

  display() {
    this.container.empty();

    const linksTemplate = this.generateLinksTemplate();

    this.container.append(linksTemplate);

    // add event listener on the printed links
    $(`.${this.deleteIconSelector}`).on("click", this.onDeleteLink.bind(this));
  }

  onDeleteLink(e) {
    const attributeContent = e.currentTarget.getAttribute("data-linkValue");
    const object = JSON.parse(attributeContent);
    this.removeLink(object);

    this.display();
  }

  displayLink(newLink) {
    const appendDelete = `<td class='${this.deleteIconSelector}' data-linkValue='${JSON.stringify(
      newLink
    )}'> X </td>`;
    const content = `<tr><td>${newLink.title}</td><td><a href='${newLink.link}' target="_blank">${newLink.link}</a></td>${appendDelete}</tr>`;

    $(this.listSelector).append(content);
  }

  onAddLink() {
    // get input values
    const title = this.titleInput.val();
    const linkValue = this.valueInput.val();

    if (title && linkValue) {
      // reset inputs
      this.titleInput.val("");
      this.valueInput.val("");

      if (title && linkValue) {
        const newLink = new Link({
          title,
          link: linkValue,
          defaultLink: false,
        });

        this.saveLink(newLink);
        this.displayLink(newLink);

        // add event listener on the printed link
        $(`.${this.deleteIconSelector}`).on("click", this.onDeleteLink.bind(this));
      }
    }
  }
}