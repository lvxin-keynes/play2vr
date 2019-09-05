var _M4 = require('../../utils/node_modules/gl-mat4');
var _UA = require('./ua');
var _CTX = require('./context');
//var _C = require('./vrcontrols');
var _FS = require('./sensor-fusion/fusion-pose-sensor');
var _G = require('./geometry');
var _GL = require('./gl');
//TODO do not apply distortion because cube geometry segment is not done
var _P = require('./deviceprofile');
var _E = require('./engine');
var _T = require('./track');
var _EV = require('./event');
var _DOM = require('./dom');
var _HP = require('./hotspot');
var _CF = require('./conf');
var _MSG = require('./message');
var _WM = require('./watermark');
var _AN =  require('./animation');
var _TL = require('./title');
var _IM = require('./iframemessage');
var _CTA = require('./cta');
var _TC = require('./trycatch'); 
var _PL = require('./plugin');
var _BT = require('./bitrate');

//for debug use
//require('./debug/console').init();
//var S = require('./debug/stats.min');
//var stats = new S();
//stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
//document.body.appendChild( stats.dom );

var _playConfig, 
	_move,
	_state, 
	_compatConfig = {
		_moveVideo: _UA._isIphone && _UA._iOSVersion < 10 ? true : false,
		_useCanvas: (
			_UA._isIE 
			|| (_UA._isMac && _UA._isSafari && _UA._safariVersion >= 11) 
			|| _UA._isIphone 												//iphone HLS fix
		)? true : false,
		//_flipRB: _UA._isIphone && _UA._webkitVersion >= 602 && _UA._iOSVersion < 11 ? true : false,
		_flipRB: false,
		_activateVideo: _UA._isTouchDevice || (_UA._isSafari && _UA._safariVersion >= 11),
		_noCORS: ((_UA._isIphone && _UA._iOSVersion < 11) || _UA._isIE) ? true : false
	},
	_keyDomain = '//v2.play2vr.com/';
					
var _shader = {
	_video: {
		_vert: [
			"attribute vec3 position;",
			"attribute vec2 uv;",
			"varying vec2 vUv;",
			"uniform mat4 uModel;",
			"uniform mat4 uView;",
			"uniform mat4 uProjection;",
			"uniform vec4 uOffsetRepeat;",
			"uniform int uDistortFlag;",
//TODO do not apply distortion because cube geometry segment is not done			
//			"uniform mat4 uUndistortion;",
//			"uniform float uMaxRadSq;",			
//			"float distortionFactor(float rSquared) {",
//			"	float ret = 0.0;",
//			"	ret = rSquared * (ret + uUndistortion[1][1]);",
//			"	ret = rSquared * (ret + uUndistortion[0][1]);",
//			"	ret = rSquared * (ret + uUndistortion[3][0]);",
//			"	ret = rSquared * (ret + uUndistortion[2][0]);",
//			"	ret = rSquared * (ret + uUndistortion[1][0]);",
//			"	ret = rSquared * (ret + uUndistortion[0][0]);",
//			"	return ret + 1.0;",	
//			"}",	
//			"vec4 undistort(vec4 pos) {",
//			"	pos = uView * uModel * pos;",
//			"	float r2 = clamp(dot(pos.xy, pos.xy) / (pos.z*pos.z), 0.0, uMaxRadSq);",	
//			"	pos.xy *= distortionFactor(r2);",
//			"	return pos;",
//			"}",
//			"void main() {",
//			"	vUv = uv * uOffsetRepeat.zw + uOffsetRepeat.xy;",
//			"	gl_Position = uDistortFlag==0 ? uProjection * undistort(vec4(position, 1.0)) : uProjection * uView * uModel * vec4(position, 1.0);",
//			"}",
			"void main() {",
			"	vUv = uv * uOffsetRepeat.zw + uOffsetRepeat.xy;",
			"	gl_Position = uProjection * uView * uModel * vec4(position, 1.0);",
			"}"			
		].join("\n"),
		_frag: [
			"precision mediump float;",
			"uniform sampler2D map;",
			"varying vec2 vUv;",
		  	"void main() {",
		  	_compatConfig._flipRB ? "	gl_FragColor = texture2D( map, vUv ).bgra;" : "	gl_FragColor = texture2D( map, vUv );",
		  	"}"	
		].join("\n")
	},
	_ui: {
		_vert: [
			"attribute vec3 position;",
			"attribute vec2 uv;",
			"varying vec2 vUv;",
			"uniform mat4 uModel;",	
			"uniform vec3 uTint;",
			"varying vec3 vTint;",					
			"uniform float uAlpha;",
			"varying float vAlpha;",
			"uniform vec4 uOffsetRepeat;",
			"void main() {",			
			"	vUv = uv * uOffsetRepeat.zw + uOffsetRepeat.xy;",
			"	vTint = uTint; ",
			"	vAlpha = uAlpha; ",
			"	gl_Position = uModel * vec4(position, 1.0);",
			"}"			
		].join("\n"),
		_frag: [
			"precision mediump float;",
			"uniform sampler2D map;",
			"varying vec2 vUv;",
			"varying vec3 vTint;",
		  	"varying float vAlpha;",
		  	"void main() {",
		  	"	gl_FragColor = texture2D( map, vUv ) * vec4(vTint*vAlpha, vAlpha);",
		  	"}"	
		].join("\n")
	}
};

var _context,
	_canvas, 
    _gl,   
    _distortFlag = 0, 
    _camera = {
    	_pos: [0, 0, 0],
    	_target: [0,0,-1], 
    	_up: [0,1,0],
    	_fov: 100,	//fov y
    	_near: 0.001,
    	_far: 1000,
    	_aspect: 1,
    	_focus: 30,
    	_projectionM: _M4.create(),
    	_viewM: _M4.create(),    	
    	_leftEyeM: _M4.create(),
    	_rightEyeM: _M4.create()
    },
    _divs = [], _div,
    _originalDiv, 
    _container, _containerBox, _videoBox,  
    _videoCanvas, _videoCanvasCtx,
    _video, _videoImg, _videoMesh, _videoProgram, _engine, _audio,    
    _timestamp, 
    _uiProgram,
    _controls,
    _devicePixelRatio = window.devicePixelRatio,
	_width = window.innerWidth, 
	_height = window.innerHeight,
	_halfWidth = _width/2, 
	_halfHeight = _height/2,
	_profile,
	_animation = undefined,
	_initOptions = {},
	_apiFuncs = {
		init: init,
		dispose: dispose,
		getDiv: getDiv,
		getMedia: getMedia,
		on: _EV._on,
		off: _EV._off,
		toggleVR: toggleVR,
		toggleGyro: toggleGyro,
		toggleFullscreen: toggleFullscreen,
		toggleMessage: toggleMessage,
		play: play,
		pause: pause,
		stop: stop,		
		screenShot: screenShot,
		addHotSpot: addHotSpot,
		removeHotSpot: removeHotSpot,
		commandHotSpot: commandHotSpot,
		getHotSpotQuaternion: getHotSpotQuaternion,
		addPlugin: addPlugin, 
		removePlugin: removePlugin,
		getBitratesFormats: getBitratesFormats, 
		switchBitrateFormat: switchBitrateFormat 
	};			
		
	_apiFuncs = _TC._obj(_apiFuncs);
	
var _deg2Rad = Math.PI/180;	
//var _videoDomain = "";

function checkCanplay(_mannual)
{
	//console.log('try canplay: ' + _mannual);
	if (_state._switching) return;
	if (_mannual === true && !_state._canplay) return;

    _GL._renderTexture(_gl, _videoMesh._texture, _videoImg);
	_state._canplay = true;
	_EV._fire('canplay', _engine.duration);
	//console.log('can_play');    		    		
}
		    	    	
function checkVideoBuffer()
{
	var _buffers = _engine.buffered;
	if (_buffers.length >= 1) 
	{
		var _bufferTime = _buffers.end([_buffers.length-1]);
		var _bufferStartTime = _buffers.start([_buffers.length-1]);

		if (_bufferTime - _engine.currentTime < 0.8 && _engine.networkState == 1) //check networkState to be sure
			_state._buffering = true;
		else 
			_state._buffering = false;				
	}
	else
	{
		_state._buffering = true;    		
	}
	if (_state._buffering) _EV._fire('buffering');
}		    	    	
		    	    		   		    
function initVideo()
{	
  	_video.setAttribute("playsinline", true);
	_video.setAttribute("webkit-playsinline", true);
    _video.setAttribute("crossorigin", "anonymous");		    
    if (_playConfig.autoPlay) _video.setAttribute("autoplay", true);
    
    if (_UA._isX5)
    {
	    _video.setAttribute("x5-video-player-type", "h5");
	    _video.setAttribute("x5-video-player-fullscreen", "false");
		//add dispose when exit 
//	    _video.addEventListener("x5videoenterfullscreen", function(){
//	    	_video.style["object-position"] = "0px " + (window.screen.height - window.innerHeight) + "px";
//	    });
	    _video.addEventListener("x5videoexitfullscreen", dispose);	
    }
    
	//_video.setAttribute("src", _playConfig.src);
	
	if (_playConfig.format == 'm3u8' && _BT._isSoftwareHLS) _BT._wrapHLSVideo(_video, _playConfig._bitrateFormatSrc);
	else _video.setAttribute('src', _playConfig._bitrateFormatSrc);
	
	_video.setAttribute("preload", "auto");
	if (_playConfig.loop) _video.setAttribute("loop", true);

	if (_compatConfig._noWebGL) return;

    try { if (_UA._isTouchDevice) _video.currentTime = 0; } catch (e) {}

	if (_compatConfig._moveVideo)
	{
		_audio.src = _video.src;
	}
	
	if (_engine.isDisposed())
		_engine = new _E(_compatConfig._moveVideo ? _audio : _video);			
	
    _videoImg = _video;
	if (_compatConfig._useCanvas)
	{
	    _videoCanvas = document.createElement("canvas");
	    _DOM._setStyle(_videoCanvas, "position:absolute; top:0; left:0; width:100%; height:100%");
	    _videoCanvas.setAttribute("crossorigin", "anonymous");			    
	    _videoCanvasCtx = _videoCanvas.getContext('2d');
	    _videoImg = _videoCanvas;  		    
	}			                	
	
    var _videoEventHandlers = {
    	loadedmetadata: function(e)
    	{
    		_playConfig._videoWidth = _video.videoWidth || _playConfig.width;
    		_playConfig._videoHeight = _video.videoHeight || _playConfig.height;
    		
    		if (_compatConfig._useCanvas)
    		{    			
    			_videoCanvas.width = _playConfig._videoWidth;
    			_videoCanvas.height = _playConfig._videoHeight;
    		}	    		
    		//console.log(_playConfig._videoWidth + 'x' + _playConfig._videoHeight );    		    		
    	},
    	timeupdate: function(e)
    	{
			_HP._updateHotSpots(_engine.currentTime);
			 if (_state && _state._buffering) checkVideoBuffer(); //android progress event is rare 
    	},
    	loadeddata: function(e)
    	{
    		//console.log('loadeddata');
    	},
    	canplay: checkCanplay,
    	progress: checkVideoBuffer,
    	seeking: function(e)
    	{
    		//_state._canplay = false;
    		//console.log('seeking');
    	},        	
    	seeked: function(e)
    	{    		
    		//console.log('seeked: ' + _state._canplay + ' - ' + _engine.networkState);
    		if (_engine.readyState >= 2)
    			_state._canplay = true;
    	},     	
    	stalled: function(e)
    	{    		
    		//console.log('stalled');
    	},
    	waiting: function(e)
    	{
    		_state._canplay = false;
    		//console.log('waiting');
    	},   	
    	emptied: function(e)
    	{
    		_state._canplay = false;
    		//console.log('emptied');
    	}

    };
        
    for (var e in _videoEventHandlers)
    	_engine.addEventListener(e, _videoEventHandlers[e], true);  		
}

function getMedia(_attributes)
{
	//in case of basic mode, returns the <video> element 
	var _result = _compatConfig._noWebGL ? _video : _engine;
	if (_attributes && _attributes.length)
	{
		_result = {
			then: function(_callback)
			{
				_EV._once('getMedia', function(_media) { 
					_callback(_media); 
				});
			}
		};		
		
		if (_compatConfig._isIframeParent)
		{
			_canvas.contentWindow.postMessage({t:_IM.T.GM, a: _attributes}, '*');
			 return _result;
		}		
		
		var _media = {};
		for (var i=0; i<_attributes.length; i++)
			_media[_attributes[i]] = _engine[_attributes[i]];
		
		if (_compatConfig._isIframe) window.top.postMessage({t:_IM.T.GM, m: _media}, '*');							
		else setTimeout(function(){ _EV._fire('getMedia', _media); }, 10);  		
	}
	
	return _result;
}

function getDiv(_original)
{
	return _original ? _originalDiv : _container;
}

function toggleVR(vr)
{
	if (_compatConfig._isIframeParent) {
		_canvas.contentWindow.postMessage({t:_IM.T.TV, v: vr}, '*');
		return;
	}

	_playConfig.vrMode = typeof vr != 'undefined' ? vr : !_playConfig.vrMode;
	_distortFlag = _distortFlag>0 ? 0 : 1;
	
	if (_gl) 
	{
		_gl.useProgram(_videoProgram);
		_gl.uniform1i(_videoProgram.P._uDistortFlag, _distortFlag);	
	}	
	
	_EV._fire('toggleVR', _playConfig.vrMode);
}

function toggleGyro(gyro)
{
	if (_compatConfig._isIframeParent) {
		_canvas.contentWindow.postMessage({t:_IM.T.TG, g: gyro}, '*');
		return;
	}

	_controls._enableGyro = typeof gyro != 'undefined' ? gyro : !_controls._enableGyro;
	
	_EV._fire('toggleGyro', _controls._enableGyro);
}

function toggleFullscreen(fullScreen)
{
	if (_compatConfig._noCORS && _compatConfig._isIframe) window.top.postMessage({t:_IM.T.TF, f:fullScreen}, '*');	

	if (typeof _state.bodyOverflow == 'undefined') _state.bodyOverflow = document.body.style.overflow;

	_playConfig.fullScreen = typeof fullScreen != 'undefined' ? fullScreen : !_playConfig.fullScreen;
	document.body.style.overflow = _playConfig.fullScreen ? 'hidden' : _state.bodyOverflow;

	onWindowResize();
	
	_EV._fire('toggleFullscreen', _playConfig.fullScreen);
}

function toggleMessage(message)
{
	if (_compatConfig._isIframeParent) {
		_canvas.contentWindow.postMessage({t:_IM.T.TM, m: message}, '*');
		return;
	}

	_playConfig.showMessage = typeof message != 'undefined' ? message : !_playConfig.showMessage;
	_EV._fire('toggleMessage', _playConfig.showMessage);
}

function screenShot(_imgWidth, _imgHeight, _imgType, _outputType, _outputQuality)
{
	if (!_canvas) return {then: function(){}};
	
	var _result = {
		then: function(_callback)
		{
			_EV._once('screenshot', function(_base64) { 
				_callback(_base64); 
			});
		}
	};
	
	_outputType = _outputType || "image/png";
	_outputQuality = _outputQuality || 1;	
	
	if (_compatConfig._isIframeParent)
	{
		_canvas.contentWindow.postMessage({t:_IM.T.SS, w:_imgWidth, h:_imgHeight, y: _imgType, o: _outputType, q: _outputQuality}, '*');
		 return _result;
	}
		

	_imgType = _imgType || '2d';
	
	var _shotCanvas = document.createElement('canvas');
	var _shotCtx = _shotCanvas.getContext('2d'); 
	
	var _srcImg = _canvas, _srcWidth = _canvas.width, _srcHeight = _canvas.height;
	if (_imgType == '3d') 
	{
		_srcImg = _videoImg;
		//_srcWidth = _videoImg.videoWidth || _videoImg.width, _srcHeight = _videoImg.videoHeight || _videoImg.height;
		_srcWidth = _playConfig._videoWidth;
		_srcHeight = _playConfig._videoHeight;
		_imgWidth = _imgWidth || _srcWidth;
		_imgHeight = _imgHeight || _srcHeight;
		
		//TODO flip x to make the front correct
		_shotCtx.translate(_srcWidth/2, _srcHeight/2);
		_shotCtx.scale(-1, 1);
	}
	else
	{
		_imgWidth = _imgWidth || 320;
		_imgHeight = _imgHeight || 180;	
	}

	_shotCanvas.width = _imgWidth;
	_shotCanvas.height = _imgHeight;

	//in case of rendering buffer is empty
	render();
	_shotCtx.drawImage(_srcImg, 0, 0, _srcWidth, _srcHeight, 0, 0, _imgWidth, _imgHeight);	
	
	var _base64 = _shotCanvas.toDataURL(_outputType, _outputQuality);
	
	if (_compatConfig._isIframe) window.top.postMessage({t:_IM.T.SS, d:_base64}, '*');							
	else setTimeout(function(){ _EV._fire('screenshot', _base64); }, 10);  		
    
    return _result;    
}

function play()
{		
	//console.log('play');
	if (_compatConfig._isIframeParent) {
		_canvas.contentWindow.postMessage({t:_IM.T.PL}, '*');
		return;
	}
	
	if (_playConfig && _playConfig.media == 'image') return;	

	//if (!_engine.currentTime) _engine.load();
	//if (_engine.currentTime === undefined)  _engine.load();
	if (_engine.buffered.length === 0) {
		_engine.load();
		//console.log('load');
	}
	_engine.play();
	if (_state) _state._playing = true;
	//check video buffer state for android
	if (_state && _state._buffering) checkVideoBuffer();	
	
	if (_compatConfig._moveVideo)
	{
		if (_video.buffered.length === 0) _video.load(); 
			
		_move._t = (new Date).getTime();
		_move._lt = _move._t;
		_move._dt = 0;	
	}
	
	if (_playConfig && _playConfig.showMessage) _MSG._startMessage('play');
		
	_EV._fire('play', _engine.currentTime);
}

function pause()
{
	//console.log('pause');
	if (_compatConfig._isIframeParent) {
		_canvas.contentWindow.postMessage({t:_IM.T.PA}, '*');
		return;
	}

	if (_playConfig && _playConfig.media == 'image') return;

	_engine.pause();
	if (_state) _state._playing = false;
	//check video buffer state for android
	if (_state && _state._buffering) checkVideoBuffer();	
	
	if (_playConfig && _playConfig.showMessage) _MSG._startMessage('pause'); 
		
	_EV._fire('pause', _engine.currentTime);
}

function stop()
{
	if (_compatConfig._isIframeParent) {
		_canvas.contentWindow.postMessage({t:_IM.T.ST}, '*');
		return;
	}

	if (_playConfig && _playConfig.media == 'image') return;
	
	_engine.pause();
	
	_EV._fire('stop');
}

function addHotSpot(_name, _options)
{
	if (_compatConfig._isIframeParent) {
		_canvas.contentWindow.postMessage({t:_IM.T.AHS, n: _name, o: _options}, '*');
		return;
	}	
	
	_HP._addHotSpot(_name, _options);
}

function removeHotSpot(_name)
{
	if (_compatConfig._isIframeParent) {
		_canvas.contentWindow.postMessage({t:_IM.T.RHS, n: _name}, '*');
		return;
	}	
	
	_HP._removeHotSpot(_name);		
}

function commandHotSpot(_name, _command, _args)
{
	if (_compatConfig._isIframeParent) {
		_canvas.contentWindow.postMessage({t:_IM.T.CHS, n: _name, c: _command, a: _args}, '*');
		return;
	}	
	
	_HP._commandHotSpot(_name, _command, _args);	
}

function getHotSpotQuaternion(_name)
{
	var _result = {
		then: function(_callback)
		{
			_EV._once('getHotSpotQuaternion', function(_q) { 
				_callback(_q); 
			});
		}
	};	
	
	if (_compatConfig._isIframeParent)
	{
		_canvas.contentWindow.postMessage({t:_IM.T.GHSQ, n: _name}, '*');
		 return _result;
	}	
	
	var _quaternion = _HP._getHotSpotQuaternion(_name);
	if (_compatConfig._isIframe) window.top.postMessage({t:_IM.T.GHSQ, q: _quaternion}, '*');							
	else setTimeout(function(){ _EV._fire('getHotSpotQuaternion', _quaternion); }, 10);  
	
	return _result;		
}

function addPlugin(_name, _url)
{
	return _PL._addPlugin(_name, _url);
}

function removePlugin(_name)
{
	_PL._removePlugin(_name);
}

function getBitratesFormats()
{
	var _result = {
		then: function(_callback)
		{
			_EV._one('getBitratesFormats', function(_bitratesFormats) {			 
				_callback(_bitratesFormats); 
			});		
		}
	};
	
	if (_compatConfig._isIframeParent)
	{
		_canvas.contentWindow.postMessage({t:_IM.T.GBF}, '*');
		 return _result;
	}
	
	var _bitratesFormats = _BT._getBitratesFormats(_playConfig);
	if (_compatConfig._isIframe) window.top.postMessage({t:_IM.T.GBF, bf: _bitratesFormats}, '*');	 
	//else setTimeout(function(){ _EV._fire('getBitratesFormats', _bitratesFormats); }, 10);	
	//in case the caller is also in the iframe itself
	setTimeout(function(){ _EV._fire('getBitratesFormats', _bitratesFormats); }, 10);
	
	return _result; 
}

function switchBitrateFormat(_bitrate, _format)
{
	//console.log('switchBitrateFormat');
	if (_compatConfig._isIframeParent) {
		//console.log('send switchBitrateFormat to iframe');
		_canvas.contentWindow.postMessage({t:_IM.T.SBF, b:_bitrate, f:_format}, '*');
		return;
	}

	if (!_playConfig || _playConfig.media == 'image') return;
	if (_state._switching) return;
	
	function trySeek(_engine, _seekTime, _callback) 
	{	
		//console.log('try seek:' + _seekTime + ' - ' + _engine.currentTime);
		if (_seekTime == 0 || _seekTime == _engine.duration || _seekTime == _engine.currentTime) 
		{
			//console.log('skipSeek');
			if (typeof _callback == 'function') _callback();
			return;
		}
		if (_state._switchTimer) clearTimeout(_state._switchTimer);
		for (var i=0; i<_engine.seekable.length; i++) 
		{
			if (_seekTime > _engine.seekable.start(i) && _seekTime < _engine.seekable.end(i))
			{
				//console.log('try seek success: ' + _seekTime);
				_engine.currentTime = _seekTime;
				if (typeof _callback == 'function') _callback();
				return;
			}
		}
		
		_state._switchTimer = setTimeout(function(){
			trySeek(_engine, _seekTime, _callback);
		}, 200);
	}
	
	function seekCurrentTime()
	{
		trySeek(_engine, _currentTime, seekComplete);
	}	
	
	function seekComplete()
	{
		//console.log('seek-Complete');	
		_state._switching = false;
		_engine.removeEventListener('canplay', seekCurrentTime);		
		checkCanplay(true);
		play();
		_EV._fire('switchBitrateFormat', {bitrate: _bitrate, format: _format});				
	}
	
	_state._switching = true;
	pause();	
	var _newBitrateFormatSrc = _BT._getBitrateFormatSrc(_playConfig, _bitrate, _format);
	var _currentTime = Math.floor(_engine.currentTime);
	_newBitrateFormatSrc += '#t=' + _currentTime;	
	_state._canplay = false;
	//console.log(_newBitrateFormatSrc);
	_engine.removeEventListener('canplay', seekCurrentTime);
	_engine.addEventListener('canplay', seekCurrentTime);
	if (_playConfig.format == 'm3u8' && _BT._isSoftwareHLS) _BT._wrapHLSVideo(_video, _newBitrateFormatSrc);	
	else _video.setAttribute('src', _newBitrateFormatSrc);
	if (_compatConfig._moveVideo)
	{
		_audio.src = _video.src;
	}	 
}

function loadSkin()
{	
	if (!_playConfig.skin) {
		_EV._fire('loadskin');
		return;
	}	

	var _scripts = document.getElementsByTagName('script');
	var _scriptSrc = "", _scriptIndex = -1, _basePath = "";
	for (var i=0; i<_scripts.length; i++)
	{
		_scriptSrc = _scripts[i].getAttribute('src') || '';
		_scriptIndex = _scriptSrc.indexOf('play2VR.js');
		if (_scriptIndex >= 0)
		{
			_basePath = _scriptSrc.substr(0, _scriptIndex);
			break;
		}		
	}	

	var _skinConfig = {
		_base: _basePath,
		_src: _playConfig.skin + '.skin.js',
		_className: _playConfig.skin + 'Skin',
		_callback: function()
		{
			if (typeof window['play2VR'][_skinConfig._className] == 'function')
			{
				new window['play2VR'][_skinConfig._className]({video:_engine, api: _apiFuncs});
				_EV._fire('loadskin');
				//console.log('true');
				return true;
			}
			else
			{
				//_EV._fire('loadskin');
				//console.log('false');
				return false;
			}
		}
	};
	
	if (_skinConfig._callback()) return; 
	
	_DOM._loadScript(_skinConfig._base, _skinConfig._src, _skinConfig._callback, _timestamp);	
}

function initWebGL()
{
	if (!_context)
	{
		_context = _GL._initWebGL(_canvas, {
		    alpha: false,
		    depth: true,
		    stencil: true,
		    antialias: false,					
			premultipliedAlpha: true,
		    preserveDrawingBuffer: _UA._isX5 ? false : true
		});	
		
		if (!_context) {
			_compatConfig._noWebGL = true;
			return;
		}		
		
		_gl = _context._gl;
		_gl.enable(_gl.BLEND);
		_gl.blendFunc(_gl.SRC_ALPHA, _gl.ONE_MINUS_SRC_ALPHA);				
		
	}
	_gl = _context._gl;
	_canvas = _context._canvas;			
}

function initPlayer() 
{	 
	//console.log(_div); 
	_container = _div.cloneNode();
	_div.parentNode.replaceChild(_container, _div);
	
	_DOM._setStyle(_container, ';position:relative;cursor:crosshair;overflow:hidden;margin:0;padding:0;background:black');
	_container.appendChild(_canvas);
	
	_videoMesh = _GL._createMesh(_gl, _G._getGeometry(_playConfig.type));	
	_gl.frontFace( _videoMesh._geometry.flipSided ? _gl.CW : _gl.CCW);
	_GL._renderTexture(_gl, _videoMesh._texture);	
				  
	initVideoProgram();
	
	initUIProgram();
	
	if (_playConfig.wm) _WM._initWM(_gl);
	if (_playConfig.title) _TL._initTitle(_gl);
	
	_MSG._initMessage(_gl);
        
	toggleFullscreen(_playConfig.fullScreen);
	if (_UA._isTouchDevice) onOrientationChange();
	
	_controls = new _FS({
		_element: _canvas, 
		_width: _canvas._width, 
		_height: _canvas._height, 
		_enableTouch: _playConfig.enableTouch,
		_enableGyro: _playConfig.enableGyro,
		_yawOnly: _playConfig.yawOnly,
		_iframeMotion: _compatConfig._isIframe
		//_iframeMotion: false
	});
	_controls._connect();
	_HP._connect(_container);
}

function onUnload()
{
	if (_engine) _EV._fire('unload', _engine.currentTime);
	//dispose();
}

function initVideoProgram()
{
	//change bgra for image in iOS
	var _videoFrag = _playConfig.media == 'image' ? _shader._video._frag.replace('.bgra', '') : _shader._video._frag; 
	
	_videoProgram = _GL._createProgram(_gl, _shader._video._vert, _videoFrag);
		
	_videoProgram.P._aPosition = _gl.getAttribLocation(_videoProgram, 'position');
	_gl.enableVertexAttribArray(_videoProgram.P._aPosition);
	
	_videoProgram.P._aUv = _gl.getAttribLocation(_videoProgram, 'uv');
	_gl.enableVertexAttribArray(_videoProgram.P._aUv);
	
	_videoProgram.P._uMap = _gl.getUniformLocation(_videoProgram, "map");
	_videoProgram.P._uOffsetRepeat = _gl.getUniformLocation(_videoProgram, "uOffsetRepeat");
	
	var _offsetRepeat = [0.0, 0.0, 1.0, 1.0];
    if (_playConfig.type == _G.T._DOUBLESPHERE) _offsetRepeat = [0, 0, 1, 0.5];
    _gl.uniform4f(_videoProgram.P._uOffsetRepeat, _offsetRepeat[0], _offsetRepeat[1], _offsetRepeat[2], _offsetRepeat[3]);
    
    _videoMesh._modelM = _M4.create();
    _videoProgram.P._uModel = _gl.getUniformLocation(_videoProgram, "uModel");
    _gl.uniformMatrix4fv(_videoProgram.P._uModel, false, _videoMesh._modelM);
    
    
    _M4.lookAt(_camera._viewM, _camera._pos, _camera._target, _camera._up);
    _videoProgram.P._uView = _gl.getUniformLocation(_videoProgram, "uView");
    _gl.uniformMatrix4fv(_videoProgram.P._uView, false, _camera._viewM);            
    
    _videoProgram.P._uProjection = _gl.getUniformLocation(_videoProgram, "uProjection");
    //_gl.uniformMatrix4fv(_videoProgram.P._uProjection, false, _camera._projectionM);
    
    _videoProgram.P._uDistortFlag = _gl.getUniformLocation(_videoProgram, "uDistortFlag");
    _gl.uniform1i(_videoProgram.P._uDistortFlag, _distortFlag);
    
    _profile = new _P();
//TODO do not apply distortion because cube geometry segment is not done    
//    var _undistortionM = _M4.create();    
//    for (var i=0; i<_profile._viewer._inverse._coefficients.length; i++)
//    	_undistortionM[i] = _profile._viewer._inverse._coefficients[i]; 
//    	
//	//console.log(_undistortionM);
//	    	
//    _videoProgram.P._uUndistortion = _gl.getUniformLocation(_videoProgram, "uUndistortion");
//    _gl.uniformMatrix4fv(_videoProgram.P._uUndistortion, false, _undistortionM);
//    
//    var _maxRadSq = Math.pow(_profile._viewer._maxRadius, 2);
//    _videoProgram.P._uMaxRadSq = _gl.getUniformLocation(_videoProgram, "uMaxRadSq");
//    _gl.uniform1f(_videoProgram.P._uMaxRadSq, _maxRadSq);    
}

function initUIProgram()
{
	_uiProgram = _GL._createProgram(_gl, _shader._ui._vert, _shader._ui._frag);	
	
	_uiProgram.P._aPosition = _gl.getAttribLocation(_uiProgram, 'position');
	_gl.enableVertexAttribArray(_uiProgram.P._aPosition);
		
	_uiProgram.P._aUv = _gl.getAttribLocation(_uiProgram, 'uv');
	_gl.enableVertexAttribArray(_uiProgram.P._aUv);
		
	_uiProgram.P._uMap = _gl.getUniformLocation(_uiProgram, "map");
	
	_uiProgram.P._uOffsetRepeat = _gl.getUniformLocation(_uiProgram, "uOffsetRepeat");	
    _gl.uniform4f(_uiProgram.P._uOffsetRepeat, 0.0, 0.0, 1.0, 1.0);
    
    _uiProgram.P._uModel = _gl.getUniformLocation(_uiProgram, "uModel");   
    
    _uiProgram.P._uTint =  _gl.getUniformLocation(_uiProgram, "uTint");
    
    _uiProgram.P._uAlpha =  _gl.getUniformLocation(_uiProgram, "uAlpha");
}

function onWindowResize() 
{	
	if (!_playConfig) return;
	
	//in case init is not complete
	if (!_container) return;
	//alert('resize: ' + _compatConfig._isIframe + ',' + window.innerWidth + ',' + window.innerHeight + '| ' + _playConfig.fullScreen);
	var _fullScreenRuleName = "play2VRFullscreen";
	
	//console.log(window.orientation + ': ' + window.innerWidth + '/' + window.innerHeight);

	if (_playConfig.fullScreen)
	{
		_DOM._addOrUpdateRule(_fullScreenRuleName, "."+_fullScreenRuleName+" {position:fixed !important; display: block !important; top: 0 !important; left: 0 !important; width:"+window.innerWidth+"px !important; height:"+window.innerHeight+"px !important; margin: 0 !important; z-index:99999 !important;} ");
		_DOM._addClass(_container, _fullScreenRuleName);
		window.scrollTo(0, 0);
	}
	else
	{
		_DOM._removeClass(_container, _fullScreenRuleName);
	}

	_containerBox = _container.getBoundingClientRect();
	
	_width = _containerBox.width * _devicePixelRatio;
	_height = _containerBox.height * _devicePixelRatio;	
	
	_CTX._set('width', _width);
	_CTX._set('height', _height);
	_CTX._set('devicePixelRatio', _devicePixelRatio);

	_halfWidth = _width/2;
	_halfHeight = _height/2;	
	
	_canvas.width = _width;
	_canvas.height = _height;
	
	_DOM._setStyle(_canvas, 'width:'+_containerBox.width+'px;height:'+_containerBox.height+'px;');

	_EV._fire('resize', {width: _width, height: _height});	
	
	if (_compatConfig._isIframeParent) 
	{		
		return;
	}
	
	if (_compatConfig._noWebGL) return;
	
	if (_playConfig.title) _TL._drawTitle(_gl, _playConfig.title);
	
	_camera._aspect = _width/_height;
	_M4.perspective(_camera._projectionM, _camera._fov * _deg2Rad, _camera._aspect, _camera._near, _camera._far);	
	updateSteoreoCamera();	
	
	_gl.useProgram(_videoProgram);
	_gl.uniformMatrix4fv(_videoProgram.P._uProjection, false, _camera._projectionM);
	
}

function onOrientationChange()
{
	//alert('orientation: ' + _compatConfig._isIframe + ',' + window.orientation);
	if (!_state) return;
	if (typeof _state.fullScreen == 'undefined') _state.fullScreen = _playConfig.fullScreen;					
	if (typeof _state.vrMode == 'undefined') _state.vrMode = _playConfig.vrMode;
	
	switch(window.orientation)
	{		
		case -90:	
		case 90:
			//landscape			
			if (_playConfig.landscapeFullscreen || _playConfig.landscapeFullscreenVR) toggleFullscreen(true);
			if (_playConfig.landscapeFullscreenVR) toggleVR(true);					
			_EV._fire('orientationchange', 'landscape');
			
			break;
		default: 
			//portrait
			toggleFullscreen(_state.fullScreen || false);
			toggleVR(_state.vrMode || false);
			_EV._fire('orientationchange', 'portrait');
			
			break;
	}
}

function updateSteoreoCamera()
{
	var _tmpProjectionM = _M4.create(), _tmpLeft = _M4.create(), _tmpRight = _M4.create();
	var _eyeSep=0, _eyeSepOnProjection=0, _xmin=0, _xmax=0, _ymin=0, _ymax=0;

	_M4.copy(_tmpProjectionM, _camera._projectionM);
	_eyeSep = _profile._viewer._lenses._separation/2;
	_eyeSepOnProjection = _eyeSep * _camera._near / _camera._focus;
	_ymax = _camera._near * Math.tan( _deg2Rad * _camera._fov / 2 );
		
	_xmin = -_ymax * _camera._aspect + _eyeSepOnProjection;
	_xmax = _ymax * _camera._aspect + _eyeSepOnProjection;
	_tmpProjectionM[0] = 2 * _camera._near / ( _xmax - _xmin );
	_tmpProjectionM[8] = ( _xmax + _xmin ) / ( _xmax - _xmin );	
	_M4.copy( _camera._leftEyeM, _tmpProjectionM );
	
	_xmin = - _ymax * _camera._aspect - _eyeSepOnProjection;
	_xmax = _ymax * _camera._aspect - _eyeSepOnProjection;
	_tmpProjectionM[0] = 2 * _camera._near / ( _xmax - _xmin );
	_tmpProjectionM[8] = ( _xmax + _xmin ) / ( _xmax - _xmin );
	_M4.copy( _camera._rightEyeM, _tmpProjectionM );		
	
	_tmpLeft[ 12 ] = -_eyeSep; 
	_tmpRight[12] = _eyeSep;
	_M4.multiply(_camera._leftEyeM, _camera._leftEyeM, _tmpLeft);
	_M4.multiply(_camera._rightEyeM, _camera._rightEyeM, _tmpRight);
}

function animate() 
{
//	stats.begin();

	render();
	
//	stats.end();
	_animation = requestAnimationFrame( animate );
}

function moveVideo()
{
	if (_engine.paused || _engine.ended) return;
	
	_move._t = (new Date).getTime();	
	
	_move._dt = _move._t - _move._lt;							
	if (_move._dt > _move._moveFPS)
	{
		_move._lt = _move._t;		
		if (_engine.currentTime)
			_video.currentTime = _engine.currentTime;																	
	}
	//console.log(_engine.currentTime + ' vs ' + _video.currentTime);
}

function renderUI(_mesh)
{
	_gl.useProgram(_uiProgram);
	_GL._prepareMesh(_gl, _uiProgram, _mesh);	
	_gl.uniformMatrix4fv(_uiProgram.P._uModel, false, _mesh._modelM);       
	_gl.uniform3fv(_uiProgram.P._uTint, _mesh._tint || [1.0, 1.0, 1.0]);
	_gl.uniform1f(_uiProgram.P._uAlpha, _mesh._alpha);			
	_gl.drawElements(_gl.TRIANGLES, _mesh._buffer.index.numItems, _gl.UNSIGNED_SHORT, 0);	
	_gl.bindTexture(_gl.TEXTURE_2D, null);	
}

function render() 
{
	if ( !_videoProgram ) return;
	//if ( !_state._canplay) return;
	
	_gl.clear( _gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT );
	 
	//if (_engine.readyState >= _video.HAVE_CURRENT_DATA)
	//if (_state._canplay) 
	{		
		if (_state._canplay) 
		{
			if (_state._buffering) _MSG._startMessage('load'); 
			else _MSG._stopMessage('load');
		}
		else
		{
			_MSG._startMessage('load');
		}
	
		_gl.useProgram(_videoProgram);
		
		if (_playConfig.animation)
		{
			_AN._update();
			if (_AN._getM()) _M4.copy(_videoMesh._modelM, _AN._getM());
		}
		else
		{
			//render video
			_controls.update();						
			
			if (_playConfig.type == '2d' && _state._canplay)
			{
				if (!_videoMesh._2dModelM) 
				{					
					_videoMesh._2dModelM = _M4.create();
					_M4.translate(_videoMesh._2dModelM, _videoMesh._2dModelM, [0, 0, -1/Math.tan(_camera._fov/2 * _deg2Rad)]);
					_M4.scale(_videoMesh._2dModelM, _videoMesh._2dModelM, [_playConfig._videoWidth/_playConfig._videoHeight, 1, 1]);
				}  
				_M4.copy(_videoMesh._modelM, _videoMesh._2dModelM);
			}
			else
			{
				//flip the video uv by scaling
				_M4.scale(_videoMesh._modelM, _controls.m, [-1, 1, 1]);
			}				
		}
		
		
		_gl.uniformMatrix4fv(_videoProgram.P._uModel, false, _videoMesh._modelM);	
				
		_GL._prepareMesh(_gl, _videoProgram, _videoMesh);
		
		if (_playConfig.media == 'video')
		{
			_compatConfig._moveVideo && moveVideo();
		
			if (_compatConfig._useCanvas)
			{					
				_videoCanvasCtx.clearRect(0, 0, _videoCanvas.width, _videoCanvas.height);
				//fix a safari bug: https://bugs.webkit.org/show_bug.cgi?id=125157
				try {_videoCanvasCtx.drawImage(_video, 0, 0, _videoCanvas.width, _videoCanvas.height);} catch(e) {}				
			}		
		}			
		
		//console.log(_video.readyState);
		//if (_video.readyState !== _video.HAVE_ENOUGH_DATA) { return; }	
		//_gl.pixelStorei(_gl.UNPACK_FLIP_Y_WEBGL, true);
		
		//_gl.texImage2D(_gl.TEXTURE_2D, 0, _gl.RGBA, _gl.RGBA, _gl.UNSIGNED_BYTE, _videoImg);
		
		if (_videoImg.readyState === undefined || _videoImg.readyState >= 2)
		{
			_gl.texImage2D(_gl.TEXTURE_2D, 0, _gl.RGBA, _gl.RGBA, _gl.UNSIGNED_BYTE, _videoImg);
		}			
//		else
//		{
//			_gl.texImage2D(_gl.TEXTURE_2D, 0, _gl.RGBA, 1, 1, 0, _gl.RGBA, _gl.UNSIGNED_BYTE, _gl._blackImg);
//		}			
		    	    		
		if (_playConfig.vrMode)
		{
			//left eye
			_gl.uniformMatrix4fv(_videoProgram.P._uProjection, false, _camera._leftEyeM);
			_gl.viewport(0, 0, _halfWidth, _height);
			_gl.drawElements(_gl.TRIANGLES, _videoMesh._buffer.index.numItems, _gl.UNSIGNED_SHORT, 0);				    

			_HP._renderHotSpots(renderUI, 'left');
			_gl.useProgram(_videoProgram);
			_GL._prepareMesh(_gl, _videoProgram, _videoMesh);
			
			//right eye			
			_gl.uniformMatrix4fv(_videoProgram.P._uProjection, false, _camera._rightEyeM);
			_gl.viewport( _halfWidth, 0, _halfWidth, _height);
			_gl.drawElements(_gl.TRIANGLES, _videoMesh._buffer.index.numItems, _gl.UNSIGNED_SHORT, 0);
			
			_HP._renderHotSpots(renderUI, 'right');						
		}
		else
		{
			_gl.viewport(0, 0, _width, _height);
			_gl.drawElements(_gl.TRIANGLES, _videoMesh._buffer.index.numItems, _gl.UNSIGNED_SHORT, 0);	
			
			_HP._renderHotSpots(renderUI);  
		}				
	    //gl.drawArrays(gl.POINTS, 0, buffer.vertex.numItems); 		    				
	}
	
	//render watermark
	if (_playConfig.wm && !_playConfig.vrMode) _WM._renderWM(_gl, _width, _height, renderUI);
	
	//render title
	if (_playConfig.title && !_playConfig.vrMode) _TL._renderTitle(_gl, _width, _height, renderUI);
	
	//render message
	_MSG._renderMessage(_gl, _width, _height, renderUI);	
}

function dispose()
{
	if (_playConfig)	
	{
		//save current event listeners for maybe later use
		_EV._on('dispose', _EV._pushState);
		if (_compatConfig._isIframeParent)
		{
			disposeIframe();
		}
		else
		{
			if (_compatConfig._noWebGL && _playConfig.media == 'video')
			{
				disposeBasic();
			}
			else
			{
				disposeMedia();
			}		
		}		
		
		_compatConfig._noWebGL = false;
		_initOptions = {};
	}
}

function disposeMedia()
{
	if (!_div) return;	//return for no init or disposed		
	if (_playConfig && _playConfig.media == 'video' && _playConfig.fullScreen) toggleFullscreen(false);
	_EV._fire('dispose', _engine ? _engine.currentTime : 0);	
		
	if (_controls) _controls._disconnect();	
	cancelAnimationFrame(_animation);
	if (_playConfig && _playConfig.media == 'video') 
	{	
		//do not dispose video when it's not activated
		if (!_compatConfig._activateVideo || (_compatConfig._activateVideo && _videoPlayed)) 
		{
			 _engine.dispose();
			_video.removeAttribute('loop');
			_BT._disposeHLSVideo(_video);
			if (_state && _state._switchTimer) clearTimeout(_state._switchTimer);
		}
	}
	_EV._dispose();	
	_HP._dispose();
	_WM._dispose();	
	_PL._dispose();	

	if (_gl) _GL._dispose(_gl);
	_CTX._dispose();	
	
	if (_container && _container.parentNode) _container.parentNode.replaceChild(_div, _container);			
	_div = undefined;		
}

function disposeBasic()
{
	if (!_div) return;	//return for no init or disposed
	
	_EV._fire('dispose', _engine.currentTime);		
	
	_video.removeAttribute('autoplay');
	_video.removeAttribute('controls');
	_video.removeAttribute('loop');
	_video.pause();
	_container.removeChild(_video);
							
	_engine.dispose();
	
	if (_container && _container.parentNode) _container.parentNode.replaceChild(_div, _container);			
	_div = undefined;	
}

function initIframe()
{	
	_container = _div.cloneNode();
	_div.parentNode.replaceChild(_container, _div);	
	_DOM._setStyle(_container, ';position:relative;cursor:crosshair;overflow:hidden;margin:0;padding:0;');
	_canvas = document.createElement('iframe');
	_canvas.setAttribute('frameborder', 0);
	_canvas.setAttribute('scrolling', 'no');
	_canvas.setAttribute('src', _playConfig._iframeSrc);
	_container.appendChild(_canvas);
	toggleFullscreen(_playConfig.fullScreen);		
}

//function sendIframeResize(e)
//{
//	_canvas.contentWindow.postMessage({t:5}, '*');
//}
function sendIframeMotion(e)
{
	var _msg = {
		t: _IM.T.DM,
		ie: {
		    acceleration: {
		      x: e.acceleration.x,
		      y: e.acceleration.y,
		      z: e.acceleration.z
		    },
		    accelerationIncludingGravity: {
		      x: e.accelerationIncludingGravity.x,
		      y: e.accelerationIncludingGravity.y,
		      z: e.accelerationIncludingGravity.z
		    },
		    rotationRate: {
		      alpha: e.rotationRate.alpha,
		      beta: e.rotationRate.beta,
		      gamma: e.rotationRate.gamma
		    },
		    interval: e.interval,
		    timeStamp: e.timeStamp
		}		
	};
	_canvas.contentWindow.postMessage(_msg, '*');
}

function receiveIframeEvents(e)
{	
	if (e.data.t == _IM.T.TF) toggleFullscreen(e.data.f);
	else if (e.data.t == _IM.T.SS) _EV._fire('screenshot', e.data.d);
	else if (e.data.t == _IM.T.EV) _EV._fire(e.data.et, e.data.e);
	else if (e.data.t == _IM.T.GHSQ) _EV._fire('getHotSpotQuaternion', e.data.q);
	else if (e.data.t == _IM.T.GBF) _EV._fire('getBitratesFormats', e.data.bf); 	
	else if (e.data.t == _IM.T.GM) _EV._fire('getMedia', e.data.m);
	else if (e.data.t == _IM.T.CTAL) CTALink(e.data.l);
	else if (e.data.t == _IM.T.IL) sendIframeInitMessage(); 
}

function bindIframeEvents()
{	
	//window.addEventListener('resize', sendIframeResize, false);
	window.addEventListener('devicemotion', sendIframeMotion, false);	
	window.addEventListener('message', receiveIframeEvents, false);	
}

function disposeIframe()
{
	if (!_div) return;
	
	//window.removeEventListener('resize', sendIframeResize, false);	
	if (_controls) _controls._disconnect();
	window.removeEventListener('devicemotion', sendIframeMotion, false);
	window.removeEventListener('message', receiveIframeEvents, false);	
	
	_canvas.style.display = 'none';
	_compatConfig._isIframe = undefined;
	_compatConfig._isIframeParent = undefined;
	_timestamp = 0;			
	//send dispose event to iframe
	if (_canvas.contentWindow) _canvas.contentWindow.postMessage({t:_IM.T.DPI}, '*');
	
	if (_container && _container.parentNode) _container.parentNode.replaceChild(_div, _container);			
	_div = undefined;				
}

function disposeIframeChild()
{
	dispose();
}

function receiveIframeParentEvents(e)
{
	//var _origin = e.origin || e.originalEvent.origin;
	//alert(_origin + ' vs ' + _videoDomain)
	//if (_origin != _videoDomain) return;
//	if (e.data.t == _IM.T.DM)
//	{
//		var _event = document.createEvent('DeviceMotionEvent');			
//  		_event.initDeviceMotionEvent("devicemotion", false, false, e.data.ie.a, e.data.ie.ag, e.data.ie.r, e.data.ie.i);	      
//		window.dispatchEvent(_event);	      		 
//	} 
	if (e.data.t == _IM.T.SS) screenShot(e.data.w, e.data.h, e.data.y, e.data.o, e.data.q);
	else if (e.data.t == _IM.T.PL) play();
	else if (e.data.t == _IM.T.PA) pause();
	else if (e.data.t == _IM.T.ST) stop(); 
	else if (e.data.t == _IM.T.TG) toggleGyro(e.data.g);
	else if (e.data.t == _IM.T.TV) toggleVR(e.data.v);
	else if (e.data.t == _IM.T.TM) toggleMessage(e.data.m);	
	else if (e.data.t == _IM.T.AHS) addHotSpot(e.data.n, e.data.o);
	else if (e.data.t == _IM.T.RHS) removeHotSpot(e.data.n);
	else if (e.data.t == _IM.T.CHS) commandHotSpot(e.data.n, e.data.c, e.data.a);
	else if (e.data.t == _IM.T.GHSQ) getHotSpotQuaternion(e.data.n);
	else if (e.data.t == _IM.T.GM) getMedia(e.data.a);
	else if (e.data.t == _IM.T.DPI) disposeIframeChild();
	else if (e.data.t == _IM.T.GBF) getBitratesFormats();	
	else if (e.data.t == _IM.T.SBF) switchBitrateFormat(e.data.b, e.data.f); 
}

function init(_play2VRDiv, _key, _options, _callback)
{
//	if (_callback) console.log('peek init');
//	else console.log('init');
	
	if (!_play2VRDiv) _TC._throw('Container not exists');
		
	dispose();
	
//	if (_compatConfig._activateVideo && _callback === undefined) 
//	{
//		console.log('can activate');
//		activateVideo();
//	}
	
	if (_options) _initOptions = _options;

	_timestamp = (new Date).getTime();

	_div = _play2VRDiv;
	_originalDiv = _play2VRDiv;
	
	_move = {
		_t: 0,
		_lt: 0,
		_dt: 0,
		_moveFPS: 1000/20
	};	
	
	_key = _key || _div.getAttribute("play2vr");
	if (!_key) _TC._throw('Video key not exists');
	
	_state = {}; 
		
	_playConfig = _CF._reset(_key);

	_CF._initConfig(_keyDomain, _playConfig, _timestamp, _options && (_options.noPoster || _options.basic), function(){
								
		//bitrates
		_playConfig._bitrateFormatSrc = _BT._getDefaultBitrateFormatSrc(_playConfig); 	
	
		//options
		if (_options)
		{
			if (_options.fullScreen !== undefined) _playConfig.fullScreen = _options.fullScreen;
			if (_options.type !== undefined) _playConfig.type = _options.type;
			if (_options.autoPlay !== undefined) _playConfig.autoPlay = _options.autoPlay;
			
			if (_options.noCTA) _playConfig.CTA = "";
			
			if (_options.noAnimation) _playConfig.animation = "";
			
			if (_options.hotspots) _playConfig.hotspots = _options.hotspots;
			
			if (_options.basic) _compatConfig._noWebGL = true;
			
			if (_options.preserveEvents) _playConfig.preserveEvents = true;
			
			if (_options.skin) _playConfig.skin = 'default';	
			
			if (_options.loop) _playConfig.loop = true;		

			if (_options.debug && console) console.log(_playConfig);			
		}			
				
		if (typeof _callback == 'function') _callback();
		else initConfigCB();
	});	
}

function initVideoStatus()
{
	var _playStatus = parseInt(_playConfig.status);
	if (isNaN(_playStatus) || _playStatus < 1)
	{			
		_div.style.cssText += 'background-image:url("' + _keyDomain + 'image/stop_' + Math.abs(_playStatus) + '.png?' + _timestamp + '");background-size:cover;background-position: 50% 50%';
		return false;
	}
	return true;
}

function initTrack()
{
	if (_playConfig._track)
	{
		_T._trackPV(_playConfig._key);
	
		_EV._on('play', function(_currentTime){_T._trackEvent(_playConfig._key, 'play', _currentTime);});
		_EV._on('pause', function(_currentTime){_T._trackEvent(_playConfig._key, 'pause', _currentTime);});
		_EV._on('toggleVR', function(_vrMode){_T._trackEvent(_playConfig._key, 'vr', _vrMode);});
		_EV._on('toggleGyro', function(_gyro){_T._trackEvent(_playConfig._key, 'gyro', _gyro);});
		_EV._on('toggleFullscreen', function(_fullscreen){_T._trackEvent(_playConfig._key, 'fullscreen', _fullscreen);});
		_EV._on('orientationchange', function(_orientation){_T._trackEvent(_playConfig._key, 'orientation', _orientation);});	
		_EV._on('unload', function(_currentTime){_T._trackEvent(_playConfig._key, 'unload', _currentTime)});	
		_EV._on('dispose', function(_currentTime){_T._trackEvent(_playConfig._key, 'dispose', _currentTime);});
		_EV._on('hotspot', function(_hName){_T._trackEvent(_playConfig._key, 'hotspot', _hName);});
	}
}

function eventIframeInterceptor(_eventType, _event)
{
	window.top.postMessage({t:_IM.T.EV, et:_eventType, e:_event}, '*');
}

function initCORSIframe()
{
	//no CORS support iframe workaround				
	if (_compatConfig._noCORS)
	{
		 if (window == window.top && _playConfig._isCORS) 		//iframe parent
		 {
			_compatConfig._isIframe = false;
			_compatConfig._isIframeParent = true;	

			initIframe(); 
			bindIframeEvents();
			
			return true;			 	
		 }
		 else if (window!=window.top && document.querySelector("body[play2VRIframe]"))	//iframe
		 {
			_compatConfig._isIframe = true;
			_compatConfig._isIframeParent = false;		
			
			window.addEventListener('message', receiveIframeParentEvents);
			
			//send event to parent
			_EV._addInterceptor('iframeInterceptor', eventIframeInterceptor);	
			
			return false; 	
		 }
	}
	else
	{
		return false;
	} 
}

function initBasic()
{
	if (_playConfig.media == 'video') 
	{
		initVideo(); 
		_video.setAttribute('autoplay', ''); 
		_video.setAttribute('controls', '');	
	}
	else if (_playConfig.media == 'image') initImage();			

	_container = _div.cloneNode();
	_div.parentNode.replaceChild(_container, _div);	
	_DOM._setStyle(_container, ';position:relative;overflow:hidden;margin:0;padding:0;');
	_canvas = _video;
	if (_engine.isDisposed()) _engine = new _E(_video);
	
	_DOM._setStyle(_canvas, 'width:100%;');
	_container.appendChild(_canvas);
}

function initConfigCB()
{
	//dispose before config callback handler
	if (!_div || !_div.parentNode) return;

	//restore events 
	if (_playConfig.preserveEvents)
		_EV._popState();
		
	//check WebGL support
	initWebGL();
	if (_compatConfig._noWebGL) {
		initBasic();
		initTrack();
		_EV._fire('load', _playConfig.media);
		return;
	}
	
	//check video status
	if (!initVideoStatus()) return;
	
	initTrack();	
	
	
	//check CORS iframe
	if (!initCORSIframe()) 
	{			
		initPlayer();
		//make sure video is activated		
		if (_playConfig.media == 'video') initVideo();
		else if (_playConfig.media == 'image') initImage();			
				
		_CTX._set('gl', _gl);
		_CTX._set('camera', _camera);
		_CTX._set('controls', _controls);
		
		//only video has skin, call play() after skin loaded
		if (_playConfig.media == 'video')
		{
			_EV._on('loadskin', function(){
				pause(); //add to trigger android play event
				play();
			});		
			loadSkin();		
		}		
		
		//if (_playConfig.media == 'image') processCTA();
		addCTAParsers();		
		//only image has Call-To-Action
		if (_playConfig.media == 'image') 
		{
			var _event = _UA._isTouchDevice?'touchend':'click'; 
			_container.addEventListener(_event, function(){_CTA._processCTA(_playConfig.CTA)}, true);			
		}
		
		if (_playConfig.hotspots && _playConfig.hotspots.length > 0)
		{
			_HP._loadHotSpots(_playConfig.hotspots);
		}
		
		animate();
		//console.log('load');
		_EV._fire('load', _playConfig.media);	
	}
}

function initImage()
{	
	_videoImg = new Image();
	_videoImg.setAttribute("crossorigin", "anonymous");
	function onImgLoad()
	{
  		if (_compatConfig._noWebGL) return;
  		
  	    _GL._renderTexture(_gl, _videoMesh._texture, _videoImg);	
   		_state._canplay = true;
   		
   		//activate image hotspots
   		_HP._updateHotSpots(1);   		
   		
		if (_playConfig.animation) 
		{
			_AN._setup(_playConfig.animation);
			_MSG._startMessage('compass');
		}   				
	}
	
	_videoImg.onload = onImgLoad;		
	//_videoImg.src = _playConfig.src;
	_videoImg.src = _playConfig._bitrateFormatSrc;	
}

function CTAPlay(_key)
{
	//init(_div, _key, {noPoster: true});
	_initOptions['noPoster'] = true;
	_initOptions['preserveEvents'] = true;
	//console.log('cta play');
	init(_div, _key, _initOptions);
}
	
//function CTALink(_url)
//{
//	location.href = _url;
//}
	
function CTALink(_url)
{
	//make it work across iframe
	if (_compatConfig._isIframe) 
	{
		window.top.postMessage({t:_IM.T.CTAL, l: _url}, '*');
		return;
	}

	//open in new window
	if (_UA._isTouchDevice)
	{
		location.href = _url;
	}
	else //PC open in new window
	{
		var _newWin = window.open(_url, 'blank');
		_newWin.location = _url;		
	}
}
	
function CTAEvent(_event)
{
	_EV._fire(_event);
}	
	
function addCTAParsers()
{
	_CTA._addParser('PLAY:', CTAPlay);
	_CTA._addParser('LINK:', CTALink);
	_CTA._addParser('EVENT:', CTAEvent);
}

var _videoPlayed = false;
function activateVideo()	//iOS & Android require first video play initialized by user action
{		
//	if (!_videoPlayed) {
//		try { _video.play(); _video.pause(); } catch (e) {} 
//		_videoPlayed=true;		
//	}	
	//nothing to do in iframe parent
	if (_compatConfig._noCORS && window == window.top && _playConfig && _playConfig._isCORS) return;
	
	//console.log('try activate');
	//nothing to do if the video is playing
	//if (_engine.currentTime > 0 && !_engine.paused && !_engine.ended && _engine.readyState > 2) return;
	 
	if (!_videoPlayed) {
		//console.log('activate');	
		try { 
			_engine.load(); 
			_engine.play(); 
			//only pause when first activate or video should be paused
			if (!_state || (_state && !_state._playing)) pause();
		} catch (e) {
			//console.log('activate Error:' + e);
		}
		_videoPlayed = true;		
	}	
}

var _resizeTimeout;
function resizeThrottler() {
	if ( !_resizeTimeout ) {
    	_resizeTimeout = setTimeout(function() {
        	_resizeTimeout = null;
        	onWindowResize();     
       	}, 66*2);
    }
}

function sendIframeInitMessage()
{
	if (_playConfig.media == 'image') 
		_canvas.contentWindow.postMessage({t:_IM.T.IT, o: _initOptions}, '*');
	else  
		_canvas.contentWindow.postMessage({t:_IM.T.ITOP, o: _initOptions}, '*');
}

//init iframe video if there's poster, or set the initOptions 
function receiveParentInitMessage(e)
{
	if (e.data.t == _IM.T.IT)
	{
		//console.log('it');	
		var _defaultContainer = document.querySelector('div[play2vr]');
		if (_defaultContainer) init(_defaultContainer, undefined, e.data.o);				
	}
	else if (e.data.t == _IM.T.ITOP)
	{
		//console.log('itop');
		_initOptions = e.data.o || {};
	}
}

//peek the playConfig and only init iframe, media=image and pc browsers
function peekInit(_play2VRDiv)
{
	init(_play2VRDiv, undefined, undefined, function(){			
		if (!_compatConfig._activateVideo || _playConfig.media == 'image' || _compatConfig._noCORS)
		{
			initConfigCB();
		}
	});
}

function setup()
{
	_video = document.createElement("video");		
	
	if (_compatConfig._moveVideo)
	{
		_audio = document.createElement("audio");
        _engine = new _E(_audio);        
	}
	else _engine = new _E(_video);
	
	var _event = _UA._isTouchDevice?'touchend':'click'; //use touchend to activate Android Wechat
	
	//add event to each play2vr div
	_divs = document.querySelectorAll('div[play2vr]');
	for (var i=0; i<_divs.length; i++)
	{
		//if (_compatConfig._activateVideo) _divs[i].addEventListener(_event, function(e){ activateVideo(); init(e.target);}, false);	
		//else _divs[i].addEventListener(_event, function(e){init(e.target)}, true);
		_divs[i].addEventListener(_event, function(e){init(e.target)}, true);
	}			
	
	//init the first play2vr div if not in play2vr iframe
	if (!document.querySelector("body[play2VRIframe]")) 
	{
		var _defaultContainer = document.querySelector('div[play2vr]');
		if (_defaultContainer) peekInit(_defaultContainer);
	}
	
	//send iframe load event to parent and receive parent load event
	if (window!=window.top && document.querySelector("body[play2VRIframe]"))
	{
		window.top.postMessage({t:_IM.T.IL}, '*');		
		window.addEventListener('message', receiveParentInitMessage);
	}
		
	window.addEventListener( 'resize', resizeThrottler, false );
	window.addEventListener( 'orientationchange', onOrientationChange, false);
	window.addEventListener( 'unload', onUnload, false);
	window.addEventListener( 'beforeunload', onUnload, false);
			
	if (_compatConfig._activateVideo) window.addEventListener(_event, activateVideo, true);
	//if (_compatConfig._activateVideo) document.body.addEventListener(_event, activateVideo, true);
	
	_DOM._addOrUpdateRule('play2VRContainer', '*[play2vr] {background-size:cover; background-repeat:no-repeat; background-position:center center; cursor:pointer}', true);

}


if (!window['play2VR']) 
{
	window['play2VR'] =  _apiFuncs;
	window['play2VR']['Plugin'] = _PL._plugin;
	_TC._func(setup)();
				
}