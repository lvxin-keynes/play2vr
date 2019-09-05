function Engine(_media)
{
//	console.log('new engine:');
//	console.log(_media);

	var _t = this;
	var _props = ['currentTime', 'networkState', 'readyState', 'videoWidth', 'videoHeight', 'poster', 'paused', 'ended', 'muted', 'duration', 'buffered', 'loop', 'seekable'];
	var _eventData = {};	
	var _disposed = false;
	
	var _copyProp = function(_dest, _src, _p)
	{
		Object.defineProperty(_t, _p, {
			get: function(){ return _src[_p]; },
			set: function(_value) { _src[_p] = _value; }
		});						
	};
	
	var _on = function(_type, _listener)
	{
		if (_eventData[_type] == undefined) _eventData[_type] = [];
		_eventData[_type].push(_listener);
	};
	
	var _off = function(_type, _listener)
	{
		if (_eventData[_type] == undefined) _eventData[_type] = [];
		var _idx = _eventData[_type].indexOf(_listener);
		if (_idx > -1) _eventData[_type].splice(_idx, 1);
	};	
	
	var _removeAllEventListeners = function()
	{
		for (var _type in _eventData)
		{
			if (_eventData.hasOwnProperty(_type))
			{
				var _listeners = _eventData[_type];
				for (var i=0; i<_listeners.length; i++)
					_media.removeEventListener(_type, _listeners[i]);	
			}
		}
		_eventData = {};
	}
	
	for (var i=0; i<_props.length; i++)
		_copyProp(_t, _media, _props[i]);		
	
	_t.load = function(){ _media.load(); };
	
	_t.play = function()
	{ 
		//handle promise rejection error in safari 11
		var _promise = _media.play();		
		if (typeof Promise != 'undefined' && _promise instanceof Promise)
		{
			_promise.catch(function(error){
				//console.log('play promise');
				//console.log(error);
			});
		} 
	};
	
	_t.pause = function()
	{ 
		//handle promise rejection error in safari 11
		var _promise = _media.pause();
		if (typeof Promise != 'undefined' && _promise instanceof Promise)
		{
			_promise.catch(function(error){
				//console.log('pause promise');
				//console.log(error);
			});
		} 		 
	};

	_t.addEventListener = function(_type, _listener, _useCapture)
	{
		_on(_type, _listener);
		_media.addEventListener(_type, _listener, _useCapture);	
	};
	
	_t.removeEventListener = function(_type, _listener, _useCapture)
	{
		_off(_type, _listener);
		_media.removeEventListener(_type, _listener, _useCapture);	
	};
		
	_t.dispose = function()
	{
		_removeAllEventListeners();
		if (_media) {
			_media.pause();
			//_media.setAttribute("src", "");
		}		
		
//		for (var i=0; i<_props.length; i++)
//			_t[_props[i]] = undefined;		

		_media = undefined;
		_disposed = true;
	};
	
	_t.isDisposed = function() 
	{ 
		return _disposed ? true : false
	};
}

module.exports = Engine;