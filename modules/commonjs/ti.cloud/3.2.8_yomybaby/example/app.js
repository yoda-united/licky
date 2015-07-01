/*
 * We'll follow a really simple paradigm in this example app. It's going to be a hierarchy of tables where you can drill
 * in to individual examples for each ACS namespace.
 *
 * To facilitate that, we will have a collection of "Window Functions" like the "Users" window, and the "Login" window.
 *
 * These are defined in the "windows" folder and its children.
 *
 * That's it! Enjoy.
 */
var Cloud = require('ti.cloud');
var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
Cloud.debug = true;

// Include the window hierarchy.
WindowManager.include(
    '/windows/chats/table',
    '/windows/checkins/table',
    '/windows/clients/table',
    '/windows/customObjects/table',
    '/windows/emails/table',
    '/windows/events/table',
    '/windows/files/table',
    '/windows/friends/table',
    '/windows/geoFences/table',
    '/windows/photoCollections/table',
    '/windows/photos/table',
    '/windows/places/table',
    '/windows/posts/table',
    '/windows/keyValues/table',
    '/windows/likes/table',
    '/windows/messages/table',
    '/windows/pushNotifications/table',
    '/windows/pushSchedules/table',
    '/windows/reviews/table',
    '/windows/social/table',
    '/windows/status/table',
    '/windows/users/table',
    '/windows/accessControlLists/table',
    '/windows/genericSendRequest'
);

// Define our main window.
var table = Ti.UI.createTableView({
    backgroundColor: '#fff',
    data: Utils.createRows([
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
        'Status',
        'Generic Send Request'
    ])
});
table.addEventListener('click', WindowManager.handleOpenWindow);
var win = WindowManager.createInitialWindow('ti.cloud demo', table);
win.open();



