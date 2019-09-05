function SensorSample(_sample, _timestampS) {
    var _t = this;
    
    _t.set = function(_sample, _timestampS) {
	    _t._sample = _sample;
	    _t._timestampS = _timestampS;
	};
	
	_t.copy = function(_sensorSample) {
	    _t.set(_sensorSample._sample, _sensorSample._timestampS);
	};	    
	
	_t.set(_sample, _timestampS);	
};

module.exports = SensorSample;
