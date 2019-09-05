var _SensorSample = require('./sensor-sample');
var _MathUtil = require('./math-util');
var _UA = require('../ua');

/**
 * An implementation of a simple complementary filter, which fuses gyroscope and
 * accelerometer data from the 'devicemotion' event.
 *
 * Accelerometer data is very noisy, but stable over the long term.
 * Gyroscope data is smooth, but tends to drift over the long term.
 *
 * This fusion is relatively simple:
 * 1. Get orientation estimates from accelerometer by applying a low-pass filter
 *        on that data.
 * 2. Get orientation estimates from gyroscope by integrating over time.
 * 3. Combine the two estimates, weighing (1) in the long term, but (2) for the
 *        short term.
 */
function ComplementaryFilter(_kFilter) {
    var _t = this;
    _t._kFilter = _kFilter;

    // Raw sensor measurements.
    _t._currentAccelMeasurement = new _SensorSample();
    _t._currentGyroMeasurement = new _SensorSample();
    _t._previousGyroMeasurement = new _SensorSample();

    // Set default look direction to be in the correct direction.
//    if (Util.isIOS()) {
    if (_UA._isIphone) {
        _t._filterQ = new _MathUtil.Quaternion(-1, 0, 0, 1);
    } else {
        _t._filterQ = new _MathUtil.Quaternion(1, 0, 0, 1);
    }
    _t._previousFilterQ = new _MathUtil.Quaternion();
    _t._previousFilterQ.copy(_t._filterQ);

    // Orientation based on the accelerometer.
    _t._accelQ = new _MathUtil.Quaternion();
    // Whether or not the orientation has been initialized.
    _t._isOrientationInitialized = false;
    // Running estimate of gravity based on the current orientation.
    _t._estimatedGravity = new _MathUtil.Vector3();
    // Measured gravity based on accelerometer.
    _t._measuredGravity = new _MathUtil.Vector3();

    // Debug only quaternion of gyro-based orientation.
    _t._gyroIntegralQ = new _MathUtil.Quaternion();
    
	function isTimestampDeltaValid(_timestampDeltaS) {
	    var _minTimeStep = 0.001, _maxTimeStep = 1;
	    if (isNaN(_timestampDeltaS)) return false;
	    if (_timestampDeltaS <= _minTimeStep) return false;
	    if (_timestampDeltaS > _maxTimeStep) return false;
	    return true;
	};    
    
    _t._addAccelMeasurement = function(_vector, _timestampS) {
	    _t._currentAccelMeasurement.set(_vector, _timestampS);
	};
	
	_t._addGyroMeasurement = function(_vector, _timestampS) {
	    _t._currentGyroMeasurement.set(_vector, _timestampS);
	
	    var _deltaT = _timestampS - _t._previousGyroMeasurement._timestampS;
	    if (isTimestampDeltaValid(_deltaT)) _t._run();
	
	    _t._previousGyroMeasurement.copy(_t._currentGyroMeasurement);
	};
	
	_t._run = function() {

	    if (!_t._isOrientationInitialized) {
	        _t._accelQ = _t._accelToQuaternion(_t._currentAccelMeasurement._sample);
	        _t._previousFilterQ.copy(_t._accelQ);
	        _t._isOrientationInitialized = true;
	        return;
	    }
	
	    var _deltaT = _t._currentGyroMeasurement._timestampS - _t._previousGyroMeasurement._timestampS;
	
	    // Convert gyro rotation vector to a quaternion delta.
	    var _gyroDeltaQ = _t._gyroToQuaternionDelta(_t._currentGyroMeasurement._sample, _deltaT);
	    _t._gyroIntegralQ.multiply(_gyroDeltaQ);
	
	    // filter_1 = K * (filter_0 + gyro * dT) + (1 - K) * accel.
	    _t._filterQ.copy(_t._previousFilterQ);
	    _t._filterQ.multiply(_gyroDeltaQ);
	
	    // Calculate the delta between the current estimated gravity and the real
	    // gravity vector from accelerometer.
	    var _invFilterQ = new _MathUtil.Quaternion();
	    _invFilterQ.copy(_t._filterQ);
	    _invFilterQ.inverse();
	
	    _t._estimatedGravity.set(0, 0, -1);
	    _t._estimatedGravity.applyQuaternion(_invFilterQ);
	    _t._estimatedGravity.normalize();
	
	    _t._measuredGravity.copy(_t._currentAccelMeasurement._sample);
	    _t._measuredGravity.normalize();
	
	    // Compare estimated gravity with measured gravity, get the delta quaternion
	    // between the two.
	    var _deltaQ = new _MathUtil.Quaternion();
	    _deltaQ.setFromUnitVectors(_t._estimatedGravity, _t._measuredGravity);
	    _deltaQ.inverse();
	
	    // Calculate the SLERP target: current orientation plus the measured-estimated
	    // quaternion delta.
	    var _targetQ = new _MathUtil.Quaternion();
	    _targetQ.copy(_t._filterQ);
	    _targetQ.multiply(_deltaQ);
	
	    // SLERP factor: 0 is pure gyro, 1 is pure accel.
	    _t._filterQ.slerp(_targetQ, 1 - _t._kFilter);
	
	    _t._previousFilterQ.copy(_t._filterQ);
	};
	
	_t._getOrientation = function() {
	    return _t._filterQ;
	};
	
	_t._accelToQuaternion = function(_accel) {
	    var _normAccel = new _MathUtil.Vector3();
	    _normAccel.copy(_accel);
	    _normAccel.normalize();
	    var _quat = new _MathUtil.Quaternion();
	    _quat.setFromUnitVectors(new _MathUtil.Vector3(0, 0, -1), _normAccel);
	    _quat.inverse();
	    return _quat;
	};
	
	_t._gyroToQuaternionDelta = function(_gyro, _dt) {
	    // Extract axis and angle from the gyroscope data.
	    var _quat = new _MathUtil.Quaternion();
	    var _axis = new _MathUtil.Vector3();
	    _axis.copy(_gyro);
	    _axis.normalize();
	    _quat.setFromAxisAngle(_axis, _gyro.length() * _dt);
	    return _quat;
	};
	
}

module.exports = ComplementaryFilter;