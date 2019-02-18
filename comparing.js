function compareByDate(a, b) {
    return b.date.value - a.date.value;
}

function compareByImportance(a, b) {
    return b.importance - a.importance;
}

function compareByUser(a, b) {
    const userA = a.user.toLowerCase();
    const userB = b.user.toLowerCase();
    if (!userA && userB) {
        return 1;
    }
    if (userA && !userB) {
        return -1;
    }
    if (userA === userB) {
        return 0;
    }
    if (userA > userB) {
        return 1;
    }
    if (userA < userB) {
        return -1;
    }
}

module.exports = {
    compareByDate,
    compareByImportance,
    compareByUser
}