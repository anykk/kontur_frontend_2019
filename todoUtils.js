const { parseTodo, isCorrectDate } = require('./parsing');

function getTodoList (files) {
    const todoRegExp = /\/\/\s*todo\s*\:?\s*([а-яё\w:;,.+\-*^$!?@№#'"` [\](){}<>]*)/ig;
    return files.reduce((acc, file) => {
        const { fileName } = file;
        const todoList = [];
        while (matched = todoRegExp.exec(file.data)) {
            const body = matched[1];
            const todo = parseTodo(body, fileName);
            todoList.push(todo);
        }
        return acc.concat(todoList); 
    }, []);
}

function getImportantTodoList (todoList) {
    return todoList.filter(todo => todo.importance > 0);
}

function findTodoFromUser (todoList, userName) {
    if (userName === '') {
        return [];
    }
    userName = userName.toLowerCase();
    return todoList.filter(todo => {
        const user = todo.user.toLowerCase();
        return user.startsWith(userName);
    });
}

function getDatedTodoList (todoList, dateString) {
    if (dateString === '' || !isCorrectDate(dateString)) {
        return [];
    }
    const date = Date.parse(dateString);
    return todoList.filter(todo => todo.date.value >= date)
}

module.exports = {
    getTodoList,
    getImportantTodoList,
    getDatedTodoList,
    findTodoFromUser
}