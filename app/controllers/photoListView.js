var args = arguments[0] || {};
var photoList = Alloy.createController('photoList');

$.getView().add(photoList.listView);
photoList.afterWindowOpened();
