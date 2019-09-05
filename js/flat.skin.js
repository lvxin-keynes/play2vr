//! Copyright 2017 Digitberry Ltd. 
function flatSkin(options)
{
	this.video = options.video;
	this.api = options.api;
	
	var w = window.innerWidth, h = window.innerHeight;
	var skinColor = '#3a4246';
	var isTouchDevice = 'ontouchstart' in document.documentElement;
	var base64Arr = [
		'data:image/png;base64,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',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAOAQMAAAAsbR/oAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAA1JREFUCNdjcGggEgEA2uoKgaezfEoAAAAASUVORK5CYII=',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAOCAMAAAAhfX2ZAAAAM1BMVEUAAAD///////////////////////////////////////////////////////////////+3leKCAAAAEXRSTlMAtlMQBoI4qKCMcyUd92tqOjSMP90AAAA6SURBVAjXY0ACPAgmBysznM3GyM8C5zAxMsHZLFyMbHAOMyc7N5zDyoskClMrADcBZi4fC9w2TDcAAETaAPjMS6qPAAAAAElFTkSuQmCC',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAPBAMAAAD5dJlYAAAAD1BMVEUAAADMzMzMzMzMzMzMzMywq4YJAAAABHRSTlMAwEA/ZCOS4gAAAD1JREFUCNdjAANDEAFluiCYjioIpgILgskAZbsAmTC2AxDjYiPUG8DZDIpADpAN5wDZcI4JA4LjwoDEAZMAg64G36RkRZoAAAAASUVORK5CYII=',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAPBAMAAAD5dJlYAAAAD1BMVEUAAADMzMzMzMzMzMzMzMywq4YJAAAABHRSTlMAwEA/ZCOS4gAAAElJREFUCNd9zcEJgDAQRNE5pBAFC1CwgBW2/5rMfIYck8PwPoREnMcTtrfgd2F4DGmooOKeNOyS9ub+vaxzRt4hYuLNv46OCfYHEkgLg9xajagAAAAASUVORK5CYII=',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAApBAMAAACbyVdpAAAAMFBMVEUAAADMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMySLVSoAAAAD3RSTlMAd+7dMxGZiGaqzFUiu0Rs+2FiAAABkElEQVQ4y7XTTU7CQBgG4I+f8msi7k3KBRQ2Lk2JC1cmEN24MXoBQ5fs6A3sDeAEwg3kBiw8gN4AW0qBQn21M2Nnpq75Fp3OPM307XwpHbYmQXo7j4gIrM4GPWJlrlN+8RIWFXLvLlMeBQl7J7/1DJyztQI6Qg20E/5ik3vLZ+tlNATXYUumB/YwFTEWXEJHYcPasNHaC84vibMIGrJh6In5Yi2ZfSaPvhXzYaDxMUR0cQJWO8s8ukM8o62zL5ZdNuYw1XgRi02bbKj5pHHfE5F2PGkomW26Ih6dr5s7ja9gi+PweUOaKl8j1g7TwBNn1rF3sKlsRYUFl/1+pb9qJedR9Unh+JTS6gdJgpDku4dbkvXmJZeNwrf4lJyPki1WCufQllxKmmK5CtPEk1yHQ0U4Ki/8nvSWS2X0VK7CVqI3qbYllY8QKNF3NN9oTGasRF+TudL5DlMZfUkTV+cKLpToN3B0pg/5aQYGmGW4689SH11GlOESXPnrwsuy0fpO+RH7LJMZpVzF+B8X0KCD1g+xMOenbObXtQAAAABJRU5ErkJggg==',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAflBMVEUAAADMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMwonIReAAAAKXRSTlMA9wXcWy/trKdfYyQKG6QMqhDoIOPVZz4V8Tq4kilvz4hTmn91NrDFSU5fe8MAAAMZSURBVFjDrZjZtqIwEEUhBAhkIAgxzIgz//+DrXRfE7z9Qop6U9faEHedotRzKVQ1g1D1/L9yBp7HaEdgVmh86drAhwINEqGcTpf2AAbaxfWxIw8V+XsBWUVvz6tQYKBdSJ/GXYFe0wV7AjOaxNG8H5CFqRj9/YCIp/Gh3q9tsjAhViP6YCA9xpYQ3/dhwLy3fPhRMKoIBETh8R58bm8kpxMJIEBUJHH9Oe9B4Ju+PgBAFqak/Jw3IEmBsqf03YGF7aMUOGQeunVv5a4+pOWDYI6Wi7Svazj6iI2PgKQhWi6jT4ETkK18RBLT7O/7fGrnGe4jpZ87789R7eAjjcuVj+zzUXVRwWYfdn79g0y4/SkWZCuwt/slEIsPU3q4Os1T46NgK/1U660+ZPA5ryJp/33Bqto8T+389vnvx/WW8676pZQp92BF1z6SkIFwOV3lV77zCyiUN4M1T5Vc+gVQjGM7vwTTHLhxVLg1+ZVp4UGLNd3hk9/klV9wFVioevERJyAfpguns3r3C9iHET2Jcq7vmMLOa4WJ4q6NBwo8Ka+s3mkwbnJYPt4IzsxrDvRLh7jtsDklYsD9FN/rV99N+U5e/81TdZ562J2Zebr8BqmVwHyPTk5E+TOdu4bBs5ZKM09bXCEPOE8xMfO0jjFnQB9Hae1D96GBiUY8iaMd5yl7+zDzND5SoA+eytKfHefp72dz3uPVPrRxnlZV9msfIoG/3k+3lNYUrfdTLK19KMbFxvlyHfT3fhrYPvqtAojAKx+JtPYhkoSb+yVQl8rKLxbGRxm7PH/r6Gy+RJp++XDI2yv4E2c/89Tehxzz+7qTk86XjrR9zC8foec5Af32WPzNr7Tzm/Ru+V3G5w1959f4cAD68pmhIiHBKr/MHTg/rvpm+gW4Dy0C3j/w1coH8iDASI2B5UMmkHlq/iHZaZ6a/3BMfjMo0FR9iFPjAw70R2HnFw589QvNPDjQCOkaD1o2zx9PGnl73qES1+eNVmw3YKQepDtqDgbadWgvE80RQmCgUdN2F6yLDEGBpqLxPDTVjsBaCVfgH0VErBkKh5IQAAAAAElFTkSuQmCC',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAe1BMVEUAAADMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMxhygOPAAAAKHRSTlMAqPcD7futYAcL5qRcMGQdD9wk2j7yK2fVIRfguZLPN4hvVJp/dcVJDOcrsgAAAxJJREFUWMPtmMl2ozAQRTWDEDNiNIPHRP//hY3bIVKc3kBp2W9n+5x7JF+qUAn5iSxjUZtIXXM/vDBJcWGM6W5XLzyaBYKRFVh3yst+k0BF5pXIB7Bf90vMV+DbzcsYsw1HajgwaXFlthQC7Pfl4ysMxx58nL73W4i2BAKzFJ/qDRipIMn37C6k7z4a1wfDQUbRjgyDfAM2qw/+7QOnSYj2ROvyxwJk76zPMBH3Eu3K46J/1+9XeCXaZq8ArGLq+ghwZH3goNndaKruPnx/WH2o6NtHJNIM7U7NbvZPLFNckQ14Wn3I/UBjxuvw8vijfvnqI5PoCLA463zzYev36YOiQ0AyttmrfrFbv6uPg0ATTQt9q9+TSPu9JAsk+FPSPsCF9aGCRB4Hmo+HXtznhYkgCxEAWODzGXfc8bHWLwTIurlihFsfZU5BQE6IgfdTF8i5ceo3yYFAG14/65cib0AyK7efwoFMBLafwoGcF9OCkEcgmc869Ars1ONz6Qfpbcus+8BTqwcw0KVG4/1a5mFIoUCLrMbpHuteUijQhs23yzKE/oB1py56Bf7PK+GgL6qrzb9yELhcbjPzB6Sy1/F9GisOBVpkGObl9T5GHA60GXQ74Y+OcV9AOfTL50N1xCWChevz7BWI9FTAt+zO04Fgxg14nlYz8QekWSqimnsD5kmAI6fbcyiwbEXhnGAIDEhzxwcnrJo7BgKGSSvsfDQ/j4N/P0Lm6ZrYeTVe9OMDAJRJan2QAgc9zT8xOQ7sW3FyzuNxI1G4TNFBIM2b4Mc8Hf89/2XtSA4Cm1Y489E2T+f6fDoElE8f3LnfKOXX99fRmGM+7Hy0rq/cFk6bG6v3A5/16z4vdp6mw72rQD7qCAeZ+2us8BEf9n5DBT/P4/ry2MeTvdtPGX6bp2mp9Q7ar/sNnDa/XlvDoftJ64P+el0f7af1CacZAoXafmrnaUjK9/qFnkYvonDrt6EImLf6zcHA0emnaY/gmTbDkfUBSqy6ervfoMhDmuutc+4n4aH5VUWmFs9+6il9PI3iUnqi/QET76WFEZc01QAAAABJRU5ErkJggg==',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJBAMAAAASvxsjAAAAIVBMVEXMzMzMzMzMzMzMzMzMzMzMzMwAAAA6QkabnZ9TWV1RWFwNpdbOAAAAB3RSTlPdgfnFCgkAkn5dJwAAADBJREFUCNdjSBVQEE1gcO6sbHZgkCgvrxBg4Cwvr2RgUC8vL1eAsKHizl1VzQ4Q9QB1Sg3P9miJWgAAAABJRU5ErkJggg=='
	];
	var imgArr = new Array(base64Arr.length); 

	var selector = [
		'#play2vr-playPauseBtn[data-state="play"]',
		'#play2vr-playpause[data-state="pause"]',
		'#play2vr-playpause[data-state="play"]',
		'#play2vr-mute[data-state="mute"]',
		'#play2vr-mute[data-state="unmute"]',
		'#play2vr-vrmode[data-state="vroff"]',
		'#play2vr-fullmode[data-state="fulloff"]',
		'#play2vr-fullmode[data-state="fullon"]',
		'#play2vr-ballImg',
	];
	//var tintColor = '#ff80c0';
	var tintColor = false;
	
	
	var htmlText = [
		'<div id="play2vr-video-controls" class="play2vr-controls" data-state="hidden">',
		'	<div class="play2vr-playWrap"><button id="play2vr-playpause" type="button" data-state="play">Play/Pause</button></div>',
		'	<div class="play2vr-currentWrap"><p id="play2vr-currentTime" >00:00</p></div>',
		'	<div class="play2vr-progress" id="play2vr-progressBg">',
		'		<div id="play2vr-buf"></div>',
		'		<div id="play2vr-progress" value="0" min="0">',
		'			<span id="play2vr-progress-bar"></span>',
		'		</div>',
		'		<div class="play2vr-ball" id="play2vr-ball"><img id ="play2vr-ballImg" height="300%" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJBAMAAAASvxsjAAAAIVBMVEXMzMzMzMzMzMzMzMzMzMzMzMwAAAA6QkabnZ9TWV1RWFwNpdbOAAAAB3RSTlPdgfnFCgkAkn5dJwAAADBJREFUCNdjSBVQEE1gcO6sbHZgkCgvrxBg4Cwvr2RgUC8vL1eAsKHizl1VzQ4Q9QB1Sg3P9miJWgAAAABJRU5ErkJggg=="></div>',
		'	</div>',
		'	<div class="play2vr-totalWrap"><p id="play2vr-totalTime" >00:00</p></div>',
		'	<div class="play2vr-muteWrap"><button id="play2vr-mute" type="button" data-state="mute">Mute/Unmute</button></div>',
		'	<div class="play2vr-vrWrap"><button id="play2vr-vrmode" type="button" data-state="vroff">VR</button></div>',
		'	<div class="play2vr-fullWrap"><button id="play2vr-fullmode" type="button" data-state="fulloff">VR</button></div>',
		'	<div class="play2vr-sxWrap"><div class="play2vr-sx" id="play2vr-sx">/</div></div>',
		'</div>',
	].join("\n");
	
	var cssText = [
		'#play2vr-videoContainer {background-color:' + skinColor + ';opacity:0 !important;width:100%;height:6.8%;position:absolute;left:0;bottom:0;opacity:0.8;margin:0;transition:transform 1s ease;-webkit-transition:-webkit-transform 1s ease;}',
		'#play2vr-blurDiv{height:6.8%;opacity:0 !important;}',
		".play2vr-controls, .play2vr-controls > * { padding:0;margin:0;}",
		'.play2vr-controls{width:100%;height:100%;position:absolute;left:0;top:0;}',
		".play2vr-controls[data-state=hidden] {display:none;}",
		".play2vr-controls[data-state=visible] {display:block;}",
		".play2vr-controls .play2vr-progress{cursor:pointer;width:68%;height:4%;position:absolute;top:48%;left:11%;}",
		'.play2vr-controls button {text-align:center;overflow:hidden; white-space:nowrap; text-overflow:ellipsis;border:none; cursor:pointer; text-indent:-99999px; background: transparent; background-size:contain; background-repeat:no-repeat;}',
		'.play2vr-playWrap{width:5%;height:100%;position:absolute;left:0;top:0;opacity:0.6;}',
		'.play2vr-currentWrap{width:5%;height:100%;position:absolute;left:5%;top:0;opacity:0.6;}',
		'.play2vr-totalWrap{width:5%;height:100%;position:absolute;left:80%;top:0;opacity:0.6;}',
		'.play2vr-muteWrap{width:5%;height:100%;position:absolute;left:85%;top:0;opacity:0.6;}',
		'.play2vr-vrWrap{width:5%;height:100%;position:absolute;left:90%;top:0;}',
		'.play2vr-fullWrap{width:5%;height:100%;position:absolute;left:95%;top:0;opacity:0.6;}',
		'#play2vr-playpause, #play2vr-mute, #play2vr-vrmode, #play2vr-fullmode{height:50%;width:50%;position:absolute;left:0;top:0;right:0;bottom:0;margin:auto;}',
		'#play2vr-currentTime, #play2vr-totalTime, #play2vr-sx{position:absolute;left:50%;top:50%;margin:0;padding:0;color:#fff;font-weight:lighter;transform:translateX(-50%) translateY(-50%);-webkit-transform:translateX(-50%) translateY(-50%);opacity:0.6;}',
		".play2vr-controls button:hover { opacity:0.5;}",
		
		'#play2vr-videoContainer[data-show=\"show\"] {opacity:1 !important;}',
		'#play2vr-blurDiv[data-show=\"show\"] {opacity:1 !important;}',
		".play2vr-controls progress {display:block;width:100%;height:100%;margin:0;border:none;overflow:hidden;border-radius:2px;}",
		".play2vr-ball{height:250%;position:absolute;left:0;top:-250%;margin-left:-1px;pointer-events:none;}",
		'.play2vr-ball img{display:block;}',
		".play2vr-controls #play2vr-buf {display:none;position:absolute;left:0;top:0;width:0%;height:100%;background:#ccc;opacity:0;pointer-events:none;}",
		".play2vr-sxWrap{display:none;color:#fff;font-weight:bold;position:absolute;}",
		".play2vr-progress{background:#444e50;}",
		'#play2vr-progress{height:100%;background:#ccc;width:0;position:relative;}',
		'.play2vr-controls button { background-position:center center; text-align:center}',
		'#play2vr-blurDiv{width:100%;position:absolute;left:0;bottom:0;background:rgba(255,255,255,0.2); -webkit-backdrop-filter:brightness(0.8) blur(6px);transition:transform 1s ease;-webkit-transition:-webkit-transform 1s ease;}',
		//'#play2vr-posterImg{pointer-events:none;width:100%;height:100%;position:absolute;left:0;top:0;z-index:100;background-size:cover;}',
		'@media screen and (max-device-width:736px) and (orientation:landscape){#play2vr-videoContainer, #play2vr-blurDiv{height:8%;} .play2vr-controls .play2vr-progress{width:63%;left:13.5%;} .play2vr-currentWrap{width:7.5%;} .play2vr-totalWrap{width:7.5%;left:77.5%;} .play2vr-ball{height:230%;}}',
		'@media screen and (max-device-width:736px) and (orientation:portrait){#play2vr-videoContainer, #play2vr-blurDiv{height:11.3%;} .play2vr-controls .play2vr-progress{width:90%;height:6%;left:5%;top:15%;} .play2vr-ball{height:80%;top:-60%;} .play2vr-playWrap{width:15%;height:50%;top:40%;} .play2vr-muteWrap{width:15%;left:65%;height:50%;top:40%;} .play2vr-vrWrap{width:15%;left:75%;height:50%;top:40%;} .play2vr-fullWrap{width:15%;left:85%;height:50%;top:40%;} .play2vr-currentWrap{width:15%;height:40%;left:15%;top:43%;} .play2vr-totalWrap{width:15%;height:40%;left:30%;top:43%;} .play2vr-sxWrap{display:block;width:2%;height:40%;left:29%;top:43%;} .play2vr-playWrap, .play2vr-currentWrap, .play2vr-muteWrap, .play2vr-totalWrap{box-shadow:none;} #play2vr-videoContainer[data-state=\"small\"] .play2vr-playWrap{width:5%;height:80%;top:10%;left:2%;} #play2vr-videoContainer[data-state=\"small\"] .play2vr-vrWrap{display:none;} #play2vr-videoContainer[data-state=\"small\"] .play2vr-muteWrap{display:none;} #play2vr-videoContainer[data-state=\"small\"] .play2vr-progress{width:35%;height:8%;top:46%;left:11%;} #play2vr-videoContainer[data-state=\"small\"] .play2vr-currentWrap{left:50%;top:30%;} #play2vr-videoContainer[data-state=\"small\"] .play2vr-sxWrap{left:66%;top:30%;} #play2vr-videoContainer[data-state=\"small\"] .play2vr-totalWrap{left:70%;top:30%;} #play2vr-videoContainer[data-state=\"small\"] .play2vr-fullWrap{width:5%;height:80%;top:10%;left:89%;}}',
		'@supports (-webkit-backdrop-filter: none) { #play2vr-videoContainer{z-index:222}}'
	].join("\n");
	
	var $t = this;
	var container = $t.api.getDiv();
	
	
	var _attr = function(ele, props)
	{
		if (typeof ele == 'string') ele = document.querySelector(ele);
		if (ele)
			for (var p in props)
				if (props.hasOwnProperty(p))
					ele.setAttribute(p, props[p]);
	};
	
	var _addFigure = function(htmlText)
	{
		var figure = document.createElement('div');
		_attr(figure, {
			id: 'play2vr-videoContainer',
			'data-fullscreen': false
		});
		figure.innerHTML = htmlText;
		container.appendChild(figure);
	};
	
	var _addCss = function(cssText)
	{
		var style = document.createElement('style');
	    style.type = 'text/css';
	    style.id = 'play2VRskin';
		
	    if (style.styleSheet) {
	        style.styleSheet.cssText = cssText;
	    } else {
	        style.innerHTML = cssText;
	    }
	    
	    var play2VRskin = document.getElementById('play2VRskin');
	   
		if(play2VRskin){
			play2VRskin.parentNode.removeChild(play2VRskin); 
			
		}
	
	    document.getElementsByTagName("head")[0].appendChild( style );
	};	
	
	var _togglePlayState = function()
	{
		if ($t.video.paused || $t.video.ended){
			playpause.setAttribute('data-state', 'play');
		}else{
			playpause.setAttribute('data-state', 'pause');
		}
	}
	
	var _toggleMuteState = function()
	{
		mute.setAttribute('data-state', $t.video.muted ? 'unmute' : 'mute');
	}
	
	var hours = 0, minutes = 0, seconds = 0;
	var _setPlayerTime = function(ele, sec_num)
	{
		hours   = Math.floor(sec_num / 3600);
		minutes = Math.floor((sec_num - (hours * 3600)) / 60);
	    seconds = Math.floor(sec_num - (hours * 3600) - (minutes * 60));
	
	    if (hours   < 10) {hours   = "0"+hours;}
	    if (minutes < 10) {minutes = "0"+minutes;}
	    if (seconds < 10) {seconds = "0"+seconds;}
	    
	    ele.innerText = minutes+':'+seconds;
	}
	
	var _bindVideoEvents = function()
	{		
		var videoEventHandlers = {
	    	loadedmetadata: function(e)
	    	{
	    		progress.setAttribute('max', $t.video.duration);
	    		_setPlayerTime(totalTime, $t.video.duration);
	    	},
	    	canplay: function(e)
	    	{
				
	    	},
	    	play: function(e)
	    	{
				_togglePlayState();
	    	},
	    	pause: function(e)
	    	{
	    		_togglePlayState();
	    	},
	    	timeupdate: function(e)
	    	{
	    		_setPlayerTime(currentTime, $t.video.currentTime);
				if (!progress.getAttribute('max')) progress.setAttribute('max', $t.video.duration);
				progress.value = $t.video.currentTime;
				document.getElementById('play2vr-progress').style.width = Math.floor(($t.video.currentTime / $t.video.duration) * 100) + '%';
				ball.style.left = Math.floor(($t.video.currentTime / $t.video.duration) * 100) + '%';
	    	},
	    	progress: function(e)
	    	{
				var buf = $t.video.buffered, leg = buf.length-1, progessPercent = 0;
				if(leg >= 0) progessPercent = buf.end(leg)/$t.video.duration * 100;	
				document.getElementById('play2vr-buf').style.width = Math.floor(progessPercent) + '%';
	    	},
	    	ended: function()
	    	{
	    		videoContainer.removeAttribute('data-show');
	    	},
	    	error: function()
	    	{
	    	
	    	}
	    }
	    for (var e in videoEventHandlers)
	    	$t.video.addEventListener(e, videoEventHandlers[e].bind(this));	
	};
	
	_addCss(cssText);
	_addFigure(htmlText);
	
	var videoContainer = document.getElementById('play2vr-videoContainer');
	var videoControls = document.getElementById('play2vr-video-controls');
	videoControls.setAttribute('data-state', 'visible');

	var playpause = document.getElementById('play2vr-playpause');
	var _playpauseButton = function(e)
	{
		if ($t.video.paused || $t.video.ended) $t.api.play();
		else $t.api.pause();
	};
	
	var mute = document.getElementById('play2vr-mute');
	var _muteButton = function(e)
	{
		$t.video.muted = !$t.video.muted;
		_toggleMuteState();
	};
	
	var progress = document.getElementById('play2vr-progress');
	var progressBar = document.getElementById('play2vr-progress-bar');
	var ball = document.getElementById('play2vr-ball');
	var _progressButton = function(e)
	{
		var XX; 
		var d = document.getElementById('play2vr-progressBg');
		var WW = parseInt(window.getComputedStyle(d).width);
		
		if(isTouchDevice){
			XX = e.changedTouches[0].pageX;
		}else{
			XX = e.offsetX;
		}	 
				
		$t.video.currentTime = XX / WW * $t.video.duration;
	};
	
	var supportsProgress = (document.createElement('progress').max !== undefined);
	if (!supportsProgress) progress.setAttribute('data-state', 'fake');
	
	var currentTime = document.getElementById('play2vr-currentTime');
	var totalTime = document.getElementById('play2vr-totalTime');
	
	var vrMode = document.getElementById('play2vr-vrmode');
	var _vrModeButton = function(e)
	{
		var currentState = this.getAttribute('data-state');
		if (currentState == 'vroff') currentState = 'vron';
		else if (currentState == 'vron') currentState = 'vroff';
		this.setAttribute('data-state', currentState);
		$t.api.toggleVR();
	}
	
	var fullMode = document.getElementById('play2vr-fullmode');
	var _fullScreenButton = function(e)
	{
		var currentState = this.getAttribute('data-state');
		if (currentState == 'fulloff') currentState = 'fullon';
		else if (currentState == 'fullon') currentState = 'fulloff';
		this.setAttribute('data-state', currentState);
		$t.api.toggleFullscreen();
		fitCanvas();
		//setTimeout(fitCanvas,300)
		
	}
	
	document.getElementById('play2vr-videoContainer').addEventListener('touchstart', function(e){e.preventDefault()});

	var startX, startY, moveEndX, moveEndY, X, Y; 
	
	var touchstartBall = function(e){
		e.preventDefault();
		startX = e.targetTouches[0].pageX,
		startY = e.targetTouches[0].pageY;
	}
	
	var touchmoveBall = function(e){
		e.preventDefault();
		moveEndX = e.targetTouches[0].pageX,
		moveEndY = e.targetTouches[0].pageY;
		 X = moveEndX - startX,
		 Y = moveEndY - startY;	
		    if ( Math.abs(X) > Math.abs(Y) && X > 0 ) {
		    	$t.video.currentTime += X/$t.video.duration;
		    }
		    else if ( Math.abs(X) > Math.abs(Y) && X < 0 ) {
		    	$t.video.currentTime += X/$t.video.duration;
		    }
	}
	
	videoContainer.addEventListener('touchstart', touchstartBall);
	videoContainer.addEventListener('touchmove', touchmoveBall);
	
	var hideId;
	var _progressHide = function(){
		clearTimeout(hideId);
		videoContainer.setAttribute('data-show', 'show');
		videoContainer.style.cssText += '-webkit-transform:translateY(0px);transform:translateY(0px);';
		
		hideId = setTimeout(function(){
			videoContainer.style.cssText += '-webkit-transform:translateY(200px);transform:translateY(200px);';
		},4000)
	}
	
	
	var eventName = isTouchDevice ? 'touchstart' : 'click';
	
	
	playpause.addEventListener(eventName, _playpauseButton);
	mute.addEventListener(eventName, _muteButton);	
	document.getElementById('play2vr-progressBg').addEventListener(eventName, _progressButton);	
	vrMode.addEventListener(eventName, _vrModeButton);
	fullMode.addEventListener(eventName, _fullScreenButton);
	
	container.addEventListener(eventName, _progressHide);

	
	_bindVideoEvents();
	
	
	function tint(img, colorStr)
	{
		function parseColor(colorStr)
		{
			var hex = parseInt(colorStr.substring(1), 16); 
			return {
				r: (hex >> 16 & 0xFF) / 255,
				g: (hex >> 8 & 0xFF) / 255,
				b: (hex & 0xFF) / 255
			};
		}
	
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");	
		canvas.width = img.width;
		canvas.height = img.height;
		ctx.globalCompositeOperation = 'copy';
		ctx.drawImage(img, 0, 0, img.width, img.height);
		
		var imgData = ctx.getImageData( 0, 0, img.width, img.height);
		var color = parseColor(colorStr);
		for (var i=0; i<imgData.data.length; i+=4)
		{
			imgData.data[i] *= color.r;
			imgData.data[i+1] *= color.g;
			imgData.data[i+2] *= color.b;
		}		
		ctx.putImageData(imgData, 0, 0);
	//	console.log(imgData.width+','+imgData.height);		
		return canvas.toDataURL();
	}
	
	
	var x=0;
	
	
	function loaded(){
		
		var tintImgBase64 = tint(imgArr[x], tintColor);
		if(x != imgArr.length -1){
			var str = selector[x] + '{background-image:url(' + tintImgBase64 + ');}';
			document.querySelector('#play2VRskin').innerHTML += str;
			x++;
		}else{
			document.querySelector(selector[x]).setAttribute('src', tintImgBase64)
		}
		
		
	}
	
	function tintImage(){
		for (var i = 0; i < base64Arr.length; i++){
			imgArr[i] = new Image();
			imgArr[i].src =  base64Arr[i];  
			imgArr[i].addEventListener("load", loaded);	
		}	
	}
	
	
	if(tintColor){
		tintImage();
		document.querySelector('#tint').innerHTML += '#play2vr-currentTime, #play2vr-totalTime, #play2vr-sx{color:' + tintColor + '}'
	}else{
		for (var i = 0; i < base64Arr.length; i++){
			if(i !=	base64Arr.length - 1){
				var str = selector[i] + '{background-image:url(' + base64Arr[i] + ');}';
				document.querySelector('#play2VRskin').innerHTML += str;
			}else{
				document.querySelector(selector[i]).setAttribute('src', base64Arr[i]);
			}
		}
	}	
	
	
	
	
	function fitCanvas(){
		var canvasData = container.getBoundingClientRect();
		var barHeight = canvasData.height / 9;
		var btnHeight = canvasData.height / 4;
		var barStyle, btnStyle;
		
		barStyle = 'height:' + barHeight + 'px;';
		btnStyle = 'height:' + btnHeight + 'px;width:' + btnHeight + 'px;';
		clearTimeout(hideId);
				
//		if(window.orientation == 0){
//			if(canvasData.height < window.innerHeight){ //å°çª—å£
//				document.querySelector('#videoContainer').setAttribute('data-state', 'small');
//				document.querySelector('#videoContainer').setAttribute('style', barStyle);
//				document.querySelector('#playPauseBtn').setAttribute('style', btnStyle);
//			}else if(canvasData.height == window.innerHeight){ //å…¨å±
//				document.querySelector('#videoContainer').removeAttribute('data-state');
//				document.querySelector('#videoContainer').removeAttribute('style', barStyle);
//				document.querySelector('#playPauseBtn').removeAttribute('style', btnStyle);
//			}
//		}	
	}
	
	fitCanvas();
	container.addEventListener('resize', fitCanvas);
	
}
play2VR.flatSkin = flatSkin;