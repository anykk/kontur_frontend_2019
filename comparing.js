/**
 * @typedef {import('./parsing').TodoComment} TodoComment
 */

/**
 * Compares two todo by date descending.
 * @param {TodoComment} a
 * @param {TodoComment} b
 * @returns {(1|0|-1)}
 */
function compareByDate(a, b) {
	return b.date.value - a.date.value;
}

/**
 * Compares two todo by importance by descending.
 * @param {TodoComment} a
 * @param {TodoComment} b
 * @returns {(1|0|-1)}
 */
function compareByImportance(a, b) {
	return b.importance - a.importance;
}

/**
 * Compares two todo by user (like default js strings compare do it),
 * but '' the biggest.
 * @param {TodoComment} a
 * @param {TodoComment} b
 * @returns {(1|0|-1)}
 */
function compareByUser(a, b) {
	const userA = a.user.toLowerCase();
	const userB = b.user.toLowerCase();
	if (!userA && userB) {
		return 1;
	}
	if (userA && !userB) {
		return -1;
	}
	if (userA > userB) {
		return 1;
	}
	if (userA < userB) {
		return -1;
	}
	return 0;
}

module.exports = {
	compareByDate,
	compareByImportance,
	compareByUser,
};
