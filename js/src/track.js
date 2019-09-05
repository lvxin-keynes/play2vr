var _cookieName = 'play2VR',
	_doc = document, _win = window, _nav = navigator, _scr = screen,
	_initTime = (new Date).getTime(),
	_uid = getUID();
	
var _trackUrl = '//data.play2vr.com/0.gif';

function setCookie(_cookieName, _value, _daysToExpire, _path, _domain, _secure) {
	var _expiryDate;

	if (_daysToExpire) {
		_expiryDate = new Date();
		_expiryDate.setTime(_expiryDate.getTime() + _daysToExpire * 8.64e7);
	}

	_doc.cookie = _cookieName + '=' + encodeURIComponent(_value) +
		                  (_daysToExpire ? ';expires=' + _expiryDate.toGMTString() : '') +
		                  ';path=' + (_path ? _path : '/') +
		                  (_domain ? ';domain=' + _domain : '') +
		                  (_secure ? ';secure' : '');
}

function getCookie(_cookieName) {
	var _cookiePattern = new RegExp('(^|;)[ ]*' + _cookieName + '=([^;]*)'),
		_cookieMatch = _cookiePattern.exec(_doc.cookie);				
	return _cookieMatch ? decodeURIComponent(_cookieMatch[2]) : 0;
}

function getReferrer() {
//	var _referrer = '';
//	try {
//		_referrer = top.document.referrer;
//	} catch (e) {
//		if (parent) {
//			try {
//				_referrer = parent.document.referrer;
//			} catch (e2) {
//				_referrer = '';
//			}
//		}
//	}
//	if (_referrer === '') {
//		_referrer = _doc.referrer;
//	}
//
//	return _referrer;
	return _doc.referrer;
}

function getDomain()
{
	var _domain = _doc.domain, _cookieDomain = "";
	
	if (/^\\d{1,3}\.\\d{1,3}\.\\d{1,3}\.\\d{1,3}$/.test(_domain))
	{	
		_cookieDomain = _domain;
	}
	else
	{
		var _temp = _domain.split(".");
		var _tempLength = _temp.length;
		if (_tempLength > 3)
			_domain = _temp[_tempLength-3] + "." + _temp[_tempLength-2] + "." + _temp[_tempLength-1];
		else if (_tempLength > 2)
		    _domain = _temp[_tempLength-2] + "." + _temp[_tempLength-1];
		_cookieDomain = _domain;					
	}
	return _cookieDomain;
}

function getUID()
{
	var _uid = getCookie(_cookieName);
	if (typeof _uid == 'undefined' || _uid == 0) _uid = Math.floor(Math.random() * 2147483647) + "." + (_initTime & 2147483647);
	setCookie(_cookieName, _uid, 365, null, getDomain());
	return _uid;
}

function getTime()
{
	return (new Date()).getTime() - _initTime;
}

function trackPV(_key)
{
	var _PVString = "?key=" + _key + 
		"&urlref=" + encodeURIComponent(getReferrer()) +
		"&url=" + encodeURIComponent(_win.location.href) +
		"&title=" + encodeURIComponent(_doc.title || "") + 
		"&uid=" + _uid + 
		"&t=" + _initTime + 
		"&cookie=" + (_nav.cookieEnabled ? 1 : 0)  +
		"&res=" + _scr.width + 'x' + _scr.height + 
		"&userAgent=" + encodeURIComponent(_nav.userAgent) +
		"&lang=" + encodeURIComponent(_nav.language || _nav.userLanguage || "");
	
	sendImage(_trackUrl + _PVString);	
}

function trackEvent(_key, _name, _value)
{
	var _eventString = "?key=" + _key + 
		"&url=" + encodeURIComponent(_win.location.href) + 
		"&uid=" + _uid + 
		"&t=" + getTime() + 
		"&event=" + _name;

	if (_value !== undefined) _eventString += "&value=" + _value; 
		
	sendImage(_trackUrl + _eventString);	
}

function sendImage(_url)
{
	new Image().src = _url;
}

module.exports = {
	_trackPV: trackPV,
	_trackEvent: trackEvent
};