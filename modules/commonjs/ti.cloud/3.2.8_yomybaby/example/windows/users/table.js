var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
WindowManager.include(

    '/windows/users/loginStatus',
    '/windows/users/create',
    '/windows/users/login',
    '/windows/users/logout',
    '/windows/users/query',
    '/windows/users/remove',
    '/windows/users/requestResetPassword',
    '/windows/users/resendConfirmation',
    '/windows/users/search',
    '/windows/users/show',
    '/windows/users/showMe',
    '/windows/users/update'
);
exports['Users'] = function (evt) {
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });
    var table = Ti.UI.createTableView({
        backgroundColor: '#fff',
        top: 0,
        data: Utils.createRows([
            'Login Status',
            'Create User',
            'Login User',
            'Request Reset Password',
            'Resend Confirmation',
            'Show Current User',
            'Update Current User',
            'Remove Current User',
            'Logout Current User',
            'Query User',
            'Search User'
        ])
    });
    table.addEventListener('click', WindowManager.handleOpenWindow);
    win.add(table);
    return win;
};