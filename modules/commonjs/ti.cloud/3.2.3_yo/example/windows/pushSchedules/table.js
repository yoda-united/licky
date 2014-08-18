// Push Schedule is only available to admin user or web admin.
Ti.include(
  'create.js',
  'query.js',
  'remove.js'
);

windowFunctions['Push Schedules'] = function (evt) {
    var win = createWindow();
    var offset = addBackButton(win);
    var table = Ti.UI.createTableView({
        backgroundColor: '#fff',
        top: offset + u,
        data: createRows([
          'Create Push Schedule',
          'Query Push Schedules',
          'Remove Push Schedules'
        ])
    });
    table.addEventListener('click', handleOpenWindow);
    win.add(table);
    win.open();
};