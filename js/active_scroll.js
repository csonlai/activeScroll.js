!function(window ,$){

	'use strict';

	$.fn.activeScroll = function(opt){

		opt = opt || {};

		var _self = this;
		//所有页对象
		var pages = [];
		//可视区域起始页的索引
		var startIndex;
		//可视区域尾页的索引
		var endIndex;
		//当前最靠近窗口的页
		var midIndex = 0;

		//用于高度计算
		var _currentHeight = 0;

		//可视区域起始页
		var startPage;
		//可视区域尾页
		var endPage;

		//滚动过程中监测时间间隔
		var scrollDetectDuration = 1000;
		//滚动结束触发监测的时间间隔
		var scrollEndDuration = 200;
		//上一次间隔监测的时间
		var lastDetectTime = Date.now();

		//上下占位元素
		var topPlaceholder;
		//下占位元素
		var bottomPlaceHolder;


		//上下缓冲页的个数
		var bufferCount = 2;
		//是否加载中
		var isLoading = false;
		//滚动timeid
		var _scrollTimeId;
		//滚动元素
		var scrollElement = $(opt.scrollElement || window);

		//上一次滚动高度
		var lastScrollY = scrollElement.scrollTop();

		//获取某页和窗口距离差
		function getDy(page){

			var currentPage;
			var currentTop;
			var currentMid;	
			var pageTop;
			var pageMid;

			//当前滚动窗口的middle值
			var winMid = scrollElement.scrollTop() + window.innerHeight / 2;	

			pageTop = Number(page.data('top'));
			pageMid = pageTop + page.height() / 2;

			return pageMid - winMid;

		};

		//当前中间页索引(中线最靠近窗口的页)
		function findMiddlePageIndex(dir){
			var dy;
			var preDy;

			if(dir == 'down'){

				for(var i = midIndex , l = pages.length ; i < l ;  i++){

					dy = getDy(pages[i]);

					if(dy > 0){
						if(preDy && -preDy < dy){
							return i - 1;
						}
						return i;
					}
					preDy = dy;
				}

				return l - 1;
			}
			else if(dir == 'up'){
				console.log('up');

				for(var i = midIndex ; i >= 0 ; i--){

					dy = getDy(pages[i]);

					if(dy < 0){
						if(preDy && preDy < -dy){
							return i + 1;
						}
						return i;
					}
					preDy = dy;
				}

				return 0;
			}
		};

		//监测滚动
		function checkScroll(dir){

			var _leaveHeight = 0;
			var _currentMidIndex;
			var _currentStartIndex;
			var _currentEndIndex;

			var _currentStartTop;

			//最近窗口的中间页索引
			_currentMidIndex = findMiddlePageIndex(dir);

			_currentStartIndex = Math.max(_currentMidIndex - bufferCount , 0);
			_currentEndIndex = Math.min(_currentMidIndex + bufferCount , pages.length - 1);


			//最近窗口的中间页没有变化
			if(_currentStartIndex == startIndex && _currentEndIndex == endIndex){
				return;
			}
			else{

				//删除旧的页元素
				for(var i = startIndex ; i <= endIndex ; i ++){
					pages[i].remove();
				}

				_currentStartTop = Number(pages[_currentStartIndex].data('top'));

				//更新顶部placeholder的占位高度
				topPlaceholder.css('height' , _currentStartTop + 'px');

				//增加下方新的页元素
				for(var i = _currentStartIndex ; i <= _currentEndIndex ; i ++){
					pages[i].appendTo(_self);
				}

				for(var i = _currentEndIndex + 1 ; i < pages.length; i++){
					_leaveHeight += Number(pages[i].data('height'));
				}

				if(!bottomPlaceHolder){
					bottomPlaceHolder = $('<div></div>');
				}

				bottomPlaceHolder.css('height' , _leaveHeight + 'px');


				//底部占位元素放到最后
				bottomPlaceHolder.appendTo(_self);
				//更新startIndex endIndex midindex
				startIndex = _currentStartIndex;
				endIndex = _currentEndIndex;
				midIndex = _currentMidIndex;

			}
		
		};


		//构造函数
		function ActiveScroll(){
			this.init();
		};

		//增加列表项
		ActiveScroll.prototype.addItems = function(newlistItems){
			//新增列表项
			if(typeof newlistItems == 'string'){
				newlistItems = $(newlistItems);
			}
		
			//当前页
			var currentPage;

			//新的分页
			var newPage = $('<div></div>');
			//用于清除浮动
			var clearfix = $('<div></div>');
			clearfix.css({
				clear:'both'
			});

			newlistItems.appendTo(newPage);

			clearfix.appendTo(newPage);

			//增加到页数组
			pages.push(newPage);

			if(!topPlaceholder){
				topPlaceholder = $('<div></div>');
				topPlaceholder.prependTo(_self);
			}

			//起始页索引
			startIndex = startIndex || 0;
			//尾页索引

			//起始页
			startPage = pages[startIndex];

			//把新增元素添加到列表
			newPage.appendTo(_self);
			//记录新增页的top值
			newPage.data('top' ,_currentHeight);

			//记录每页高度
			newPage.data('height',newPage.height());

			//记录页索引值
			newPage.data('index',pages.length - 1);

			//test
			newPage.attr('data-index',pages.length - 1);



			_currentHeight += newPage.height();

			newPage.remove();


			checkScroll('down');
		};

		//初始化
		ActiveScroll.prototype.init = function(){
			var _this = this;
			//滚动事件处理
			scrollElement.on('scroll',function(){
				//滚的方向
				var dir = scrollElement.scrollTop() > lastScrollY ? 'down' : 'up';

				clearTimeout(_scrollTimeId);

				//滚动停止则触发
				_scrollTimeId = setTimeout(function(){
					checkScroll(dir);
				},200);

				//滚动过程中间隔触发
				if(scrollDetectDuration < Date.now() - lastDetectTime){
					checkScroll(dir);
					lastDetectTime = Date.now();			
				}
				//保存上一次滚动值
				lastScrollY = scrollElement.scrollTop();



			});
		};


		return new ActiveScroll();
	};

}(window ,$);


