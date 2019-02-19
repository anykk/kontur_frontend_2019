const { parseTodo, isCorrectDate } = require('./parsing');

/**
 * @typedef {import('./index').FileObject} FileObject
 * @typedef {import('./parsing').TodoComment} TodoComment
 */

/**
 * Claims all todo from files.
 * @param {Array<FileObject>} files
 * @returns {Array<TodoComment>}
 */
function getTodoList(files) {
	const todoRegExp = /\/\/\s*todo\s*:?\s*([а-яё\w:;,.+\-*^$!?@№#'"` [\](){}<>]*)/gi;
	return files.reduce((acc, file) => {
		const { fileName } = file;
		const todoList = [];
		while ((matched = todoRegExp.exec(file.data))) {
			const [, body] = matched;
			const todo = parseTodo(body, fileName);
			todoList.push(todo);
		}
		return acc.concat(todoList);
	}, []);
}

/**
 * Gets only important todo.
 * @param {Array<TodoComment>} todoList
 * @returns {Array<TodoComment>}
 */
function getImportantTodoList(todoList) {
	return todoList.filter(todo => todo.importance > 0);
}

/**
 * Finds todo left by user.
 * @param {Array<TodoComment>} todoList
 * @param {string} userName
 * @returns {Array<TodoComment>}
 */
function findTodoFromUser(todoList, userName) {
	if (userName === '') {
		return [];
	}
	userName = userName.toLowerCase();
	return todoList.filter(todo => {
		const user = todo.user.toLowerCase();
		return user.startsWith(userName);
	});
}

/**
 * Gets list of todo left after a certain date.
 * @param {Array<TodoComment>} todoList
 * @param {string} dateString
 * @returns {Array<TodoComment>}
 */
function getDatedTodoList(todoList, dateString) {
	if (dateString === '' || !isCorrectDate(dateString)) {
		return [];
	}
	const date = Date.parse(dateString);
	return todoList.filter(todo => todo.date.value >= date);
}

module.exports = {
	getTodoList,
	getImportantTodoList,
	getDatedTodoList,
	findTodoFromUser,
};
