var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['External Unlink'] = function (evt) {
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });
    var content = Ti.UI.createScrollView({
        top: 0,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    win.add(content);

    function unlinkAccount(evt) {
        Cloud.SocialIntegrations.externalAccountUnlink({
            id: evt.source.accountID,
            type: evt.source.accountType
        }, function (e) {
            if (e.success) {
                alert('Unlinked from ' + evt.source.accountType + '!');
                content.remove(evt.source);
            }
            else {
                Utils.error(e);
            }
        });
    }

    var status = Ti.UI.createLabel({
        text: 'Loading, please wait...', textAlign: 'center',
        top: 0, right: 0, bottom: 0, left: 0,
        backgroundColor: '#fff', zIndex: 2
    });
    win.add(status);

    win.addEventListener('open', function () {
        Cloud.Users.showMe(function (e) {
            status.hide();
            if (e.success) {
                var user = e.users[0];
                if (user.external_accounts.length == 0) {
                	alert('No linked accounts');
                } else {
	                for (var i = 0; i < user.external_accounts.length; i++) {
	                    var button = Ti.UI.createButton({
	                        title: 'Unlink from ' + user.external_accounts[i].external_type,
	                        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
	                        height: 40 + Utils.u,
	                        accountType: user.external_accounts[i].external_type,
	                        accountID: user.external_accounts[i].external_id
	                    });
	                    button.addEventListener('click', unlinkAccount);
	                    content.add(button);
	                }
                }
            }
            else {
                Utils.error(e);
            }
        });
    });
    return win;
};