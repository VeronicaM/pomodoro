import Task from './Task';

const getTasks = () => {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  return tasks;
};

export default class TasksController {
  constructor() {
    // elements
    this.widget = $('.tasks-widget');
    this.widgetToggle = $('.tasks-widget__trigger');
    this.container = $('.tasks-widget__tasks');
    this.deleteIconSelector = 'tasks-widget__delete';
    this.checkboxSelector = 'tasks-widget__checkbox';
    this.completeTaskClassName = 'strike-text';
    this.taskInput = $('#taskName');

    // properties
    this.tasks = [];

    this.initView();

    // add event listeners
    this.widgetToggle.on('click', this.onContainerToggle.bind(this));
    this.taskInput.keypress(this.onTypeTask.bind(this));
  }

  initView() {
    this.tasks = getTasks();
    this.print();
  }

  saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    this.tasks = tasks;
  }

  removeTask(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const filteredTasks = tasks.filter((t) => t.description !== task.description);
    localStorage.setItem('tasks', JSON.stringify(filteredTasks));
    this.tasks = tasks;
  }

  completeTask(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const index = tasks.findIndex(
      (taskItem) => taskItem.description === task.description,
    );

    tasks[index] = task;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    this.tasks = tasks;
  }

  generateTaskTemplate(task) {
    const appendDelete = `<span class='${this.deleteIconSelector}' data-taskValue='${JSON.stringify(
      task,
    )}'> x </span>`;
    const className = task.completeTask ? this.completeTaskClassName : '';
    const content = `<label class='${className}'><input taskValue='${JSON.stringify(
      task,
    )}' class='${this.checkboxSelector}' type ='checkbox' value ='${task.description}'> ${
      task.description
    }${appendDelete}</label>`;

    return content;
  }

  printTask(task) {
    const taskTemplate = this.generateTaskTemplate(task);
    this.container.append(taskTemplate);
    this.addEventListners();
  }

  addEventListners() {
    $(`.${this.deleteIconSelector}`).on('click', this.onDeleteTask.bind(this));
    $(`.${this.checkboxSelector}`).change(this.onToggleTaskComplete.bind(this));
  }

  generateTasksTemplate() {
    let content = '';
    let appendDelete = '';
    let className = '';
    let checked = '';
    for (let i = 0; i < this.tasks.length; i += 1) {
      appendDelete = `<span class='${this.deleteIconSelector}' data-taskValue='${JSON.stringify(
        this.tasks[i],
      )}'> x </span>`;
      if (this.tasks[i].completed) {
        className = this.completeTaskClassName;
        checked = 'checked';
      }
      content += `<label class='${className}'><input taskValue='${JSON.stringify(
        this.tasks[i],
      )}' class='${this.checkboxSelector}' type ='checkbox' ${checked} value ='${
        this.tasks[i].description
      }'> ${this.tasks[i].description}${appendDelete}</label>`;
      className = '';
      checked = '';
    }

    return content;
  }

  print() {
    const tasksTemplate = this.generateTasksTemplate();
    this.container.empty();
    this.container.append(tasksTemplate);

    this.addEventListners();
  }

  onDeleteTask(e) {
    const attributeContent = e.currentTarget.getAttribute('data-taskValue');
    const object = JSON.parse(attributeContent);

    this.removeTask(object);

    this.initView();
  }

  onToggleTaskComplete(e) {
    const attributeContent = e.currentTarget.getAttribute('taskValue');
    const object = JSON.parse(attributeContent);

    if (e.currentTarget.checked) {
      e.currentTarget.parentElement.className = this.completeTaskClassName;
      object.completed = true;
    } else {
      e.currentTarget.parentElement.className = '';
      object.completed = false;
    }

    this.completeTask(object);
  }

  onContainerToggle(e) {
    if (e.target === this.widgetToggle[0]) {
      this.widget.toggle();
    }
  }

  onTypeTask(e) {
    const key = e.which;
    if (key === 13 && e.currentTarget.value) {
      // the enter key code
      const newTask = new Task({
        description: e.currentTarget.value,
        completed: false,
      });

      this.saveTask(newTask);
      this.printTask(newTask);

      // reset current value
      e.currentTarget.value = '';
    }
  }
}
