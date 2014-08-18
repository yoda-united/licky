var args = arguments[0] || {};

if(args.iconFont){
	$.iconLabel.font = args.iconFont;
}

if(args.iconText){
	$.iconLabel.text = args.iconText;
}

if(args.labelFont){
	$.textLabel.font = args.labelFont;
}

if(args.labelText){
	$.textLabel.text = args.labelText;
}