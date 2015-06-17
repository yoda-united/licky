// Find out if this is iOS # or greater
function isIOSVersionPlus(versionNumber) {
    if (Titanium.Platform.name == 'iPhone OS') {
        var version = Titanium.Platform.version.split(".");
        var major = parseInt(version[0],10);
        // can only test this support on a 3.2+ device
        if (major >= versionNumber) {
            return true;
        }
    }
    return false;

}

exports.IOS7 = isIOSVersionPlus(7);
exports.IOS8 = isIOSVersionPlus(8);
exports.top = exports.IOS7 ? 20 : 0;
exports.android = Ti.Platform.osname == 'android';
exports.iOS = Ti.Platform.osname == 'ipad' || Ti.Platform.osname == 'iphone';
exports.blackberry = Ti.Platform.osname == 'blackberry';

var u = Ti.Android != undefined ? 'dp' : 0;
exports.u = u;

exports.createRows = function(rows) {
    for (var i = 0, l = rows.length; i < l; i++) {
        rows[i] = {
            title: rows[i],
            hasChild: true
        };
        if(exports.android) {
            rows[i].backgroundColor = '#fff';
            rows[i].height = 44 + u;
            rows[i].font = { fontSize: 20 + u };
        }
    }
    return rows;
}

exports.enumerateProperties = function(container, obj, offset) {
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
            exports.enumerateProperties(container, obj[key], offset + 20);
        }
    }
}

exports.error = function(e) {
    var msg = (e.error && e.message) || JSON.stringify(e);
    if (e.code) {
        alert(msg);
    } else {
        Ti.API.error(msg);
    }
}

exports.convertISOToDate = function(isoDate) {
    isoDate = isoDate.replace(/\D/g," ");
    var dtcomps = isoDate.split(" ");
    dtcomps[1]--;
    return new Date(Date.UTC(dtcomps[0],dtcomps[1],dtcomps[2],dtcomps[3],dtcomps[4],dtcomps[5]));
}

exports.pushToken = null;
exports.pushNotificationsEnabled = null;
exports.pushDeviceToken = null;