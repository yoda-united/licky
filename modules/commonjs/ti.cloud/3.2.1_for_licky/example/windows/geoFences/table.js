Ti.include(
    'create.js',
    'update.js',
    'query.js',
    'remove.js'
);

windowFunctions['GeoFences'] = function (evt) {
    var win = createWindow();
    var offset = addBackButton(win);
    var table = Ti.UI.createTableView({
        backgroundColor: '#fff',
        top: offset + u,
        data: createRows([
            'Create Geo Fence',
            'Query Geo Fences'
        ])
    });
    table.addEventListener('click', handleOpenWindow);
    win.add(table);
    win.open();
};