var _parsers = {};

function parseCTA(_cta)
{
	for (var i in _parsers)
		if (_parsers.hasOwnProperty(i) && _cta.substring(0, i.length) == i)
			return {a: i, v: _cta.substring(i.length) };
}

function addParser(_command, _function)
{
	_parsers[_command] = _function;
}

function processCTA(_cta)
{
	var _CTA = parseCTA(_cta);
	if (_CTA && _CTA.a && _CTA.v)
	{
		_parsers[_CTA.a](_CTA.v);
	}
}

module.exports = {
	_addParser: addParser,
	_processCTA: processCTA	
}