var _DOM = require('./dom');
var _TC = require('./trycatch'); 
var _EV = require('./event');

function Plugin(apiFunctions)
{
	this.api = apiFunctions;		
	this.media = apiFunctions.getMedia();
	this.container = apiFunctions.getDiv();
}

Plugin.prototype.init = function()
{
	
}

Plugin.prototype.dispose = function()
{
	
}

var _plugins = {};

function addPlugin(_name, _url)
{
	var _plugin = getPlugin(_name);
	var _promise = {
		then: function(_callback) 
		{
			_EV._once('pluginload_'+_name, function(_plugin){
				_callback(_plugin);
			});
		}
	};

	if (_plugin) {
		_plugin.init();
		_EV._fire('pluginload_'+_name, _plugin);
		return;
	}
	var _className = /(\w+)\.plugin\.js/i.test(_url) ? RegExp.$1 : null;
	if (!_className) _TC._throw('Invalid url. Format: [path]/[name].plugin.js');
		 
	_className = _className.charAt(0).toUpperCase() + _className.substr(1);	 
	_className = _className + "Plugin"; 
	_DOM._loadScript('', _url, function(){
		if (typeof window[_className] != 'function') _TC._throw(_className + ' class not found.');
		_plugin = new window[_className](window['play2VR']);
		if (!(_plugin instanceof window['play2VR']['Plugin'])) _TC._throw(_className + ' must be a subclass of play2VR.Plugin. Use Object.create(play2VR.Plugin.prototype)');		
		_plugin.init();
		_EV._fire('pluginload_'+_name, _plugin);
		_plugins[_name] = _plugin;	
	}, Date.now());
	return _promise;
}

function removePlugin(_name)
{
	var _plugin = getPlugin(_name);
	if (_plugin)
	{
		_plugin.dispose();
		_plugins[_name] = undefined;
	} 
}

function getPlugin(_name)
{
	return _plugins[_name];
}

function dispose()
{
	for (var _name in _plugins)
		if (_plugins.hasOwnProperty(_name))
			_plugins[_name].dispose();
	_plugins = {};
}

module.exports = {
	_plugin: Plugin,
	_addPlugin: addPlugin,
	_removePlugin: removePlugin,
	_getPlugin: getPlugin,
	_dispose: dispose	
}