/**
 * Defines wrong date value.
 * @type {number}
 */
const WRONG_DATE = Number.MIN_SAFE_INTEGER;

/**
 * Object representation of time when commenting.
 * @typedef {Object} CommentDate
 * @property {number} value - comment time in ms.
 * @property {string} repr - string representation of date.
 */

/**
 * Object representation of todo comment.
 * @typedef {Object} TodoComment
 * @property {string} fileName - the name of file, where comment is.
 * @property {string} user - the username of the one who commented.
 * @property {CommentDate} date
 * @property {string} comment - the text of comment.
 * @property {number} importance - count of '!'
 */

/**
 * Parses body of todo comment into object.
 * @param {string} body
 * @param {string} fileName
 * @returns {TodoComment}
 */
function parseTodo(body, fileName) {
	const splitted = body.split(';').map(_ => _.trim());
	let user, dateString, comment;
	if (splitted.length < 3) {
		comment = splitted.join('');
		[user, dateString] = ['', ''];
	} else {
		[user, dateString] = splitted;
		comment = splitted.slice(2).join(';');
	}
	const importance = comment.split('!').length - 1;
	const date = parseDate(dateString);
	return {
		fileName,
		user,
		date,
		comment,
		importance,
	};
}

/**
 * Checks if date is correct.
 * @param {string} dateString - yyyy-mm-dd formatted string.
 * @returns {boolean}
 */
function isCorrectDate(dateString) {
	const date = Date.parse(dateString);
	return !Number.isNaN(date);
}

/**
 * Parses date string into comment date object.
 * @param {string} dateString
 * @returns {CommentDate}
 */
function parseDate(dateString) {
	if (!isCorrectDate(dateString)) {
		return {
			value: WRONG_DATE,
			repr: '',
		};
	}
	const date = Date.parse(dateString);
	return {
		value: date,
		repr: dateString,
	};
}

module.exports = {
	parseTodo,
	isCorrectDate,
	parseDate,
};
