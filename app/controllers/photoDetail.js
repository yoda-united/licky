var args = arguments[0] || {},
	photoModel = args.photoModel;

var contentItem = photoModel.doDefaultTransform();
contentItem.template = 'photoItemTemplate';
contentItem.properties.height = 180;
$.contentSection.setItems([
	contentItem
]);