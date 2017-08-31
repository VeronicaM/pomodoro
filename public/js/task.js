'use strict'
class Task {
    constructor(data) {
        this.title = data.title;
        this.description = data.description;
        this.completed = data.completed;
    };
    complete() {
        console.log('completing task: ' + this.title);
        this.completed = true;
    }
    save() {
        console.log('saving Task: ' + this.title);
    }
    toString() {
        return this.title + ' ' + this.description;
    }
}

var myTask = new Task('my first task', 'finished the design patterns class');
console.log(myTask);