function calcColumnSizes (todoList) {
    const maxUserSize = 10;
    const maxDateSize = 10;
    const maxCommentSize = 50;
    const maxFileNameSize = 15;
    const sizes = {
        user: 4,
        date: 4,
        comment: 7,
        fileName: 8
    };
    const preferSize = (a, b, bound) => Math.min(Math.max(a, b), bound);
    todoList.forEach(todo => {
        const userSize = todo.user.length;
        const dateSize = todo.date.repr.length;
        const commentSize = todo.comment.length;
        const fileNameSize = todo.fileName.length;
        sizes.user = preferSize(sizes.user, userSize, maxUserSize);
        sizes.date = preferSize(sizes.date, dateSize, maxDateSize);
        sizes.comment = preferSize(sizes.comment, commentSize, maxCommentSize);
        sizes.fileName = preferSize(sizes.fileName, fileNameSize, maxFileNameSize);
    });
    return sizes;
}

function renderColumn (value, maxSize) {
    const padding = '  ';
    if (value.length > maxSize) {
        value = value.substr(0, maxSize - 1) + '…';
    } else {
        const diff = maxSize - value.length;
        const additionalPad = ''.padStart(diff, ' ');
        value = value + additionalPad;
    }
    const column = [ padding, value, padding ].join('');
    return column;
}

function renderTodo (todo, sizes) {
    return [ 
        todo => [ (todo.importance) ? '!' : ' ', 1 ],
        todo => [ todo.user, sizes.user ],
        todo => [ todo.date.repr, sizes.date ],
        todo => [ todo.comment, sizes.comment ],
        todo => [ todo.fileName, sizes.fileName ]
    ].map(f => renderColumn(...f(todo))).join('|');
}

function renderHeader (sizes) {
    return renderTodo({
        importance: 1,
        user: 'user',
        date: {
            repr: 'date'
        },
        comment: 'comment',
        fileName: 'fileName'
    }, sizes);
}

function renderTodoList (todoList) {
    const sizes = calcColumnSizes(todoList);
    const header = renderHeader(sizes);
    const horizontalRule = ''.padStart(header.length, '-');
    const renderedTodos = todoList.map(todo => renderTodo(todo, sizes));
    const partsToRender = (todoList.length) ? 
    [ header, horizontalRule, ...renderedTodos, horizontalRule ] : [ header, horizontalRule ];
    return partsToRender.join('\n');
}

module.exports = {
    renderTodoList
}