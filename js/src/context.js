var _context = {};

function set(_name, _obj)
{
	_context[_name] = _obj;
}

function get(_name)
{
	return _context[_name];
}

function dispose()
{
	_context = {};
}

module.exports = {
	_set: set,
	_get: get,
	_dispose: dispose
};