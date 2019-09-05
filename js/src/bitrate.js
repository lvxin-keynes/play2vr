var _UA = require('./ua');
var _DOM = require('./dom');

var _nativeHLS = nativeHLS();
var _softwareHLS = softwareHLS();
var _softwareHLSSrc = '//v2.play2vr.com/js/lib/hls.light.min.js';

function getBitratesFormats(_playConfig)
{
	function addSet(_value, _set)
	{
		for (var i=0; i<_set.length; i++)
			if (_set[i] === _value)
				return;
		_set.push(_value);
	}

	var _formats = [], _bitrates = [], _result = {
		bitrates: _bitrates,
		formats: _formats,		
		bitrate: _playConfig.bitrate || 'fhd',
		format: _playConfig.format || 'mp4'
	}; 
	if (!_playConfig.urls) return _result;
	for (var i=0; i<_playConfig.urls.length; i++)
	{
		var _temp = _playConfig.urls[i].split('_');
		if (_temp.length == 2)
		{
			addSet(_temp[0], _formats);
			addSet(_temp[1], _bitrates);
		}
	}		
	return _result;
}

function getBitrateFormatSrc(_playConfig, _bitrate, _format)
{
	_playConfig.bitrate = _bitrate || _playConfig.bitrate;
	_playConfig.format = _format || _playConfig.format;
	
	if (!_playConfig.bitrate || !_playConfig.format) return _playConfig.src;

	var _currentBitRatePath = '/';	
	var _bitratePath = '';
	if (_playConfig.media == 'video')
		_bitratePath = '/'+ _playConfig.format + '_' + _playConfig.bitrate + '/' + _playConfig._key + '.' + _playConfig.format;
	else if (_playConfig.media == 'image')
		_bitratePath = '/'+ _playConfig.bitrate + '/' + _playConfig._key + '.' + _playConfig.format;
	var _newSrc = _playConfig.src.substring(0, _playConfig.src.lastIndexOf(_currentBitRatePath)) + _bitratePath;
	return _newSrc;
}

function getDefaultBitrateFormatSrc(_playConfig)
{
	if (_playConfig.media == 'video')
	{
		var _bitratesFormats = getBitratesFormats(_playConfig);
		var _bitrateFormat = suggestBitrateFormat(_bitratesFormats.bitrates, _bitratesFormats.formats);
		return getBitrateFormatSrc(_playConfig, _bitrateFormat.bitrate, _bitrateFormat.format);
	}
	else if (_playConfig.media == 'image')
	{
		if (!_playConfig.urls) return _playConfig.src;
		
		var _imageSrc = _playConfig.src;
		//img is hard coded
		var _imageBitrate = 'img_fhd';
		var _imageFormat = 'jpg';
		
		return getBitrateFormatSrc(_playConfig, _imageBitrate, _imageFormat);
	}
}

function suggestBitrateFormat(_videoBitRates, _videoFormats)
{
	function findFirstMatch(_inputs, _inputs2)
	{
		for (var i=0; i<_inputs.length; i++)
		{
			for (var j=0; j<_inputs2.length; j++)
			{
				if (_inputs[i] === _inputs2[j])
					return _inputs[i]; 
			}
		}
		return null;
	}

	var _bitrates = ['fhd', 'hd'], _formats = ['mp4', 'img'];

	if (_nativeHLS || _softwareHLS)
		_formats.unshift('m3u8');		
		
	return {
		format: findFirstMatch(_formats, _videoFormats),
		bitrate: findFirstMatch(_bitrates, _videoBitRates)
	}	
}

function nativeHLS()
{
	var _nativeHLS = false;
	var _video = document.createElement('video');
	if (_video.canPlayType('application/vnd.apple.mpegurl'))
	{
		_nativeHLS = true;
	}
	return _nativeHLS;
}

function softwareHLS()
{
	var _mediaSource = window.MediaSource || window.WebKitMediaSource;
	var _sourceBuffer = window.SourceBuffer || window.WebKitSourceBuffer;
	var _isTypeSupported = _mediaSource && typeof _mediaSource.isTypeSupported === 'function' 
							&& _mediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"');
	var _sourceBufferValidAPI = !_sourceBuffer ||
    (_sourceBuffer.prototype && typeof _sourceBuffer.prototype.appendBuffer === 'function' && typeof _sourceBuffer.prototype.remove === 'function');
	
	return !!_isTypeSupported && !!_sourceBufferValidAPI;								
}

function wrapHLSVideo(_video, _m3u8Path)
{
	function wrapCallback()
	{					
    	var _hls = new window['Hls']();
    	_hls.loadSource(_m3u8Path);
    	_hls.attachMedia(_video);
    	_hls.on(window['Hls'].Events.MANIFEST_PARSED, function() {
      		_video.play();
    	});
    	_video._hls = _hls;
    	//console.log('wrap video: ' + _m3u8Path);		
	}

	disposeHLSVideo(_video);

	if (window['Hls']) wrapCallback();
	else _DOM._loadScript('', _softwareHLSSrc, wrapCallback, 0);
}

function disposeHLSVideo(_video)
{
	if (!_video._hls) return;

	//console.log('disposeHLSVideo');
	_video._hls.detachMedia(_video);
	_video._hls.destroy();
}

module.exports = {
	_getBitratesFormats: getBitratesFormats,
	_suggestBitrateFormat: suggestBitrateFormat,
	_getBitrateFormatSrc: getBitrateFormatSrc,
	_getDefaultBitrateFormatSrc: getDefaultBitrateFormatSrc,
	_isSoftwareHLS: !_nativeHLS && _softwareHLS,
	_wrapHLSVideo: wrapHLSVideo,
	_disposeHLSVideo: disposeHLSVideo
}

 