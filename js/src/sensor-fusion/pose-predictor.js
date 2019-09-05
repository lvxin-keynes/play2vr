var _MathUtil = require('./math-util');

/**
 * Given an orientation and the gyroscope data, predicts the future orientation
 * of the head. This makes rendering appear faster.
 *
 * Also see: http://msl.cs.uiuc.edu/~lavalle/papers/LavYerKatAnt14.pdf
 *
 * @param {Number} predictionTimeS time from head movement to the appearance of
 * the corresponding image.
 */
function PosePredictor(_predictionTimeS) {
	var _t = this;
    _t._predictionTimeS = _predictionTimeS;

    // The quaternion corresponding to the previous state.
    _t._previousQ = new _MathUtil.Quaternion();
    // Previous time a prediction occurred.
    _t._previousTimestampS = null;

    // The delta quaternion that adjusts the current pose.
    _t._deltaQ = new _MathUtil.Quaternion();
    // The output quaternion.
    _t._outQ = new _MathUtil.Quaternion();
    
    _t._getPrediction = function(_currentQ, _gyro, _timestampS) {
	    if (!_t._previousTimestampS) {
	        _t._previousQ.copy(_currentQ);
	        _t._previousTimestampS = _timestampS;
	        return _currentQ;
	    }
	
	    // Calculate axis and angle based on gyroscope rotation rate data.
	    var _axis = new _MathUtil.Vector3();
	    _axis.copy(_gyro);
	    _axis.normalize();
	
	    var _angularSpeed = _gyro.length();
	
	    // If we're rotating slowly, don't do prediction.
	    if (_angularSpeed < _MathUtil.degToRad * 20) {
	        _t._outQ.copy(_currentQ);
	        _t._previousQ.copy(_currentQ);
	        return _t._outQ;
	    }
	
	    // Get the predicted angle based on the time delta and latency.
	    var _deltaT = _timestampS - _t._previousTimestampS;
	    var _predictAngle = _angularSpeed * _t._predictionTimeS;
	
	    _t._deltaQ.setFromAxisAngle(_axis, _predictAngle);
	    _t._outQ.copy(_t._previousQ);
	    _t._outQ.multiply(_t._deltaQ);
	
	    _t._previousQ.copy(_currentQ);
	    _t._previousTimestampS = _timestampS;
	
	    return _t._outQ;
	};
}


module.exports = PosePredictor;
