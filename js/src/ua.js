var _nav = navigator, _ua = _nav.userAgent, _appName = _nav.appName;
var UA = {
	_isWechat: /MicroMessenger/i.test(_ua),
	_isIphone: /iPhone|iPod/i.test(_ua),
	_isAndroid: /Android|Linux/i.test(_ua),
	_isX5: /MQQBrowser/i.test(_ua),
	_isTouchDevice: 'ontouchstart' in document.documentElement,
	_iOSVersion: /OS (\d+)_(\d+)_?(\d+)?/.test(_nav.appVersion) ? parseInt(RegExp.$1) : -1,
	_webkitVersion: /AppleWebKit\/(\d+.\d)/i.test(_ua) ? parseInt(RegExp.$1) : -1,
	//_isIE: _appName == 'Microsoft Internet Explorer' ||  !!(_ua.match(/Trident/) || _ua.match(/rv 11/)) || (typeof $ != 'undefined' && $.browser.msie == 1),
	_isIE: _appName == 'Microsoft Internet Explorer' ||  !!(_ua.match(/Trident/) || _ua.match(/rv 11/)),
	_isFirefox: /Firefox/i.test(_ua),
	_isSafari: /^((?!chrome|android).)*safari/i.test(_ua),
	_safariVersion: /Version\/(\d+.\d)/i.test(_ua) ? parseInt(RegExp.$1) : -1,
	_isMac: /Mac/.test(_nav.appVersion),
	_isEdge: /Edge\/\d+/.test(_ua)
};

module.exports = UA;
