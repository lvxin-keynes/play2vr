function wrapFunction(_func)
{
	var _decorator = function()
	{
		_errors = [];
		try 
		{
			return _func.apply(this, arguments);	
		} 
		catch (e)
		{
			if (e instanceof RangeError)
			{
				error('[play2VR] Invalid Argument: ' + e.message);
				error(e.stack);			
			}
			else if (e instanceof TypeError || e instanceof ReferenceError)
			{
				error('[play2VR] Runtime: ' + e.message);
				if (e.message.indexOf('undefined') > 0)
					error('[play2VR] Player not ready. Try play2VR.init(...) or play2VR.on("load", [your function])');
				error(e.stack);				
			}
			else 
				throw e;
		}
		
		for (var i=0; i<_errors.length; i++)
			error(_errors[i].name + ': ' + e.message);
	};
	return _decorator;
}

function wrapObj(_obj)
{
	var _tmp = {};
	for (var n in _obj)
	{
		if (_obj.hasOwnProperty(n))
		{
			if (typeof _obj[n] == 'function')
				_tmp[n] = wrapFunction(_obj[n]);
			else 
				_tmp[n] = _obj[n];

		}
	}
	return _tmp;
}

function throwError(_msg)
{
	_msg = '[play2VR] Runtime: ' + _msg;
	var _e = new Error(_msg);	
	error(_msg);
	error(_e.stack);
	throw _e;
}

function error(_msg)
{
	if (console) console.log(_msg);
}

module.exports = {
	_func: wrapFunction,
	_obj: wrapObj,
	_throw: throwError
};