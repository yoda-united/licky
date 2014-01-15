var photoCol = Alloy.createCollection('photo');

$.photoListViewC.setCollection(photoCol);
$.photoListViewC.setTemplateControls([
	'photoItemTemplate'
]);

$.photoListViewC.on('itemclick',function(e){
	if(e.model){
		AG.utils.openController(AG.mainTabGroup.activeTab,
			'photoDetail',
			{
				photoModel : e.model //clicked Model
			}
		);
	}
});

photoCol.fetch();
