var _ComplementaryFilter = require('./complementary-filter');
var _PosePredictor = require('./pose-predictor');
var _TouchPanner = require('./touch-panner');
var _MathUtil = require('./math-util');

var _UA = require('../ua');
var _M4 = require('../../../utils/node_modules/gl-mat4');
var _IM = require('../iframemessage');

/**
 * The pose sensor, implemented using DeviceMotion APIs.
 */
function FusionPoseSensor(_config) {
	var _t = this;
    _t._element = _config._element;
    _t._width = _config._width;
    _t._height = _config._height;
    _t._kFilter = _config._kFilter || 0.98;
    _t._preditionTimeS = _config._preditionTimeS || 0.040;

    _t._enableTouch = _UA._isTouchDevice ? (_config._enableTouch !== undefined ? _config._enableTouch : true) : true;
    _t._enableGyro = _config._enableGyro !== undefined ? _config._enableGyro : true;
    _t._yawOnly = _config._yawOnly;
    _t._iframeMotion = _config._iframeMotion;
    
    _t._accelerometer = new _MathUtil.Vector3();
    _t._gyroscope = new _MathUtil.Vector3();

    _t._filter = new _ComplementaryFilter(_t._kFilter);
    _t._posePredictor = new _PosePredictor(_t._preditionTimeS);
    _t._touchPanner = new _TouchPanner(_config);

    _t._filterToWorldQ = new _MathUtil.Quaternion();										//OS-dependent     
    _t._filterToWorldQ.setFromAxisAngle(new _MathUtil.Vector3(0, 1, 0), -Math.PI/2);

	//adjust quaternion for mobile deivces, iOS is different from Android
    _t._mobileQ = new _MathUtil.Quaternion();
    _t._mobileQ.setFromAxisAngle(new _MathUtil.Vector3(1, 0, 0), (_UA._isIphone ? Math.PI/2 : -Math.PI/2));
    
    _t._inverseWorldToScreenQ = new _MathUtil.Quaternion();								//reverse window orientation quaternion
    
    //_t._worldToScreenQ = new _MathUtil.Quaternion();									//window orientation quaternion
    _t._worldToScreenQ = new _MathUtil.Quaternion(0,0,0,1);									//window orientation quaternion
    
    _t._originalPoseAdjustQ = new _MathUtil.Quaternion();								//original pose reset quaternion
    _t._originalPoseAdjustQ.setFromAxisAngle(new _MathUtil.Vector3(0, 0, 1), -window.orientation * Math.PI/180);

    // Keep track of a reset transform for resetSensor.
    _t._resetQ = new _MathUtil.Quaternion();

    _t._isFirefoxAndroid = _UA._isFirefox && _UA._isAndroid;
    //_t._isIOS = _UA._isIphone || _UA._isAndroid;
    

    _t._orientationOut = new Float32Array(4);
    
    _t._getOrientation = function() {
	    var _out = new _MathUtil.Quaternion();
		
	    if (!_UA._isTouchDevice)
	    {
    	    _out.copy(_t._filterToWorldQ);
    	    _out.multiply(_t._touchPanner._getOrientation());
	    }
	    else
	    {		
		    // Convert to THREE coordinate system: -Z forward, Y up, X right.	    
		    _out.copy(_t._filterToWorldQ);
		    //_out.multiply(_t._resetQ);
		    	    	    
		    if (_t._enableGyro)
		    {	
			    // Convert from filter space to the the same system used by the deviceorientation event.
			    var _orientation = this._filter._getOrientation();
			
			    // Predict orientation.
			    _t._predictedQ = _t._posePredictor._getPrediction(_orientation, _t._gyroscope, _t._previousTimestampS);
		 		 
		    	_out.multiply(_t._mobileQ);
		    	_out.multiply(_t._predictedQ);
		    	_out.multiply(_t._worldToScreenQ);
		    }

		    if (_t._enableTouch)
		    {
		    	_t._touchPanner._getOrientation();
		    	_out.multiply(_t._touchPanner._phiQ);
		    	_out.premultiply(_t._touchPanner._thetaQ);
		    }	    		    
		      		    
	    }
	
	    // Handle the yaw-only case.
	    if (_t._yawOnly) {
	        // Make a quaternion that only turns around the Y-axis.
	        _out.x = 0;
	        _out.z = 0;
	        _out.normalize();
	    }
	    
		//the camera quaternion should be inserved to be used in projection matrix	    
	    _out.inverse();
	
	    _t._orientationOut[0] = _out.x;
	    _t._orientationOut[1] = _out.y;
	    _t._orientationOut[2] = _out.z;
	    _t._orientationOut[3] = _out.w;
	    return _t._orientationOut;
	};
	
	_t._resetPose = function() {
	    // Reduce to inverted yaw-only.
	    _t._resetQ.copy(_t._filter._getOrientation());
	    _t._resetQ.x = 0;
	    _t._resetQ.y = 0;
	    _t._resetQ.z *= -1;
	    _t._resetQ.normalize();
	
	    // Take into account extra transformations in landscape mode.
	    if (Math.abs(window.orientation) == 90)  _t._resetQ.multiply(_t._inverseWorldToScreenQ);
	
	    // Take into account original pose.
	    _t._resetQ.multiply(_t._originalPoseAdjustQ);
	
	    if (_t._enableTouch) _t._touchPanner._resetSensor();
	};
	
	_t._onDeviceMotionChange = function(_deviceMotion) {		
	    var _accGravity = _deviceMotion.accelerationIncludingGravity;
	    var _rotRate = _deviceMotion.rotationRate;
	    var _timestampS = _deviceMotion.timeStamp / 1000;
	
	    // Firefox Android timeStamp returns one thousandth of a millisecond.
	    if (_t._isFirefoxAndroid) _timestampS /= 1000;
	
	    var _deltaS = _timestampS - _t._previousTimestampS;
	    var _minTimeStep = 0.001, _maxTimeStep = 1;
	    if (_deltaS <= _minTimeStep || _deltaS > _maxTimeStep) {
			//gyroscope sensor samples is very small or not monotonic
	        _t._previousTimestampS = _timestampS;
	        return;
	    }
	    _t._accelerometer.set(-_accGravity.x, -_accGravity.y, -_accGravity.z);
	    _t._gyroscope.set(_rotRate.alpha, _rotRate.beta, _rotRate.gamma);
	
	    // With iOS and Firefox Android, rotationRate is reported in degrees,
	    // so we first convert to radians.
	    //if (_t._isIOS || _t._isFirefoxAndroid) _t._gyroscope.multiplyScalar(Math.PI / 180);
	    
	    //iOS and Android, rotationRate is reported in degrees
	    if (_UA._isIphone || _UA._isAndroid) _t._gyroscope.multiplyScalar(Math.PI / 180);	    
	
	    _t._filter._addAccelMeasurement(_t._accelerometer, _timestampS);
	    _t._filter._addGyroMeasurement(_t._gyroscope, _timestampS);
	
	    _t._previousTimestampS = _timestampS;
	};	
	
//	_t._setScreenTransform = function() {
//	    _t._worldToScreenQ.set(0, 0, 0, 1);
//	    switch (window.orientation) {
//	        case 0:
//	            break;
//	        case 90:
//	            _t._worldToScreenQ.setFromAxisAngle(new _MathUtil.Vector3(0, 0, 1), -Math.PI / 2);
//	            break;
//	        case -90:
//	            _t._worldToScreenQ.setFromAxisAngle(new _MathUtil.Vector3(0, 0, 1), Math.PI / 2);
//	            break;
//	        case 180:
//	            // TODO.
//	            break;
//	    }
//	    _t._inverseWorldToScreenQ.copy(_t._worldToScreenQ);
//	    _t._inverseWorldToScreenQ.inverse();
//	};	

	_t._setScreenTransform = function() {
	    _t._worldToScreenQ.setFromAxisAngle(new _MathUtil.Vector3(0, 0, 1), -window.orientation * _MathUtil.degToRad);
	    
	    _t._inverseWorldToScreenQ.copy(_t._worldToScreenQ);
	    _t._inverseWorldToScreenQ.inverse();
	};	
	
	_t._onScreenOrientationChange = function(_screenOrientation) {
	    _t._setScreenTransform();
	};
	
	_t._connect = function() {	    	
	    if (_t._iframeMotion) window.addEventListener('message', _t._onIframeMotion);
	    else window.addEventListener('devicemotion', _t._onDeviceMotionChange);
	    
	    window.addEventListener('orientationchange', _t._onScreenOrientationChange);
	    
	    _t._touchPanner._connect();	    
	};
	
	_t._disconnect = function() {
		if (_t._iframeMotion) window.removeEventListener('message', _t._onIframeMotion); 
	    else window.removeEventListener('devicemotion', _t._onDeviceMotionChange);
	    _t._iframeMotion = false;
	    
	    window.removeEventListener('orientationchange', _t._onScreenOrientationChange);
	    
	    _t._touchPanner._disconnect();
	};
	
	_t._onIframeMotion = function(e) {
		if (e.data.t == _IM.T.DM)
			_t._onDeviceMotionChange(e.data.ie);						
	};
		
	_t.update = function()
	{
		_t.m = _t.m || _M4.create();
		_t._getOrientation();
		_M4.fromQuat(_t.m, _t._orientationOut);
	};	
	
	_t._setScreenTransform();
    // Adjust this filter for being in landscape mode.    
    //if (Math.abs(window.orientation) == 90) _t._filterToWorldQ.multiply(_t._inverseWorldToScreenQ);
    if (Math.abs(window.orientation) == 90) _t._mobileQ.multiply(_t._inverseWorldToScreenQ);	
}

module.exports = FusionPoseSensor;