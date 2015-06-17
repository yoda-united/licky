var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Update Event'] = function (evt) {
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });
    var content = Ti.UI.createScrollView({
        top: 0,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    win.add(content);

    var name = Ti.UI.createTextField({
        hintText: 'Name',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
    });
    content.add(name);

    var date = Ti.UI.createTextField({
        hintText: 'Date',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
    });
    content.add(date);

    var time = Ti.UI.createTextField({
        hintText: 'Time',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
    });
    content.add(time);

    var duration = Ti.UI.createTextField({
        hintText: 'Duration (seconds)',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	    keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD
    });
    content.add(duration);

	var recurring = Ti.UI.createTextField({
		hintText: 'Recurring',
		top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
		height: 40 + Utils.u,
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE
	});
	content.add(recurring);

    var recurringCount = Ti.UI.createTextField({
        hintText: 'Recurring Count (0-1000)',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD
    });
    content.add(recurringCount);

    var button = Ti.UI.createButton({
        title: 'Update',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
        height: 40 + Utils.u
    });
    content.add(button);


    function submitForm() {
        button.hide();
	    var data = {
		    event_id: evt.id,
		    name: name.value
	    };
	    var value;
		value = Date.parse(date.value + ' ' + time.value);
	    if (isNaN(value)) {
		    alert("Please enter a valid date/time");
		    date.focus();
		    return;
	    }
		data.start_time = new Date(value);
	    value = parseInt(duration.value, 10);
	    if (!isNaN(value)) {
		    data.duration = value;
	    }
	    if (recurring.value.length > 0) {
		    data.recurring = recurring.value.toLowerCase();
		    var validValues = { daily:1, weekly:1, monthly:1, yearly:1};
		    if (!validValues[data.recurring]) {
			    alert("Enter 'daily', 'weekly', 'monthly', or 'yearly'");
			    recurring.focus();
			    return;
		    }
	    }
		value = parseInt(recurringCount.value, 10);
	    if (!isNaN(value)) {
		    data.recurring_count = value;
	    }

        Cloud.Events.update(data, function (e) {
            if (e.success) {
                alert('Updated!');
            } else {
                Utils.error(e);
            }
            button.show();
        });
    }

    button.addEventListener('click', submitForm);
    var fields = [ name, date, time, duration, recurring, recurringCount ];
    for (var i = 0; i < fields.length; i++) {
        fields[i].addEventListener('return', submitForm);
    }

	var status = Ti.UI.createLabel({
		text: 'Loading, please wait...', textAlign: 'center',
		top: 0, right: 0, bottom: 0, left: 0,
		backgroundColor: '#fff', zIndex: 2
	});
    win.add(status);

	 win.addEventListener('open', function () {
	     Cloud.Events.show({
	         event_id: evt.id
	     }, function (e) {
	         status.hide();
	         if (e.success) {
	             var event = e.events[0];
		         var datetime = Utils.convertISOToDate(event.start_time);
	             name.value = event.name;
		         date.value = datetime.toLocaleDateString();
		         time.value = datetime.toLocaleTimeString();
		         if (event.duration) {
			         duration.value = event.duration.toString();
		         }
	             recurring.value = event.recurring || "";
		         if (event.recurring_count) {
		            recurringCount.value = event.recurring_count.toString();
		         }
	             name.focus();
	         } else {
	             Utils.error(e);
	         }
	     });
	 });
    return win;
};