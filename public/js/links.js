'use strict';
export class Link {
    constructor(data) {
        this.title = data.title;
        this.link = data.link;
        this.defaultLink = data.defaultLink;
    }
    toString() {
        return this.title + ' ' + this.link;
    }
}
