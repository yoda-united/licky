var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Search Place'] = function (evt) {
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });

    var table = Ti.UI.createTableView({
        backgroundColor: '#fff',
        top: 0, bottom: 0
    });
    table.addEventListener('click', function (evt) {
        if (evt.row.id) {
            WindowManager.handleOpenWindow({ target: 'Show Place', id: evt.row.id });
        }
    });
    win.add(table);

    function findPlaces(lat, lon) {
        Cloud.Places.search({
            latitude: lat,
            longitude: lon
        }, function (e) {
            if (e.success) {
                if (e.places.length == 0) {
                    table.setData([
                        { title: 'No Results!' }
                    ]);
                }
                else {
                    var data = [];
                    for (var i = 0, l = e.places.length; i < l; i++) {
                        data.push(Ti.UI.createTableViewRow({
                            title: e.places[i].name,
                            id: e.places[i].id
                        }));
                    }
                    table.setData(data);
                }
            }
            else {
                Utils.error(e);
            }
        });
    }

    function findMe() {

        table.setData([
            { title: 'Geolocating...' }
        ]);

        if (Ti.Geolocation) {
            Ti.Geolocation.purpose = 'To find nearby places.';
            Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
            Ti.Geolocation.distanceFilter = 0;
            Ti.Geolocation.getCurrentPosition(function (e) {
                if (!e.success || e.error) {
                    findPlaces(null, null);
                    table.setData([
                        { title: 'GPS lost, looking nearby...' }
                    ]);
                }
                else {
                    table.setData([
                        { title: 'Located, looking nearby...' }
                    ]);
                    findPlaces(e.coords.latitude, e.coords.longitude);
                }
            });
        }
        else {
            Cloud.Clients.geolocate(function (e) {
                if (e.success) {
                    table.setData([
                        { title: 'Located, looking nearby...' }
                    ]);
                    findPlaces(e.location.latitude, e.location.longitude)
                }
                else {
                    findPlaces(null, null);
                    table.setData([
                        { title: 'GPS lost, looking nearby...' }
                    ]);
                }
            });
        }
    }

    win.addEventListener('open', findMe);
    return win;
};