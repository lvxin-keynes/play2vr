var _Easing = {
	Linear: function (k) { 
		return k; 
	},
	EaseInQuat: function(k) {
		return k * k;
	},
	EaseOutQuat: function(k) {
		return k * (2 - k);	
	}	
};

var _Interpolation = {
	Linear: function (v, k) {
		var m = v.length - 1;
		var f = m * k;
		var i = Math.floor(f);
		var fn = function (p0, p1, t) { return (p1 - p0) * t + p0; };

		if (k < 0) return fn(v[0], v[1], f);
		if (k > 1)  return fn(v[m], v[m - 1], m - f);

		return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
	}
};	

function now()
{
	return (new Date).getTime();
}

function Tween(object)
{
	var _object = object;
	var _valuesStart = {};
	var _valuesEnd = {};
	var _valuesStartRepeat = {};
	var _duration = 1000;
	var _repeat = 0;
	var _repeatDelayTime;
	var _isPlaying = false;
	var _delayTime = 0;
	var _startTime = null;
	var _easingFunction = _Easing.Linear;
	var _interpolationFunction = _Interpolation.Linear;
	var _onUpdateCallback = null;
	var _onCompleteCallback = null;
	var _onStopCallback = null;
	
	var _t = this;
	
	_t._to = function (properties, duration) {
		_valuesEnd = properties;
		if (duration !== undefined) {
			_duration = duration;
		}
		return _t;
	};

	_t._start = function (time) {
		_isPlaying = true;

		_startTime = time !== undefined ? time : now();
		_startTime += _delayTime;

		for (var property in _valuesEnd) {

			// Check if an Array was provided as property value
			if (_valuesEnd[property] instanceof Array) {

				if (_valuesEnd[property].length === 0) {
					continue;
				}

				// Create a local copy of the Array with the start value at the front
				_valuesEnd[property] = [_object[property]].concat(_valuesEnd[property]);

			}

			// If `to()` specifies a property that doesn't exist in the source object,
			// we should not set that property in the object
			if (_object[property] === undefined) {
				continue;
			}

			// Save the starting value.
			_valuesStart[property] = _object[property];

			if ((_valuesStart[property] instanceof Array) === false) {
				_valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
			}

			_valuesStartRepeat[property] = _valuesStart[property] || 0;

		}
		
		return _t;
	};

	_t._stop = function () {
		if (!_isPlaying) {
			return _t;
		}

		_isPlaying = false;

		if (_onStopCallback !== null) {
			_onStopCallback.call(_object, _object);
		}

		return _t;
	};

	_t._end = function () {
		_t._update(_startTime + _duration);
		return _t;
	};

	_t._delay = function (amount) {
		_delayTime = amount;
		return _t;
	};

	_t._repeat = function (times) {
		_repeat = times;
		return _t;
	};

	_t._repeatDelay = function (amount) {
		_repeatDelayTime = amount;
		return _t;
	};

	_t._easing = function (_easingName) {
		_easingFunction = _Easing[_easingName];
		return _t;
	};

	_t._interpolation = function (_interpolationName) {
		_interpolationFunction = _Interpolation[_interpolationName];
		return _t;
	};

	_t._onUpdate = function (callback) {
		_onUpdateCallback = callback;
		return _t;
	};

	_t._onComplete = function (callback) {
		_onCompleteCallback = callback;
		return _t;
	};

	_t._onStop = function (callback) {
		_onStopCallback = callback;
		return _t;
	};

	_t._update = function (time) {
		var property;
		var elapsed;
		var value;
		
		if (!time) time = now();

		if (time < _startTime) {
			return true;
		}

		elapsed = (time - _startTime) / _duration;
		elapsed = elapsed > 1 ? 1 : elapsed;

		value = _easingFunction(elapsed);
		
		for (property in _valuesEnd) {

			// Don't update properties that do not exist in the source object
			if (_valuesStart[property] === undefined) {
				continue;
			}

			var start = _valuesStart[property] || 0;
			var end = _valuesEnd[property];

			if (end instanceof Array) {

				_object[property] = _interpolationFunction(end, value);

			} else {

				// Parses relative end values with start as base (e.g.: +10, -3)
				if (typeof (end) === 'string') {

					if (end.charAt(0) === '+' || end.charAt(0) === '-') {
						end = start + parseFloat(end);
					} else {
						end = parseFloat(end);
					}
				}

				// Protect against non numeric properties.
				if (typeof (end) === 'number') {
					_object[property] = start + (end - start) * value;
				}

			}

		}

		if (_onUpdateCallback !== null) {
			_onUpdateCallback.call(_object, value);
		}

		if (elapsed === 1) {

			if (_repeat > 0) {

				if (isFinite(_repeat)) {
					_repeat--;
				}

				// Reassign starting values, restart by making startTime = now
				for (property in _valuesStartRepeat) {

					if (typeof (_valuesEnd[property]) === 'string') {
						_valuesStartRepeat[property] = _valuesStartRepeat[property] + parseFloat(_valuesEnd[property]);
					}

					_valuesStart[property] = _valuesStartRepeat[property];

				}

				if (_repeatDelayTime !== undefined) {
					_startTime = time + _repeatDelayTime;
				} else {
					_startTime = time + _delayTime;
				}

				return true;

			} else {

				if (_onCompleteCallback !== null) {
					_onCompleteCallback.call(_object, _object);
				}

				return false;
			}
		}
		return true;
	};
}

module.exports = Tween;