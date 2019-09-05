var _MathUtil = require('./math-util');
var _UA = require('../ua');
var _DOM = require('../dom');

/**
 * Provides a quaternion responsible for pre-panning the scene before further
 * transformations due to device sensors.
 */
function TouchPanner(_config) {
	var _t = this;
	var _EPS = 0.000001;
    _t._isTouching = false;
    _t._isMoving = false;
    _t._rotateStart = new _MathUtil.Vector2();
    _t._rotateEnd = new _MathUtil.Vector2();
    _t._rotateDelta = new _MathUtil.Vector2();

    _t._theta = 0;
    _t._phi = 0;
    _t._deltaTheta = 0;
    _t._deltaPhi = 0;
    _t._deltaFactor = 0.55;
    _t._orientation = new _MathUtil.Quaternion();
    _t._thetaQ = new _MathUtil.Quaternion();
    _t._phiQ = new _MathUtil.Quaternion();
    _t._xVector = new _MathUtil.Vector3(1, 0, 0);
    _t._yVector = new _MathUtil.Vector3(0, 1, 0);
    
    _t._element = _config._element || document;    
    _t._width = _config._width || window.innerWidth;
    _t._height = _config._height || window.innerHeight;
    _t._speed = _config._touchSpeed || 0.3;   
	
	function clamp(_val, _min, _max)
	{
		if (_val < _min) _val = _min;
		if (_val > _max) _val = _max;
		return _val;
	}	 
	
	function mousedown(e)
	{
	    _t._rotateStart.set(e.pageX, e.pageY);
	    _t._isTouching = true;	
	}
	
	function mousemove(e)
	{
	    if (!_t._isTouching) return;
	    _t._rotateEnd.set(e.pageX, e.pageY);
	    _t._rotateDelta.subVectors(_t._rotateEnd, _t._rotateStart);
	    _t._rotateStart.copy(_t._rotateEnd);
	    
	    //damping animation
	    _t._deltaTheta += 2 * Math.PI * _t._rotateDelta.x / _t._height * _t._speed;
	    _t._deltaPhi += 2 * Math.PI * _t._rotateDelta.y / _t._height * _t._speed;	    	        	
	}
	
	function mouseup(e)
	{
		_t._isTouching = false;
	}
	
    _t._connect = function()
    {    
	    _DOM._addMouseTouchEvent(_t._element, "mousedown", mousedown);
	    _DOM._addMouseTouchEvent(_t._element, "mousemove", mousemove);
	    _DOM._addMouseTouchEvent(_t._element, "mouseup", mouseup);
	    _DOM._addMouseTouchEvent(_t._element, "mouseout", mouseup);    
    
	    _DOM._addMouseTouchEvent(_t._element, 'touchstart', mousedown);
	    _DOM._addMouseTouchEvent(_t._element, 'touchmove', mousemove);
	    _DOM._addMouseTouchEvent(_t._element, 'touchend', mouseup);    
    };
    
    _t._disconnect = function()
    {
	    _DOM._removeEvent(_t._element, "mousedown", mousedown);
	    _DOM._removeEvent(_t._element, "mousemove", mousemove);
	    _DOM._removeEvent(_t._element, "mouseup", mouseup);
	    _DOM._removeEvent(_t._element, "mouseout", mouseup);    
    
	    _DOM._removeEvent(_t._element, 'touchstart', mousedown);
	    _DOM._removeEvent(_t._element, 'touchmove', mousemove);
	    _DOM._removeEvent(_t._element, 'touchend', mouseup);     	
    }
    
//    _t._getOrientation = function() {
//    
//	    _t._theta += _t._deltaTheta;
//	    _t._phi += _t._deltaPhi;	    
//	    	    
//		_t._deltaTheta *= _t._deltaFactor;
//		_t._deltaPhi *= _t._deltaFactor;  	
//		
//		_t._phi = clamp(_t._phi, -Math.PI/2 + _EPS, Math.PI/2 - _EPS);		  
//    	
//	    _t._orientation.setFromEulerYXZ(_t._phi, _t._theta, 0);
//	    _t._orientation.normalize();
//
//	    return _t._orientation;
//    };

    _t._getOrientation = function() {
    
	    _t._theta += _t._deltaTheta;
	    _t._phi += _t._deltaPhi;	    
	    	    
		_t._deltaTheta *= _t._deltaFactor;
		_t._deltaPhi *= _t._deltaFactor;  	
		
		if (_t._theta > Math.PI * 2) _t._theta -= Math.PI * 2;
		else if (_t._theta < 0) _t._theta += Math.PI * 2;
		
		_t._phi = clamp(_t._phi, -Math.PI/2 + _EPS, Math.PI/2 - _EPS);		  
    	
	    _t._orientation.setFromEulerYXZ(_t._phi, _t._theta, 0);
	    _t._orientation.normalize();
	    
	    _t._thetaQ.setFromAxisAngle(_t._yVector, _t._theta);
	    _t._phiQ.setFromAxisAngle(_t._xVector, _t._phi);

	    return _t._orientation;
    };
    
    _t._resetSensor = function()
    {
	    _t._theta = 0;
	    _t._phi = 0;
		_t._deltaTheta = 0;
		_t._deltaPhi = 0;	    	    
    };
}

module.exports = TouchPanner;