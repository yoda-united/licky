var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Search Events'] = function (evt) {
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });

    var table = Ti.UI.createTableView({
        backgroundColor: '#fff',
        top: 0, bottom: 0,
        data: [
            { title: 'Loading, please wait...' }
        ]
    });

    table.addEventListener('click', function (evt) {
        if (evt.row.id) {
	        WindowManager.handleOpenWindow({ target: 'Show Event', id: evt.row.id });
        }
    });
    win.add(table);

    function searchEvents() {
        Cloud.Events.search(function (e) {
            if (e.success) {
	            if (e.events.length == 0) {
                    table.setData([
                        { title: 'No events' }
                    ]);
                } else {
	                var data = [];
		            for (var i = 0, l = e.events.length; i < l; i++) {
              	        var event = e.events[i];
                        var row = Ti.UI.createTableViewRow({
                            title: event.name,
                            id: event.id
                        });
                        data.push(row);
                    }
		            table.setData(data);
	            }
            } else {
                table.setData([
                    { title: (e.error && e.message) || e }
                ]);
                Utils.error(e);
            }
        })
    }

    win.addEventListener('open', searchEvents);
    return win;
};