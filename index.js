const {
	getAllFilePathsWithExtension,
	readFile,
	getFileName,
} = require('./fileSystem');
const { readLine } = require('./console');
const {
	getTodoList,
	getImportantTodoList,
	getDatedTodoList,
	findTodoFromUser,
} = require('./todoUtils');
const {
	compareByDate,
	compareByImportance,
	compareByUser,
} = require('./comparing');
const { renderTodoList } = require('./renderUtils');

app();

function app() {
	const files = getFiles();
	const todoList = getTodoList(files);

	const readLineCb = command => processCommand(command, todoList);

	console.log('Please, write your command!');
	readLine(readLineCb);
}

/**
 * @typedef {Object} FileObject
 * @property {string} fileName
 * @property {string} data - content of file.
 */

/**
 * Gets all file names and data from files from current directory.
 * @returns {Array<FileObject>}
 */
function getFiles() {
	const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
	return filePaths.map(path => ({
		fileName: getFileName(path),
		data: readFile(path),
	}));
}

function normalizeCommand(command) {
	command = command.trim().toLowerCase();
	return command.replace(/\s+/g, ' ');
}

function isCorrectArgs(args, possibleValues = [], argsLength = 0) {
	if (args.length !== argsLength) {
		return false;
	}
	if (possibleValues.length) {
		return args.every(val => possibleValues.includes(val));
	}
	return true;
}

function processCommand(command) {
	const [, todoList] = arguments;
	command = normalizeCommand(command);
	[command, ...args] = command.split(' ');
	const commandHandlers = new Map([
		['exit', () => process.exit(0)],
		['show', showCommand],
		['important', importantCommand],
		['user', userCommand],
		['sort', sortCommand],
		['date', dateCommand],
	]);
	const defaultHandler = () => console.log('wrong command');
	const handler = commandHandlers.get(command) || defaultHandler;
	handler();

	function showCommand() {
		if (!isCorrectArgs(args)) {
			return console.log("Show command doesn't require arguments!");
		}
		console.log(renderTodoList(todoList));
	}

	function importantCommand() {
		if (!isCorrectArgs(args)) {
			return console.log("Important command doesn't require arguments!");
		}
		const listOfImportantTodo = getImportantTodoList(todoList);
		console.log(renderTodoList(listOfImportantTodo));
	}

	function userCommand() {
		if (!isCorrectArgs(args, [], 1)) {
			return console.log('User command require 1 argument!');
		}
		const [user] = args;
		const todoListFromUser = findTodoFromUser(todoList, user);
		console.log(renderTodoList(todoListFromUser));
	}

	function sortCommand() {
		const availableTypes = ['importance', 'user', 'date'];
		if (!isCorrectArgs(args, availableTypes, 1)) {
			return console.log(
				'Sort command require 1 argument! ' +
					`It's may be one of [${availableTypes.join(', ')}].`
			);
		}
		const map = new Map([
			[availableTypes[0], () => todoList.sort(compareByImportance)],
			[availableTypes[1], () => todoList.sort(compareByUser)],
			[availableTypes[2], () => todoList.sort(compareByDate)],
		]);
		const [type] = args;
		const sortedTodoList = map.get(type)();
		console.log(renderTodoList(sortedTodoList));
	}

	function dateCommand() {
		if (!isCorrectArgs(args, [], 1)) {
			return console.log('Date command require 1 argument!');
		}
		const [dateString] = args;
		const datedTodoList = getDatedTodoList(todoList, dateString);
		console.log(renderTodoList(datedTodoList));
	}
}

// TODO you can do it!
