windowFunctions['Query Push Schedules'] = function (evt) {
  var win = createWindow();
  var offset = addBackButton(win);

  var table = Ti.UI.createTableView({
    backgroundColor: '#fff',
    top: offset + u, bottom: 0,
    data: [
      { title: 'Loading, please wait...' }
    ]
  });
  table.addEventListener('click', function (evt) {
    if (evt.row.id) {
      handleOpenWindow({ target: 'Remove Push Schedules', id: evt.row.id });
    }
  });
  win.add(table);

  win.addEventListener('open', function () {
    Cloud.PushSchedules.query(function (e) {
      if (e.success) {
        if (e.push_schedules.length === 0) {
          table.setData([
            { title: 'No Push Schedules!' }
          ]);
        } else {
          var data = [];
          for (var i = 0, l = e.push_schedules.length; i < l; i++) {
            data.push(Ti.UI.createTableViewRow({
              title: JSON.stringify(e.push_schedules[i]),
              id: e.push_schedules[i].id,
              font: { fontSize: 12 + u }
            }));
          }
          table.setData(data);
        }
      } else {
        error(e);
      }
    });
  });

  win.open();
};
