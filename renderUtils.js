/**
 * @typedef {import('./parsing').TodoComment} TodoComment
 */

/**
 * Object with column sizes.
 * Each field of it defines size of corresponding column.
 * @typedef {Object} ColumnSizes
 * @property {number} user
 * @property {number} date
 * @property {number} comment
 * @property {number} fileName
 */

/**
 * Defines minimal column sizes.
 * @type {ColumnSizes}
 */
const minSizes = {
	user: 4,
	date: 4,
	comment: 7,
	fileName: 8,
};

/**
 * Defines maximal column sizes.
 * @type {ColumnSizes}
 */
const maxSizes = {
	user: 10,
	date: 10,
	comment: 50,
	fileName: 15,
};

const fieldToSizeMap = new Map([
	['user', todo => todo.user.length],
	['date', todo => todo.date.repr.length],
	['comment', todo => todo.comment.length],
	['fileName', todo => todo.fileName.length],
]);

/**
 * Calculates column sizes based on todo comments to render.
 * @param {Array<TodoComment>} todoList
 * @returns {ColumnSizes}
 */
function calcColumnSizes(todoList) {
	const sizes = Object.assign({}, minSizes);
	const preferSize = (a, b, bound) => Math.min(Math.max(a, b), bound);
	todoList.forEach(todo => {
		fieldToSizeMap.forEach((f, key) => {
			const todoFieldSize = f(todo);
			sizes[key] = preferSize(sizes[key], todoFieldSize, maxSizes[key]);
		});
	});
	return sizes;
}

/**
 * Renders one column of table.
 * @param {string} value
 * @param {number} maxSize
 * @returns {string}
 */
function renderColumn(value, maxSize) {
	const padding = '  ';
	if (value.length > maxSize) {
		value = value.substr(0, maxSize - 1) + '…';
	} else {
		const diff = maxSize - value.length;
		const additionalPad = ''.padStart(diff, ' ');
		value = value + additionalPad;
	}
	const column = [padding, value, padding].join('');
	return column;
}

/**
 * Renders one line of table (or concrete todo).
 * @param {TodoComment} todo
 * @param {ColumnSizes} sizes
 * @returns {string}
 */
function renderTodo(todo, sizes) {
	if (!todo.comment) {
		return '';
	}
	return [
		todo => [todo.importance ? '!' : ' ', 1],
		todo => [todo.user, sizes.user],
		todo => [todo.date.repr, sizes.date],
		todo => [todo.comment, sizes.comment],
		todo => [todo.fileName, sizes.fileName],
	]
		.map(f => renderColumn(...f(todo)))
		.join('|');
}

/**
 * Renders header line of table.
 * @param {ColumnSizes} sizes
 * @returns {string}
 */
function renderHeader(sizes) {
	return renderTodo(
		{
			importance: 1,
			user: 'user',
			date: {
				repr: 'date',
			},
			comment: 'comment',
			fileName: 'fileName',
		},
		sizes
	);
}

/**
 * Renders all table (or actual todo list).
 * @param {Array<TodoComment>} todoList
 * @returns {string}
 */
function renderTodoList(todoList) {
	const sizes = calcColumnSizes(todoList);
	const header = renderHeader(sizes);
	const horizontalRule = ''.padStart(header.length, '-');
	const renderedTodos = todoList.map(todo => renderTodo(todo, sizes));
	const partsToRender = todoList.length
		? [header, horizontalRule, ...renderedTodos, horizontalRule]
		: [header, horizontalRule];
	return partsToRender.join('\n');
}

module.exports = {
	renderTodoList,
};
