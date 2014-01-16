var args = arguments[0] || {};

//init UI defaults
$.loadingActivity.show();

var sectionId = 1;
(function(){
	//private properties : exports 함수에서만 사용하는 변수
	var _collection;
	
	// public function (exports)
	_.extend(exports,{
		getCollection : function(){
			return _collection;
		},
		setCollection : function(newCol){
			//기존에 걸려있던 이벤트 삭제
			if(_collection){
				_collection.off('reset change',handlers.reset);
				_collection.off('add',handlers.collection.add);
			}
			
			// SET!
			_collection = newCol;
			
			//각종 event 걸기 
			newCol.on('reset change',handlers.collection.reset);
			newCol.on('add',handlers.collection.add);
			
			$.section.setItems([]);
		},
		/**
		  * 주의!!!!!!! CREATION-ONLY
		  * 이 함수는 window가 열린다음엔 설정 되지 않는다.
		  * 한번만 세팅 가능  
		  */
		setTemplateControls : function(controls){
			var itemTemplate = {};
			_.each(controls,function(controlName){
				Alloy.createController(controlName,{
					__itemTemplate : itemTemplate
				});
			});
			$.listView.templates = itemTemplate;
		}
	});
})();


var handlers = (function(){
	var willAddItems = [];
	return {
		collection :{
			'reset' : function(col, option){
				var items = [];
				$.getCollection().each(function(model){
					var item = model.doDefaultTransform();
					items.push(item);
				});
				
				$.section.setItems(items, {
					animationStyle : Ti.UI.iPhone.RowAnimationStyle.NONE
				}); 
				
				$.listView.footerView = $.loadingFooterView;
				updateListMarker(col);
			},
			'add' : function(model,col,options){
				if(options && options.addLater){
					willAddItems.push(model.doDefaultTransform());
				}else{
					$.section.insertItemsAt(0,[model.doDefaultTransform()],{
						
					});
				}
			}
		},
		
		
		listView : {
			'marker' : function(e) {
				Ti.API.info('marker fired');
				//fetch next page
				$.getCollection().fetch({
					data : _.extend({
						per_page : $.getCollection().meta.per_page,
						page : $.getCollection().meta.page+1
					},$.defaultFetchData),
					add : true,
					addLater : true,
					success : function(col){
						//flush stack
						$.section.appendItems(willAddItems,{
							animated : false,
							animationStyle : Ti.UI.iPhone.RowAnimationStyle.NONE
						});
						willAddItems = [];
						updateListMarker(col);
					}
				});
			},
			'itemclick' : function(e) {
				if(e.itemId){
					$.trigger('itemclick',_.extend(e,{
						model :  $.getCollection().get(e.itemId)
					}));
				}
			},
			'delete' : function(e) {
				var item = $.getCollection().get(e.itemId);
				item.destroy({
					success: function(){
						
					},
					error : function(){
						alert('정상적으로 삭제하지 못했습니다. 새로고침 후 다시 시도해주세요.');
					}
				});
			}
		}
	};
		 
})();


/**
 * listView events
 */
$.listView.addEventListener('marker', handlers.listView.marker);
$.listView.addEventListener('itemclick', handlers.listView.itemclick);
$.listView.addEventListener('delete', handlers.listView['delete']);


/**
 * 다음페이지를 더 불러올지를 판단하여 listView의 marker를 지정한다.
 * 다 불러왔을 때는 다 불러왔음을 표시하는 item 을 맨 하단에 추가한다.
 * @param {Object} col
 * @param {Object} itemIndex
 */
function updateListMarker(col,itemIndex){
	if(col.meta && col.meta.total_pages>col.meta.page){
		$.listView.setMarker({
			sectionIndex:sectionId,
			itemIndex : $.section.items.length-1
		});
	}else{
		//끝까지 로딩 한경우
		$.listView.footerView = Ti.UI.createLabel({
			height : 0
			// text : '-'
		});
	}
}

if(OS_IOS){
	var control = Ti.UI.createRefreshControl({
	    tintColor: args.refreshControlTintColor || 'black'
	});
	$.listView.refreshControl=control;
	control.addEventListener('refreshstart',function(e){
	    Ti.API.info('refreshstart');
	    $.getCollection().fetch({
			success : function(col){
				control.endRefreshing();
			},
			error : function(){
				control.endRefreshing();
			},
			reset : true
		});
	});
}