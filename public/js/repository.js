import { Link } from './links.js';
import { Task } from './task.js';

export function saveLink(link) {
  const links = JSON.parse(localStorage.getItem('links')) || [];
  links.push(link);
  localStorage.setItem('links', JSON.stringify(links));
}

export function removeLink(link) {
  const links = JSON.parse(localStorage.getItem('links')) || [];
  const filteredLinks = links.filter(
    (l) => l.title !== link.title || l.link !== link.link,
  );
  localStorage.setItem('links', JSON.stringify(filteredLinks));
}

export function getLinks() {
  const links = JSON.parse(localStorage.getItem('links')) || [];

  if (links.length === 0) {
    links.push(
      new Link({
        title: 'CodeWars',
        link: 'https://www.codewars.com',
        defaultLink: true,
      }),
    );
    links.push(
      new Link({
        title: 'Hackerrank',
        link: 'https://www.hackerrank.com/',
        defaultLink: true,
      }),
    );
    links.push(
      new Link({
        title: 'Freecodecamp',
        link: 'https://www.freecodecamp.org',
        defaultLink: true,
      }),
    );
    localStorage.setItem('links', JSON.stringify(links));
  }

  return links;
}

export function saveTask(task) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

export function removeTask(task) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const filteredTasks = tasks.filter((t) => t.description !== task.description);
  localStorage.setItem('tasks', JSON.stringify(filteredTasks));
}

export function completeTask(task) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let index = -1;
  tasks.forEach((t, i) => {
    if (t.description == task.description) {
      index = i;
    }
  });
  tasks[index] = task;
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

export function getTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  return tasks;
}
