var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Query Objects'] = function (evt) {
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });

    var classname = Ti.UI.createTextField({
        hintText: 'Class Name',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false
    });
    win.add(classname);

    var button = Ti.UI.createButton({
        title: 'Query',
        top: 60 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u
    });
    win.add(button);

    var content = Ti.UI.createScrollView({
        top: 110 + Utils.u,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    win.add(content);

    var status = Ti.UI.createLabel({
        text: 'Loading, please wait...', textAlign: 'left',
        height: 30 + Utils.u, left: 20 + Utils.u, right: 20 + Utils.u
    });

    function submitForm() {
        if (!classname.value.length) {
            classname.focus();
            return;
        }
        classname.blur();
        button.hide();
        win.remove(content);
        content = Ti.UI.createScrollView({
            top: 110 + Utils.u,
            contentHeight: 'auto',
            layout: 'vertical'
        });
        win.add(content);
        content.add(status);

        var val = classname.value;
        Cloud.Objects.query({
            classname: val
        }, function (e) {
            content.remove(status);
            button.show();

            if (e.success) {
                var objects = e[val];
                if (!objects.length) {
                    alert('No objects found!');
                }
                else {
                    for (var i = 0; i < objects.length; i++) {
                        (function (i) {
                            var wrapper = Ti.UI.createView({
                                layout: 'vertical', height: 50 + Utils.u,
                                top: 5 + Utils.u, right: 5 + Utils.u, bottom: 5 + Utils.u, left: 5 + Utils.u,
                                borderColor: '#ccc', borderWeight: 1
                            });
                            var idLabel = Ti.UI.createLabel({
                                text: 'id: ' + objects[i].id,
                                height: 'auto', left: 20 + Utils.u, right: 20 + Utils.u,
                                color: 'black'
                            });
                            var infoLabel = Ti.UI.createLabel({
                                text: 'Click to update',
                                height: 'auto', left: 20 + Utils.u, right: 20 + Utils.u,
                                color: 'gray'
                            });
                            wrapper.add(idLabel);
                            wrapper.add(infoLabel);
                            wrapper.addEventListener('click', function () {
                                WindowManager.handleOpenWindow({ target: 'Update Object', id: objects[i].id, classname: val });
                            });
                            content.add(wrapper);
                        })(i);
                    }
                }
            }
            else {
                Utils.error(e);
            }
        });
    }

    button.addEventListener('click', submitForm);
    classname.addEventListener('return', submitForm);

    win.addEventListener('open', function () {
        classname.focus();
    });
    return win;
};