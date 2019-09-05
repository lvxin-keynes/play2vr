var _UA = require('./ua');

function loadScript(_base, _src, _callback, _timestamp)
{
	var _s = document.createElement('script');
	document.body.appendChild(_s);		
	
	_s.onload = function() {
		if (typeof _callback == "function") _callback();
		_callback = null;
	};
	_s.onreadystatechange = function() {
		if (_s.readyState == 4 || _s.readyState == "complete") {
			if (typeof _callback == "function") _callback();
			_callback = null;				
		}
	};
	_s.src = _base + _src + '?' + _timestamp;
}

function setStyle(_ele, _cssObjStr)
{
	function trim(_str) {
		return _str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
	};

	var _arr = _cssObjStr.split(';');
	var _cssObj = {};
	for (var i=0; i<_arr.length; i++)
	{
		var _a2 = _arr[i].split(':');
		if (_a2.length === 2) _cssObj[trim(_a2[0])] = trim(_a2[1]);			
	}	
	
	for (var _s in _cssObj)
		if (_cssObj.hasOwnProperty(_s))
			_ele.style[_s] = _cssObj[_s];
}

function addOrUpdateRule(_ruleName, _cssText, _insertBefore)
{
	var _style = document.querySelector('style[id='+_ruleName+']');
	if (!_style)
	{
		_style = document.createElement('style');
	    _style.type = 'text/css';	
	    _style.id = _ruleName;		
	    var _head = document.getElementsByTagName("head")[0];
	    if (_insertBefore) _head.insertBefore( _style, _head.firstChild);
	    else _head.appendChild( _style );    
	}

    if (_style.styleSheet) _style.styleSheet.cssText = _cssText;
    else _style.innerHTML = _cssText;    
};	
	
function hasClass(_el, _className) 
{
	if (!_el) return;
	if (_el.classList)
    	return _el.classList.contains(_className)
	else
    	return !!_el.className.match(new RegExp('(\\s|^)' + _className + '(\\s|$)'))
}	

function addClass(_el, _className) 
{
	if (!_el) return;
  	if (_el.classList) _el.classList.add(_className);
  	else {
  		if (hasClass(_el, _className)) removeClass(_el, _className);
  		_el.className += " " + _className;
  	}
}

function removeClass(_el, _className) 
{
	if (!_el) return;
	if (_el.classList) _el.classList.remove(_className);
	else {
		if (hasClass(_el, _className))
		{
			var _reg = new RegExp('(\\s|^)' + _className + '(\\s|$)')
			_el.className=_el.className.replace(_reg, ' ');		
		}
  	}
}

function addMouseTouchEvent(_ele, _eventName, _cb, _context)
{
	var _callback = function(e)
	{
		if (_UA._isTouchDevice)
		{
			e.preventDefault();
		}
		var _e = e.changedTouches ? e.changedTouches[0] : e||window.event;
		_cb.apply(_context, [_e, e]);			
	};
	_ele.addEventListener(_eventName, _callback, false);	
};	

function removeEvent(_ele, _eventName, _callback)
{
	_ele.removeEventListener(_eventName, _callback, false);
}    	

function getDomainFromURL(_url) 
{
	if (!/http:|https:/i.test(_url)) return "";
    var a = document.createElement('a');
    a.setAttribute('href', _url);
    return a.hostname;
}

function isCORS(_url)
{
	_d = getDomainFromURL(_url);
	if (_d == "") return false;
	
	return location.host != _d; 
}


module.exports = {
	_loadScript: loadScript,
	_setStyle: setStyle,
	_addOrUpdateRule: addOrUpdateRule,
	_hasClass: hasClass,
	_addClass: addClass,
	_removeClass: removeClass,
	_addMouseTouchEvent: addMouseTouchEvent,
	_removeEvent: removeEvent,
	_getDomainFromURL: getDomainFromURL,
	_isCORS: isCORS
};