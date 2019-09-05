var M4 = require('../../utils/node_modules/gl-mat4');
var UA = require('./ua');
var	T = require('../../utils/node_modules/@hughsk/fulltilt/dist/fulltilt.min');
//require('./debug/console').init();

function VRControls(options)
{
	this.m = M4.create();
	this.noTransform = M4.create();
	this.element = options.element || document;
	
	this.fov = options.fov || (UA._isTouchDevice?110:90);
	
	this.width = options.width || window.innerWidth;
	this.height = options.height || window.innerHeight;
	
	this.enableMouse = (UA._isTouchDevice ? false : true) || options.enableMouse || options.enableAll;
	this.enableTouch = (UA._isTouchDevice ? true : false) || options.enableTouch || options.enableAll;
	this.enableGyro = (UA._isTouchDevice ? true : false) || options.enableGyro || options.enableAll;
	
	this.minTilt = options.minTilt || -90;
	this.maxTilt = options.maxTilt || 90;
	this.initTilt = options.initTilt || 0;
	this.tilt = this.initTilt;
	
	this.minPan = options.minPan || 0;
	this.maxPan = options.maxPan || 360;
	this.initPan = options.initPan || 0;
	this.pan = this.initPan;
	
	this.reverseDragDir = -1;
	
	var $t = this;
	
	var angleToRadian = Math.PI/180;
	
	var _calculateFOVUnit = function()
	{
		return $t.height/(2 * Math.tan( $t.fov / 2 * angleToRadian));
	}	
	
	var fovUnit = _calculateFOVUnit();
	
	var gyroPromise, deviceOrientation, deviceOrientationData, deviceOrientationQuat;
	
	var mousedown = false;
	var _mousedown = function(e)
	{
		$t.x = $t.lastX = e.clientX;
		$t.y = $t.lastY = e.clientY;
		mousedown = true;
	};
	
	var _mousemove = function(e)
	{
		if (mousedown)
		{								
			$t.x = e.clientX;
			$t.y = e.clientY;
			
			$t.pan = $t.pan + Math.atan(($t.x - $t.lastX)/fovUnit) / angleToRadian * $t.reverseDragDir;
			_clampPan();			
			
			$t.tilt = $t.tilt - Math.atan(($t.y - $t.lastY)/fovUnit) / angleToRadian * $t.reverseDragDir;
			_clamp($t.tilt, $t.minTilt+1, $t.maxTilt-1);
						
			$t.lastX = $t.x;
			$t.lastY = $t.y;	
			
			//console.log($t.pan + ',' + $t.tilt);	
		}
	};	
	
	var _mouseup = function(e)
	{
		mousedown = false;
	};
	
	var _addEvent = function(ele, eventName, callback, context)
	{
		var _callback = function(e)
		{
			if (UA._isTouchDevice)
			{
				e.preventDefault();
				//e.stopPropagation();
			}
			var _e = e.changedTouches ? e.changedTouches[0] : e||window.event;
			callback.apply(context, [_e, e]);			
		};
		ele.addEventListener(eventName, _callback, false);	
	};	
	
	var _removeEvent = function(ele, eventName, callback)
	{
		ele.removeEventListener(eventName, callback, false);
	}
	
	var _clamp = function(val, min, max)
	{
		if (val < min) val = min;
		if (val > max) val = max;
	};
	
	var _clampPan = function()
	{
		$t.pan %= 360;
		if ($t.pan < 0) $t.pan += 360;
	};
	
	var _invertQuat = function(out, a)
	{
	    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
	        dot = a0*a0 + a1*a1 + a2*a2 + a3*a3,
	        invDot = dot ? 1.0/dot : 0;
	    
	    out[0] = -a0*invDot;
	    out[1] = -a1*invDot;
	    out[2] = -a2*invDot;
	    out[3] = a3*invDot;
	    return out;	
	};
		
	this.connect = function()
	{
		if (this.enableMouse)
		{
			_addEvent(this.element, "mousedown", _mousedown);
			_addEvent(this.element, "mousemove", _mousemove);
			_addEvent(this.element, "mouseup", _mouseup);
			_addEvent(this.element, "mouseout", _mouseup);
		}	
		
		if (this.enableTouch)
		{
			_addEvent(this.element, "touchstart", _mousedown);
			_addEvent(this.element, "touchmove", _mousemove);
			_addEvent(this.element, "touchend", _mouseup);
		}
		
		if (this.enableGyro)
		{
			gyroPromise = new T.getDeviceOrientation({ type: "world" });    

			gyroPromise.then(function(c){
				deviceOrientation = c; 
			}).catch(function(e){ alert(e); });
			
			setTimeout(function(){
				deviceOrientation && deviceOrientation.start();		
			}, 200);			
		}
	};
	
	this.disconnect = function()
	{
		if (this.enableMouse)
		{
			_removeEvent(this.element, "mousedown", _mousedown);
			_removeEvent(this.element, "mousemove", _mousemove);
			_removeEvent(this.element, "mouseup", _mouseup);
		}	
		
		if (this.enableTouch)
		{
			_removeEvent(this.element, "touchstart", _mousedown);
			_removeEvent(this.element, "touchmove", _mousemove);
			_removeEvent(this.element, "touchend", _mouseup);
		}	
		
		if (this.enableGyro)
		{
			deviceOrientation && deviceOrientation.stop();
		}
	}
	
	this.update = function()
	{
		if (deviceOrientation)
		{
			deviceOrientationData = deviceOrientation.getScreenAdjustedQuaternion();
			deviceOrientationData.rotateX(this.tilt * angleToRadian);
			deviceOrientationQuat = [deviceOrientationData.x, deviceOrientationData.y, deviceOrientationData.z, deviceOrientationData.w];
			_invertQuat(deviceOrientationQuat, deviceOrientationQuat);
			M4.fromQuat(this.m, deviceOrientationQuat);
		    M4.rotateX(this.m, this.m, Math.PI/2);
		    M4.rotateY(this.m, this.m, -Math.PI/2);		     	
		    M4.rotateY(this.m, this.m, this.pan * angleToRadian);
		
		}
		else		
		{
			M4.copy(this.m, this.noTransform);
			M4.rotateX(this.m, this.m, -this.tilt * angleToRadian);
            M4.rotateY(this.m, this.m, (this.pan+90) * angleToRadian);
		}
	}
}

module.exports = VRControls;