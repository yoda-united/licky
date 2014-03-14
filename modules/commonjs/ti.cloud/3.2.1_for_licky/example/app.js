/*
 * We'll follow a really simple paradigm in this example app. It's going to be a hierarchy of tables where you can drill
 * in to individual examples for each ACS namespace.
 *
 * To facilitate that, we will have a collection of "windowFunctions" like the "Users" window, and the "Login" window.
 *
 * These are defined in the "windows" folder and its children.
 *
 * That's it! Enjoy.
 */
var Cloud = require('ti.cloud');
var pushToken = '';
Cloud.debug = true;

// Find out if this is iOS 7 or greater
function isIOS7Plus() {
    if (Titanium.Platform.name == 'iPhone OS') {
        var version = Titanium.Platform.version.split(".");
        var major = parseInt(version[0],10);
        // can only test this support on a 3.2+ device
        if (major >= 7) {
            return true;
        }
    }
    return false;

}
var IOS7 = isIOS7Plus();
var top = IOS7 ? 20 : 0;

// Define our window store.
var windowFunctions = {};
function handleOpenWindow(evt) {
    var target = (evt.row && evt.row.title) || evt.target;
    if (windowFunctions[target]) {
        windowFunctions[target](evt);
    }
}

// Utility functions for defining windows.
var u = Ti.Android != undefined ? 'dp' : 0;
function createWindow() {
    return Ti.UI.createWindow({
        backgroundColor: '#fff',
        navBarHidden: true
    });
}
function addBackButton(win) {
    if (Ti.Android) {
        return 0;
    }
    var back = Ti.UI.createButton({
        title: 'Back',
        color: '#fff', backgroundColor: '#000',
        style: 0,
        top: top, left: 0, right: 0,
        height: 40 + u
    });
    back.addEventListener('click', function (evt) {
        win.close();
    });
    win.add(back);
    return 40 + top;
}
function createRows(rows) {
    for (var i = 0, l = rows.length; i < l; i++) {
        rows[i] = Ti.UI.createTableViewRow({
            backgroundColor: '#fff',
            title: rows[i],
            hasChild: true,
            height: 30 + u,
            font: { fontSize: 20 + u }
        });
    }
    return rows;
}

function enumerateProperties(container, obj, offset) {
    for (var key in obj) {
        if (!obj.hasOwnProperty(key))
            continue;
        container.add(Ti.UI.createLabel({
            text: key + ': ' + obj[key], textAlign: 'left',
            color: '#000', backgroundColor: '#fff',
            height: 30 + u, left: offset, right: 20 + u
        }));
        if (obj[key].indexOf && obj[key].indexOf('http') >= 0 
            && (obj[key].indexOf('.jpeg') > 0 || obj[key].indexOf('.jpg') > 0 || obj[key].indexOf('.png') > 0)) {
            container.add(Ti.UI.createImageView({
                image: obj[key],
                height: 120 + u, width: 120 + u,
                left: offset
            }));
        }
        if (typeof(obj[key]) == 'object') {
            enumerateProperties(container, obj[key], offset + 20);
        }
    }
}

function error(e) {
    var msg = (e.error && e.message) || JSON.stringify(e);
    if (e.code) {
        alert(msg);
    } else {
        Ti.API.error(msg);
    }
}

function convertISOToDate(isoDate) {
    isoDate = isoDate.replace(/\D/g," ");
    var dtcomps = isoDate.split(" ");
    dtcomps[1]--;
    return new Date(Date.UTC(dtcomps[0],dtcomps[1],dtcomps[2],dtcomps[3],dtcomps[4],dtcomps[5]));
}

// Include the window hierarchy.
Ti.include(
    'windows/chats/table.js',
    'windows/checkins/table.js',
    'windows/clients/table.js',
    'windows/customObjects/table.js',
    'windows/emails/table.js',
    'windows/events/table.js',
    'windows/files/table.js',
    'windows/friends/table.js',
    'windows/geoFences/table.js',
    'windows/photoCollections/table.js',
    'windows/photos/table.js',
    'windows/places/table.js',
    'windows/posts/table.js',
    'windows/keyValues/table.js',
    'windows/likes/table.js',
    'windows/messages/table.js',
    'windows/pushNotifications/table.js',
    'windows/pushSchedules/table.js',
    'windows/reviews/table.js',
    'windows/social/table.js',
    'windows/status/table.js',
    'windows/users/table.js',
    'windows/accessControlLists/table.js'
);

// Define our main window.
var win = Ti.UI.createWindow({
    backgroundColor: '#fff',
    navBarHidden: true,
    exitOnClose: true
});
var table = Ti.UI.createTableView({
    top: top,
    backgroundColor: '#fff',
    data: createRows([
        'Users',
        'Access Control Lists',
        'Chats',
        'Checkins',
        'Clients',
        'Custom Objects',
        'Emails',
        'Events',
        'Files',
        'Friends',
        'GeoFences',
        'Key Values',
        'Likes',
        'Messages',
        'Photo Collections',
        'Photos',
        'Places',
        'Posts',
        'Push Notifications',
        'Push Schedules',
        'Reviews',
        'Social',
        'Status'
    ])
});
table.addEventListener('click', handleOpenWindow);
win.add(table);
win.open();