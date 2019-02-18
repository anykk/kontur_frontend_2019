const minSizes = {
    user: 4,
    date: 4,
    comment: 7,
    fileName: 8
};

const maxSizes = {
    user: 10,
    date: 10,
    comment: 50,
    fileName: 15
};

const fieldToSizeMap = new Map([
    ['user', todo => todo.user.length ],
    ['date', todo => todo.date.repr.length],
    ['comment', todo => todo.comment.length],
    ['fileName', todo => todo.fileName.length]
]);

function calcColumnSizes (todoList) {
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