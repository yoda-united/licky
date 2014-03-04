Ti.include(
    'create.js',
    'update.js',
    'query.js',
    'remove.js',
    'search.js',
    'show.js'
);

windowFunctions['Status'] = function (evt) {
    var win = createWindow();
    var offset = addBackButton(win);
    var table = Ti.UI.createTableView({
        backgroundColor: '#fff',
        top: offset + u,
        data: createRows([
            'Create Status',
            'Query Status',
            'Search Statuses by User'
        ])
    });
    table.addEventListener('click', handleOpenWindow);
    win.add(table);
    win.open();
};