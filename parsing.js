const WRONG_DATE = Number.MIN_SAFE_INTEGER;

function parseTodo (body, fileName) {
    const splitted = body.split(';').map(_ => _.trim());
    let user, dateString, comment;
    if (splitted.length < 3) {
        comment = splitted.join('');
        [ user, dateString ] = ['', ''];
    } else {
        [ user, dateString, ] = splitted;
        comment = splitted.slice(2).join(';');
    }
    const importance = comment.split('!').length - 1;
    const date = parseDate(dateString);
    return {
        fileName,
        user,
        date,
        comment,
        importance
    };
}

function isCorrectDate (dateString) {
    const date = Date.parse(dateString);
    return !Number.isNaN(date);
}

function parseDate (dateString) {
    if (!isCorrectDate(dateString)) {
        return {
            value: WRONG_DATE,
            repr: ''
        };
    }
    const date = Date.parse(dateString);
    return {
        value: date,
        repr: dateString
    };
} 

module.exports = {
    parseTodo,
    isCorrectDate,
    parseDate
};