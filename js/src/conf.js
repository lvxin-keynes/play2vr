var _DOM = require('./dom');
var _TC = require('./trycatch');

function img2str(_img)
{
	var _str = "";
	var _canvas = document.createElement("canvas");
	_canvas.width = _img.width;
	_canvas.height = _img.height;
	var _ctx = _canvas.getContext("2d");
	_ctx.drawImage(_img, 0, 0);
	var _imgData = _ctx.getImageData(0, 0, _img.width, _img.height);
	for (var i=0; i<_imgData.data.length; i++)
	{
		if (i>0 && i%4 == 3 || _imgData.data[i] == 0) continue;
		_str += String.fromCharCode(_imgData.data[i]);
	}
	return _str;		
}	

function reset(_key)
{
	return {
		_key: _key,
		src: '',
		type: '2d',
		width: 1920,
		height: 960,
		wm: true,
		_track: true,
		vrMode: false,
		fullScreen: false,
		landscapeFullscreen: false,
		landscapeFullscreenVR: false,
		skin: '',
		autoPlay: false,
		loop: false,
		showMessage: true,
		media: 'video',		
		animation: false,
		title: false,
		CTA: false,
		_iframeSrc: '',
		_isCORS: false		
	};
}

function initConfig(_keyDomain, _playConfig, _timestamp, _noPoster, _callback)
{		          
	if (_playConfig._key.length > 0)
	{
		var _keyPath = _keyDomain  + 'img/' + _playConfig._key + ".png?" + _timestamp;
		var _keyImg = new Image();
		_keyImg.setAttribute("crossorigin", "anonymous");
		_keyImg.addEventListener('load', function(e){
			try {
				var _jsonStr = img2str(_keyImg);
				var _keyConf = JSON.parse(_jsonStr);
			} catch (e) {
				_TC._throw('Cannot parse media config: ' + _jsonStr);
			}
			if (_keyConf['key'] === _playConfig._key)
			{
				for (var i in _keyConf)
					if (_keyConf.hasOwnProperty(i))
						_playConfig[i] = _keyConf[i];		
										
				//media setting 
				_playConfig.media = _playConfig.media || 'video'; 
				
				//iframe setting
				_playConfig._isCORS = _DOM._isCORS(_playConfig.src);
				_playConfig.src = _playConfig.src.replace("http://", "//");
				
				//iframe src for video or image
				//_playConfig._iframeSrc = _playConfig.src.toLowerCase().replace('.mp4', '.html').replace('.jpg', '.html').replace('.jpeg', '.html').replace('.png', '.html') + "?" + _timestamp;
				_playConfig._iframeSrc = _playConfig.src.replace(/\.mp4|\.jpg|\.jpeg|\.png/i, '.html') + "?" + _timestamp;
				
				//override for poster settings
				if (!_noPoster && _playConfig['poster']) 
				{
					//poster image have no fhd version
					_playConfig['poster']['urls'] = null;
					override(_playConfig, _playConfig['poster']);
					//in poster mode no controls for hotspots
					delete _playConfig['hotspots'];
				}  
				
				//no title in video mode
				if (_playConfig.media == 'video') _playConfig.title = undefined;

				_callback();										
			}
		});
		_keyImg.addEventListener('error', function(){
			_TC._throw('The media key is not found.');
		});		

		_keyImg.src = _keyPath;		
	}    
}
 
function override(_to, _from)
{
	for (var i in _from)
		if (_from.hasOwnProperty(i))
			_to[i] = _from[i];
			
	return _to;
}

module.exports = {
	_reset: reset,
	_initConfig: initConfig
};