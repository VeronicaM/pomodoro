import  {Link}  from './links.js';
import  {Task}  from './task.js';

export function saveLink(link){
	let links = JSON.parse(localStorage.getItem('links')) || [];
		links.push(link);
    localStorage.setItem('links', JSON.stringify(links));
}
export function removeLink(link){
	let links = JSON.parse(localStorage.getItem('links')) || [];
	let filteredLinks = links.filter(
			function(l){
				return l.title !== link.title 
						&& l.link !== link.link
			});
    localStorage.setItem('links', JSON.stringify(filteredLinks));
}
export function getLinks(){
	let links = JSON.parse(localStorage.getItem('links')) || [];
	if(links.length === 0){
		addDefaultLinks();
	}
	return links;
}

export function saveTask(task){
	let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
		tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
export function completeTask(){
	let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
	let filteredTasks = tasks.filter(
			function(t){
				return !t.completed;
			});
    localStorage.setItem('tasks', JSON.stringify(filteredTasks));
}
export function getTasks(){
	let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
	return tasks;
}

function addDefaultLinks(){
	saveLink(new Link({
			title: "CodeWars",
			link:"https://www.codewars.com",
			defaultLink:true
	}));
	saveLink(new Link({
			title:'Hackerrank',
			link:'https://www.hackerrank.com/',
			defaultLink:true
		}));
	saveLink(new Link({
			 title:'Freecodecamp',
			 link:'https://www.freecodecamp.org',
			 defaultLink:true
		}));
}