var _EV = require('./event');

var _cuePoints = [];
var _lastTimeIndex = 0, _lastTime = 0;

function update(_time)
{
	var _length = _cuePoints.length;
	if (_length < 1 || _lastTimeIndex > _length-1) return;
	
	//user seek the progress
	if (_time < _lastTime) _lastTimeIndex = 0;
	 
	for (var i=_lastTimeIndex; i<_length; i++)
	{
		//console.log(_time + ' vs ' + _cuePoints[i].t + ', i=' + _lastTimeIndex);
		if (_time >= _cuePoints[i].t)
		{
			_lastTimeIndex = i+1;
			_EV._fire('cuepoint', _cuePoints[i].n);
			break;
		}
	}
	_lastTime = _time;
}

function sortCuePoint(a, b)
{
	return a.t - b.t;
}

function addCuePoint(_name, _time)
{
	_cuePoints.push({n:_name, t:_time});
	_cuePoints.sort(sortCuePoint);
}

function removeCuePoint(_name)
{
	var _idx = -1;
	for (var i=0; i<_cuePoints.length; i++)
	{
		if (_cuePoints[i].n == _name)
		{
			_idx = i;
			break;
		}
	}
	if (_idx > -1) _cuePoints.splice(_idx, 1);	
}

function dispose()
{
	_cuePoints = [];
	_lastTimeIndex = 0;
}

module.exports = {
	_addCuePoint: addCuePoint,
	_removeCuePoint: removeCuePoint,
	_update: update,
	_dispose: dispose
};