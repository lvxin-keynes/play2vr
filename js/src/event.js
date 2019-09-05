var _eventData = {};
var _interceptors = {};
var _stack = [], _stackLength = 3;

function registerEvent(_eventType)
{
	if (_eventData[_eventType] == undefined) _eventData[_eventType] = [];
}

function on(_eventType, _callback)
{
	registerEvent(_eventType);
	_eventData[_eventType].push(_callback);
}

function off(_eventType, _callback)
{
	registerEvent(_eventType);	
	var _idx = _eventData[_eventType].indexOf(_callback);
	if (_idx > -1) _eventData[_eventType].splice(_idx, 1);	
}

function once(_eventType, _callback)
{
	registerEvent(_eventType);
	_eventData[_eventType] = [_callback];
}

function one(_eventType, _callback)
{
	_callback._one = true;
	registerEvent(_eventType);
	_eventData[_eventType] = [_callback];	
}

function fire(_eventType, _event)
{
	registerEvent(_eventType);
	var _callbacks = _eventData[_eventType];
	for (var i=0; i<_callbacks.length; i++)
	{
		try {
			if (_callbacks[i]._one)
			{
				if (!_callbacks[i]._oneDone)
				{
					_callbacks[i](_event);
					_callbacks[i]._oneDone = true;
				}
			}			
			else {
				_callbacks[i](_event);
			}
		} catch (e) {
			console.error(e);
		}
	}
	
	//post interceptor
	for (var _name in _interceptors)
		if (_interceptors.hasOwnProperty(_name))
			_interceptors[_name](_eventType, _event);
}

function addInterceptor(_name, _function)
{
	if (typeof _function == 'function')
		_interceptors[_name] = _function;
}

function removeInterceptor(_name)
{
	delete _interceptors[_name];
}

function pushState()
{
	_stack.push({
		e: _eventData,
		i: _interceptors
	});
		
	//limit stack length
	if (_stack.length > _stackLength)
		_stack = _stack.slice(0, _stackLength);
}

function popState()
{
	var _state = _stack.pop();
	if (_state)
	{
		_eventData = _state.e;
		_interceptors = _state.i;
	}
	
}

function dispose()
{
	_eventData = {};
	_interceptors = {};
}

module.exports = {
	_on: on,
	_off: off,
	_fire: fire,
	_once: once,
	_one: one,
	_addInterceptor: addInterceptor,
	_removeInterceptor: removeInterceptor,
	_pushState: pushState,
	_popState: popState,
	_dispose: dispose
};