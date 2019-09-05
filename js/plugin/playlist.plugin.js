//! Copyright 2018 Digitberry Ltd. 
//! Build time: 2018/4/13 10:54:00
function PlaylistPlugin(apiFunctions) {
	play2VR.Plugin.call(this, apiFunctions);
	this.orientationMobile='vertical';
	this.containerStyle=this.container.getBoundingClientRect();
	this.isOpenList=false;
	this.list = [];
	this.mediaIndex = 0;
	this.isLoaded=false;
	this.htmlText = [
		'<div class="playlist-button"><i></i></div>',
		'<div class="playlist-wrap">',
		'	<div class="playlist-title">播放列表<i></i></div>',
		'	<div class="playlist-container">',
		'	</div>',
		'</div>'
	].join("\n");
	this.htmlTextMobile=[
		'<div class="playlist-button"><i></i></div>',
		'<div class="playlist-wrap">',
			'<div class="playlist-container">',
			'</div>',
		'</div>'
	].join("\n");
	this.cssText = [
		"*{margin:0;padding:0;}",
		".clearfix:after{display: block; content: ''; clear: both; width: 100%;}",
		".playlist-button{ cursor:pointer;width:20px;position: absolute;right: 0; top: 0;opacity:0.5; background:#3B3F51; z-index: 200000;pointer-events: auto;}",
		".playlist-button i{display:block;position:absolute;width:10px;height:10px;left:0;right:0;top:0;bottom:0;margin:auto;background-size:10px 10px;background-repeat:no-repeat;background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAjVBMVEUAAADCzt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt6YvhWxAAAALnRSTlMAAQIDBAUGCgsNFRYeHyAiIyQmKywtLjIzbXh/kZSmra+8vsDOz9Ho6e3x9fn94wCrQgAAALxJREFUSMft1NcSgjAQheGl2FCwN8QC2IF9/8ezgWOyspnxyqDn8s98yV0AylYjxTCBm7lCX0rOMelzYo2ICyG1z4jZgBeiuYmr6fEC0ZUE4kkhspYsMFSIIRHbejXETiFG1RD4u2JMxP6bhMMLmBNhHHgBfn6edp6keCSy3hMrJsZLi8+hxNiamkhr4/7NR8YjJtbaNIjZgMJ0QTYJ8CZ4SbmZAGuWQrqbKZTPDjEwxOQl2QzYNek1j5/wArO8kgMs6TZWAAAAAElFTkSuQmCC');}",
		".playlist-wrap{transition:all 0.5s; width: 200px;background:#4e5265;position: absolute; right:-200px;top:0; pointer-events:auto; z-index: 250000;}",
		".playlist-wrap.on{right:0;}",
		".playlist-title{ position: relative; height: 35px; background:#3B3F51; color: #FFFFFF; font-size: 14px; line-height: 35px; text-align: center;}",
		".playlist-title i{position: absolute;width: 35px; height: 35px; left:0; top:0;background-position: center;background-size: 15px 15px; background-repeat: no-repeat; cursor: pointer;z-index:300000;display: block; background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAkFBMVEUAAADCzt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt6GiHIPAAAAL3RSTlMAAQMEBQYICxQVFhcYICMqOEFbXl9hYmRma2xtc3R1d3x/iJW3wMfM0dPV1/Hz+XwD7jYAAAC2SURBVEjH7cvXDoJQEIThQZqIvWAXG9id9387L0Qj58AaE2OLc/nvfgAAmNCWkW7X5VL5sCI2JTEgGaWMFZMM8sWQVIwZk5LxSNX0kpRnnKNmGrxjKroZ/5iZ/M3fAAg/zxQeN3NopppNivvkvrim1oXUZLG2NRFmCu9bRPv9ovQKcdBERxb+74rg2aL8AmHroi4L+JpAXxbATBWwt7I4m1sBODtZAFOu7HRxNhxBnGuoxXBzn0+YBZVtG5JGCwAAAABJRU5ErkJggg==');}",
		".playlist-container{overflow-y: auto;}",
		".playlist-container::-webkit-scrollbar{ width: 8px;}",
		".playlist-container::-webkit-scrollbar-thumb  {border-radius: 8px;background-color: #3B3F51;}",  
		".playlist-container ul li{ font-size: 14px; padding:10px; cursor: pointer; list-style: none;}",
		".playlist-container ul li p{overflow: hidden;text-overflow: ellipsis;white-space: nowrap; color:#FFFFFF;}",
		".playlist-container ul li:hover p{color:#36c6d3;}",
		".playlist-container ul li.active{background:#676b80;}",
		".playlist-container ul li.active p{color:#36c6d3;}",
		".playlist-container ul li img{ width: 100%; margin-bottom: 5px;}",
	].join("\n");
	this.cssTextMobile=[
		"*{margin:0;padding:0;}",
		".clearfix:after{display: block; content: ''; clear: both; width: 100%;}",
		".playlist-vertical .playlist-button{width:1.067rem;height:1.067rem;position: absolute; right:0; bottom:2.453rem;background:#3B3F51; z-index: 200000; opacity: 0.5;pointer-events:auto;}",
		".playlist-vertical .playlist-button.on{ opacity: 1;}",
		".playlist-vertical .playlist-button i{display:block; width: 0.5rem; height:0.5rem; position: absolute; left: 0;right: 0;top: 0; bottom: 0; margin: auto; background-size: 0.5rem 0.5rem; background-position: center; background-repeat: no-repeat;background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAA8FBMVEUAAADCzt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7x0Rf4AAAAT3RSTlMAAQIDBAUHCAkKDA4PFRYXGBkbHB4jJCUmKCwvMjQ+QEVGS05XW11iZGZoa2xvcXN0dXx+g4mOkZKVmJqdq7CytLW6vMXKzuTo6evt7/f9PV0DVgAAANxJREFUGBntwVdawlAUhdH/kit2xYoaC/aCJTawgh0UZc9/Nh4dwfElnw9Zi0Ie0tNsETNx1nRobAU2ZZaBd/nUeJO5gSinY7oyLYhyyriSOYAgp13K99JdBOpy6YwBIfArRA8K+aju783yJzWZJWC9K4f+4yCvMtcQ5LTDh0wbopwybmWOIMrphOFnqTUAfMpnA0gSflTOmw6N7UDhnypVJkuYMD3vMDcCUz2pMwq05bNAW+YCSnKq05N5gCinjCeZS0jkdEi1L32NAy/ySWEoTcuYuLLmsDpDIQffiJvs2InYl5cAAAAASUVORK5CYII=');}",
		".playlist-vertical .playlist-wrap{transition:all 0.5s;width:100%; height: 2.453rem; position: absolute; left: 0; bottom:-2.453rem;background:#4e5265;pointer-events:auto; z-index: 250000;}",
		".playlist-vertical .playlist-wrap.on{bottom:0;}",
		".playlist-vertical .playlist-container{ width: 100%;height: 2.453rem; overflow-x: auto; overflow-y: hidden;-webkit-overflow-scrolling: touch;}",
		".playlist-vertical .playlist-container ul{white-space: nowrap;}", 
		".playlist-vertical .playlist-container ul li{ padding: 0.1333rem; width: 2.844rem; float: left;}",
		".playlist-vertical .playlist-container ul li img{height: 1.6rem;}",
		".playlist-container ul li p{font-size: 12px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap; color:#FFFFFF;}",
		".playlist-container ul li.active{background:#676b80;}",
		".playlist-container ul li.active p{color:#36c6d3;}",
		".playlist-container::-webkit-scrollbar{ width: 0.133rem;}",
		".playlist-container::-webkit-scrollbar-thumb{border-radius: 0.133rem;background-color: #3B3F51;}",  
		".playlist-horizontal .playlist-button{transition:all 0.5s; width:0.7rem;height:0.7rem;position: absolute; right: 0; top:1rem;background:#3B3F51; z-index: 200000; opacity: 0.5;pointer-events:auto;}",
		".playlist-horizontal .playlist-button.on{opacity: 1;right:3.333rem;}",
		".playlist-horizontal .playlist-button i{display:block; width: 0.3rem; height:0.3rem; position: absolute; left: 0;right: 0;top: 0; bottom: 0; margin: auto; background-size: 0.3rem 0.3rem; background-position: center; background-repeat: no-repeat;background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAA8FBMVEUAAADCzt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7Czt7x0Rf4AAAAT3RSTlMAAQIDBAUHCAkKDA4PFRYXGBkbHB4jJCUmKCwvMjQ+QEVGS05XW11iZGZoa2xvcXN0dXx+g4mOkZKVmJqdq7CytLW6vMXKzuTo6evt7/f9PV0DVgAAANxJREFUGBntwVdawlAUhdH/kit2xYoaC/aCJTawgh0UZc9/Nh4dwfElnw9Zi0Ie0tNsETNx1nRobAU2ZZaBd/nUeJO5gSinY7oyLYhyyriSOYAgp13K99JdBOpy6YwBIfArRA8K+aju783yJzWZJWC9K4f+4yCvMtcQ5LTDh0wbopwybmWOIMrphOFnqTUAfMpnA0gSflTOmw6N7UDhnypVJkuYMD3vMDcCUz2pMwq05bNAW+YCSnKq05N5gCinjCeZS0jkdEi1L32NAy/ySWEoTcuYuLLmsDpDIQffiJvs2InYl5cAAAAASUVORK5CYII=');}",
		".playlist-horizontal .playlist-wrap{transition:all 0.5s;background:#4e5265;width: 3.333rem; height: 100%; position: absolute; top: 0; right: -3.333rem; pointer-events:auto; z-index: 250000;}",
		".playlist-horizontal .playlist-wrap.on{right:0;}",
		".playlist-horizontal .playlist-container{width:100%; height: 100%; overflow-y: auto;-webkit-overflow-scrolling: touch;}",
		".playlist-horizontal .playlist-container ul li{ padding: 0.133rem;}",
		".playlist-horizontal .playlist-container ul li img{ width:100%;}"
	].join("\n");
	this.initCSS=[
		"html{color:#000;background:#fff;overflow-y:scroll;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}",
		"html *{outline:0;-webkit-text-size-adjust:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}",
		"html,body{font-family:sans-serif}",
		"body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,code,form,fieldset,legend,input,textarea,p,blockquote,th,td,hr,button,article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{margin:0;padding:0}",
		"input,select,textarea{font-size:100%}",
		"table{border-collapse:collapse;border-spacing:0}",
		"fieldset,img{border:0}",
		"abbr,acronym{border:0;font-variant:normal}",
		"del{text-decoration:line-through}",
		"address,caption,cite,code,dfn,em,th,var{font-style:normal;font-weight:500}",
		"ol,ul{list-style:none}",
		"caption,th{text-align:left}",
		"h1,h2,h3,h4,h5,h6{font-size:100%;font-weight:500}",
		"q:before,q:after{content:''}",
		"sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}",
		"sup{top:-.5em}",
		"sub{bottom:-.25em}",
		"a:hover{text-decoration:underline}",
		"ins,a{text-decoration:none}",
	].join("\n");
}

PlaylistPlugin.prototype = Object.create(play2VR.Plugin.prototype);

PlaylistPlugin.prototype.init = function(options) {
	console.log('PlaylistPlugin init')
	var _this = this;
	var dContainer = document.querySelector('#play2vr-playlist');
	
	if(!dContainer){
		if(this.mobilecheck()){
			this.addCSS(this.initCSS,'play2VRinit');
			this.flexible();
			this.addCSS(this.cssTextMobile,'play2VRplaylist');
			this.addHTML(this.htmlTextMobile);
		}else{
			this.addCSS(this.cssText,'play2VRplaylist');
			this.addHTML(this.htmlText);
		}
		if(this.mobilecheck()){
			play2VR.toggleFullscreen(true);
			document.querySelector('.playskin-btn-fullscreen').setAttribute('data-state','fulloff');
		}
	}
}

PlaylistPlugin.prototype.addAttr = function(ele, props) {
	if(typeof ele == 'string') ele = document.querySelector(ele);
	if(ele) {
		for(var p in props)
			if(props.hasOwnProperty(p)) ele.setAttribute(p, props[p]);
	}
}

PlaylistPlugin.prototype.addHTML = function(htmlText) {
	var _html = document.createElement('div');
	if(this.mobilecheck()){
		_html.style.cssText='width: 100%;height:100%; position: absolute;left: 0; top: 0; z-index: 100000; pointer-events: none;overflow:hidden;'
		this.addAttr(_html, {id: 'play2vr-playlist','class':'playlist-vertical'});
		_html.innerHTML = htmlText;
		document.body.appendChild(_html);
	}else{
		_html.style.cssText = 'width:' + this.containerStyle.width + 'px;height:' + this.containerStyle.height + 'px;position:absolute;left:' + this.containerStyle.left + 'px;top:' + this.containerStyle.top + 'px;z-index:100000;pointer-events:none;overflow:hidden;';
		this.addAttr(_html, {id: 'play2vr-playlist'});
		_html.innerHTML = htmlText;
		document.body.appendChild(_html);
		document.querySelector('.playlist-button').style.height = this.containerStyle.height+'px';
		document.querySelector('.playlist-container').style.height = (this.containerStyle.height-35)+'px';
	}
	this.addEvent();
}

PlaylistPlugin.prototype.addCSS = function(cssText,id) {
	var _style = document.createElement('style');
	_style.type = 'text/css';
	_style.id = id;
	if(_style.styleSheet) _style.styleSheet.cssText = cssText;
	else _style.innerHTML = cssText;
	var getStyle = document.getElementById(id);
	if(getStyle) getStyle.parentNode.removeChild(getStyle);
	document.getElementsByTagName("head")[0].appendChild(_style);
}

PlaylistPlugin.prototype.addEvent=function(){
	var _this=this;
	var _isTouchDevice = ('ontouchstart' in document.documentElement) ? true :false;
	var dContainer = document.querySelector('#play2vr-playlist');
	var dBtnOpen=document.querySelector('.playlist-button');
	var dWrap=document.querySelector('.playlist-wrap');
	var dList = document.querySelectorAll('.playlist-container ul li');
	
	if(this.mobilecheck()){
		dBtnOpen.addEventListener('touchend',function(){
			if(_this.isOpenList){
				dBtnOpen.className='playlist-button';
				dWrap.className='playlist-wrap';
			}else{
				dBtnOpen.className+=' on';
				dWrap.className+=' on';
			}
			_this.isOpenList=!_this.isOpenList;
		},false);
		
		window.addEventListener('orientationchange',function(){
			if(window.orientation==0){
				dContainer.classList='playlist-vertical';
				dContainer.querySelector('ul').style.width=_this.list.length*3.12+'rem';
				_this.orientationMobile='vertical';
			} else{
				dContainer.classList='playlist-horizontal';
				dContainer.querySelector('ul').style.width='100%';
				_this.orientationMobile='horizontal';
			} 
		});
		
	}else{
		var btnClose=document.querySelector('.playlist-title i');
		if(_isTouchDevice){
			dBtnOpen.addEventListener('touchend',function(){dWrap.className+=' on';_this.isOpenList=true;},false);
			btnClose.addEventListener('touchend',function(){_this.isOpenList=false;dWrap.className ='playlist-wrap';},false);
		}else{
			dBtnOpen.onmouseenter=function(){dWrap.className+=' on';_this.isOpenList=true;}
			btnClose.onclick=function(){_this.isOpenList=false;dWrap.className ='playlist-wrap';}
			dWrap.onmouseleave=function(){if(_this.isOpenList){_this.isOpenList=false;dWrap.className ='playlist-wrap';} }
		}
		play2VR.on('toggleFullscreen',function(e){_this.changeStyle.apply(_this,[e]);});
	}
	play2VR.getMedia().addEventListener('ended', function() {_this.switchMedia.apply(_this);}, false);
}

PlaylistPlugin.prototype.addMediaList = function(list) {
	if(!this.isLoaded){
		this.list = list;
		var _html = '';
		var _ul = document.createElement('ul');
		var dContainer=document.querySelector('.playlist-container');
		for(var key in list) {
			if(key == 0) _html +='<li class="active" title="'+list[key]['title']+'"><img src="http://v2.play2vr.com/poster/'+list[key]['key']+'-poster.png"><p>'+list[key]['title']+'</p></li>';
			else _html +='<li title="'+list[key]['title']+'"><img src="http://v2.play2vr.com/poster/'+list[key]['key']+'-poster.png"><p>'+list[key]['title']+'</p></li>';
		}
		_ul.innerHTML = _html;
		dContainer.appendChild(_ul);
		if(this.mobilecheck()) dContainer.querySelector('ul').style.width=this.list.length*3.12+'rem';
		this.chooseMedia();
		this.isLoaded=true;
	}
	
}

PlaylistPlugin.prototype.chooseMedia = function() {
	var _this=this;
	var dList=document.querySelectorAll('.playlist-container ul li');
	var dBtnOpen=document.querySelector('.playlist-button');
	var dWrap=document.querySelector('.playlist-wrap');
	for(var i=0;i<dList.length;i++){
		dList[i].index=i;
		dList[i].onclick=function(){
			_this.mediaIndex=this.index;
			_this.isOpenList=false;
			dWrap.className ='playlist-wrap';
			if(_this.mobilecheck()) dBtnOpen.className='playlist-button';
			_this.resetMedia();
		}
	}
}

PlaylistPlugin.prototype.switchMedia = function() {
	var dWrap=document.querySelector('.playlist-wrap');
	var dContainer = document.querySelector('#play2vr-playlist');
	var dBtnOpen=document.querySelector('.playlist-button');
	var _this=this;
	if(dContainer) {
		this.mediaIndex++;
		if(this.mediaIndex == this.list.length) this.mediaIndex = 0;
		this.isOpenList=true;
		dWrap.className+=' on';
		if(this.mobilecheck()) dBtnOpen.className+=' on';
		this.resetMedia();
		setTimeout(function(){
			_this.isOpenList=false;
			dWrap.className ='playlist-wrap';
			if(_this.mobilecheck()) dBtnOpen.className ='playlist-button';
		},3000);
	}
}

PlaylistPlugin.prototype.changeStyle=function(e){
	var dBtnOpen=document.querySelector('.playlist-button');
	var objContainer=document.querySelector('.playlist-container');
	var dContainer=document.querySelector('#play2vr-playlist');
	if(e){
		dBtnOpen.style.height='100%';
		objContainer.style.height=(screen.height-35)+'px';
		dContainer.style.cssText='width:100%;height:100%;';
	}else{
		dBtnOpen.style.height=this.containerStyle.height+'px';
		objContainer.style.height=(this.containerStyle.height-35)+'px';
		dContainer.style.cssText='left:'+this.containerStyle.left+'px;top:'+this.containerStyle.top+'px;width:'+this.containerStyle.width+'px;height:'+this.containerStyle.height+'px;position:absolute;z-index:100000;pointer-events:none;overflow:hidden;';
	}
}

PlaylistPlugin.prototype.resetStyle=function(){
	var dList = document.querySelectorAll('.playlist-container ul li');
	for(var i = 0; i < dList.length; i++) {dList[i].className = '';}
	dList[this.mediaIndex].setAttribute('class', 'active');
}

PlaylistPlugin.prototype.resetMedia = function() {
	var _this = this;
	this.resetStyle();
	var dContainter=document.querySelector('.playlist-container');
	var dList = document.querySelectorAll('.playlist-container ul li');
	if(this.mobilecheck()){
		if(this.orientationMobile=='vertical') dContainter.scrollLeft=dList[this.mediaIndex].offsetLeft;
		else if(this.orientationMobile=='horizontal') dContainter.scrollTop=dList[this.mediaIndex].offsetTop;
	}else{
		dContainter.scrollTop=dList[this.mediaIndex].offsetTop-35;
	}
	play2VR.dispose();
	play2VR.init(play2VR.getDiv(true), this.list[this.mediaIndex]['key'],{noPoster: true});
	play2VR.on('canplay', function() {
		if(_this.mobilecheck()){
			play2VR.toggleFullscreen(true);
			document.querySelector('.playskin-btn-fullscreen').setAttribute('data-state','fulloff');
		}
		play2VR.getMedia().addEventListener('ended', function() {
			_this.switchMedia.apply(_this);
		}, false);
	});
	if(!this.mobilecheck()) play2VR.on('toggleFullscreen',function(e){_this.changeStyle.apply(_this,[e]);});

}

PlaylistPlugin.prototype.mobilecheck=function(){
	var check = false;
    (function (a) {
        if (/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))check = true
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

PlaylistPlugin.prototype.flexible = function() {
	(function(win, lib) {
		var doc = win.document;
		var docEl = doc.documentElement;
		var metaEl = doc.querySelector('meta[name="viewport"]');
		var flexibleEl = doc.querySelector('meta[name="flexible"]');
		var dpr = 0;
		var scale = 0;
		var tid;
		var flexible = lib.flexible || (lib.flexible = {});

		if(metaEl) {
			console.warn('将根据已有的meta标签来设置缩放比例');
			var match = metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/);
			if(match) {
				scale = parseFloat(match[1]);
				dpr = parseInt(1 / scale);
			}
		} else if(flexibleEl) {
			var content = flexibleEl.getAttribute('content');
			if(content) {
				var initialDpr = content.match(/initial\-dpr=([\d\.]+)/);
				var maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
				if(initialDpr) {
					dpr = parseFloat(initialDpr[1]);
					scale = parseFloat((1 / dpr).toFixed(2));
				}
				if(maximumDpr) {
					dpr = parseFloat(maximumDpr[1]);
					scale = parseFloat((1 / dpr).toFixed(2));
				}
			}
		}
		if(!dpr && !scale) {
			var isAndroid = win.navigator.appVersion.match(/android/gi);
			var isIPhone = win.navigator.appVersion.match(/iphone/gi);
			var devicePixelRatio = win.devicePixelRatio;
			if(isIPhone) {
				// iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
				if(devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
					dpr = 3;
				} else if(devicePixelRatio >= 2 && (!dpr || dpr >= 2)) {
					dpr = 2;
				} else {
					dpr = 1;
				}
			} else {
				// 其他设备下，仍旧使用1倍的方案
				dpr = 1;
			}
			scale = 1 / dpr;
		}
		docEl.setAttribute('data-dpr', dpr);
		if(!metaEl) {
			metaEl = doc.createElement('meta');
			metaEl.setAttribute('name', 'viewport');
			metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
			if(docEl.firstElementChild) {
				docEl.firstElementChild.appendChild(metaEl);
			} else {
				var wrap = doc.createElement('div');
				wrap.appendChild(metaEl);
				doc.write(wrap.innerHTML);
			}
		}

		function refreshRem() {
			var width = docEl.getBoundingClientRect().width;
			if(width / dpr > 540) {
				width = 540 * dpr;
			}
			var rem = width / 10;
			docEl.style.fontSize = rem + 'px';
			flexible.rem = win.rem = rem;
		}
		win.addEventListener('resize', function() {
			clearTimeout(tid);
			tid = setTimeout(refreshRem, 300);
		}, false);
		win.addEventListener('pageshow', function(e) {
			if(e.persisted) {
				clearTimeout(tid);
				tid = setTimeout(refreshRem, 300);
			}
		}, false);
		if(doc.readyState === 'complete') {
			doc.body.style.fontSize = 12 * dpr + 'px';
		} else {
			doc.addEventListener('DOMContentLoaded', function(e) {
				doc.body.style.fontSize = 12 * dpr + 'px';
			}, false);
		}

		refreshRem();
		flexible.dpr = win.dpr = dpr;
		flexible.refreshRem = refreshRem;
		flexible.rem2px = function(d) {
			var val = parseFloat(d) * this.rem;
			if(typeof d === 'string' && d.match(/rem$/)) {
				val += 'px';
			}
			return val;
		}
		flexible.px2rem = function(d) {
			var val = parseFloat(d) / this.rem;
			if(typeof d === 'string' && d.match(/px$/)) {
				val += 'rem';
			}
			return val;
		}
	})(window, window['lib'] || (window['lib'] = {}));
}

PlaylistPlugin.prototype.dispose = function() {
	console.log('PlaylistPlugin dispose');
	if(!this.mobilecheck()) this.changeStyle(false);
}

