// Be sure to include the "facebook" module when running this app. It is now separate from the sdk.
var Facebook = Ti.Facebook ? Ti.Facebook : require('facebook');

Ti.include(
    'externalLink.js',
    'externalLogin.js',
    'externalUnlink.js',
    'searchFacebookFriends.js'
);

windowFunctions['Social'] = function (evt) {
    var win = createWindow();
    var offset = addBackButton(win);
    var rows = [
        'Search Facebook Friends'
    ];
    if (Facebook.createLoginButton) {
        var available = true;
        try {
            Facebook.createLoginButton();
        }
        catch (err) {
            available = false;
        }
        if (available) {
            rows.push('External Link');
            rows.push('External Login');
            rows.push('External Unlink');
        }
    }
    var table = Ti.UI.createTableView({
        backgroundColor: '#fff',
        top: offset + u,
        data: createRows(rows)
    });
    table.addEventListener('click', handleOpenWindow);
    win.add(table);
    win.open();
};