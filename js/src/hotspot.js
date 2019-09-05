var _CTX = require('./context');
var _M4 = require('../../utils/node_modules/gl-mat4');
var _EV = require('./event');
var _G = require('./geometry');
var _GL = require('./gl');
var _UA = require('./ua');
var _DOM = require('./dom');
var _MA = require('./sensor-fusion/math-util');
var _TW = require('./tween');
var _CTA = require('./cta');
var _TC = require('./trycatch');

var _hotSpots = {}, _hotSpotsLength = 0;
var _projectionViewM = _M4.create();
var _element, _isTouching;

function HotSpot(_name, _options)
{
	var _t = this;
	_t._name = _name;
	_t._img = _options.img;
	_t._width = _options.width || 0.5;
	_t._height = _options.height || 0.5;
	_t._scaleX = parseFloat(_options.scaleX) || 1;
	_t._scaleY = parseFloat(_options.scaleY) || 1;
	_t._visible = _options.visible;
	_t._lastVisible = _t._visible;	
	_t._interactive = _options.interactive;
	_t._animation = _options.animation || 'none';
	
	_t._controlDisplay = _options.controlDisplay; 
	_t._start = _options.start || 0;
	_t._end = _options.end || 7200;
	_t._q = _options.q;
	_t._CTA = _options.CTA;
	
	_t._imgWidth = 0;
	_t._imgHeight = 0;
	_t._loaded = false;
	_t._mesh = undefined;
	
	var _canvas, _ctx;
	
	function initMesh(_loadedImg)
	{		
		_canvas = document.createElement('canvas');	
		_ctx = _canvas.getContext('2d');		
		
		var _gl = _CTX._get('gl');
		//if (!_gl) _TC._throw('player not loaded. Try play2VR.on("load", [your function])'); 		
		
		var _mesh = _GL._createMesh(_gl, _G._getGeometry(_G.T._PLANE));	
		
		_mesh._posM = _M4.create();
		_mesh._inversePosM = _M4.create();
		_mesh._modelM = _M4.create(); 
		_mesh._tint = [1, 1, 1];
		_mesh._alpha = 1.0;		
		
//		_M4.copy(_mesh._posM, _t._pos);
//		_M4.translate(_mesh._posM, _mesh._posM, [0, 0, 8]);

		if (_t._q && _t._q.length == 4)
		{
			_t._modelQ = [_t._q[0], _t._q[1], _t._q[2], _t._q[3]];
		}
		else 
		{
			var _controls = _CTX._get('controls'), _controlsQ = _controls._orientationOut;		 	
			_t._modelQ = [-_controlsQ[0], -_controlsQ[1], -_controlsQ[2], _controlsQ[3]];			
		}
		_M4.fromQuat(_mesh._posM, _t._modelQ);
		_M4.translate(_mesh._posM, _mesh._posM, [0, 0, -8]);		
		_M4.scale(_mesh._posM, _mesh._posM, [_t._scaleX,_t._scaleY,1]);				
    	
    	_t._boundingBox = _G._computeBoundingBox(_mesh._geometry);
    	_t._mesh = _mesh;
    	
//		_t._loaded = true;    				
	}
	
	function loadImg(_img)
	{
		_t._img = _img || _t._img;
		if (typeof _t._img == 'string')
		{
			var _img = new Image();
			_img.setAttribute("crossorigin", "anonymous");
			_img.onload = _t._updateImage.bind(_t, _img);
			
			//avoid cache for url			
			if (/^(http|https)/i.test(_t._img))
				_t._img += '?' + Math.random();
			
			_img.src = _t._img;
		}
		else if (_t._img instanceof HTMLImageElement)
		{
			if (!_t._img.src || !_t._img.complete)
				_t._img.onload = _t._updateImage.bind(_t, _t._img);
		}		
	}	
	
	_t._show = function() 
	{
		_t._visible = true;				
	};
	
	_t._hide = function() 
	{
		_t._visible = false;
	};
	
	_t._active = function()
	{
		_EV._fire('hotspot', _t._name);
	};

	_t._updateImage = function(_img)
	{
		//if (!_t._visible) return;		
		_t._img = _img || _t._img;
		
		_t._imgWidth = _t._img.width;
		_t._imgHeight = _t._img.height;
		
		_t._width = _t._imgWidth;
		_t._height = _t._imgHeight;	
		
		_canvas.width = _t._width;
		_canvas.height = _t._height;		
	
		_t._loaded = true;
				
		_ctx.drawImage(_t._img, 0, 0, _t._imgWidth, _t._imgHeight, 0, 0, _t._width, _t._height);
		_GL._renderTexture(_CTX._get('gl'), _t._mesh._texture, _canvas);		
	}	
	
	_t._updateScale = function(_scaleX, _scaleY)
	{
		_M4.scale(_t._mesh._posM, _t._mesh._posM, [1/_t._scaleX, 1/_t._scaleY, 1]);
	
		_t._scaleX = parseFloat(_scaleX) || _t._scaleX;
		_t._scaleY = parseFloat(_scaleY) || _t._scaleY;	
			
		_M4.scale(_t._mesh._posM, _t._mesh._posM, [_t._scaleX, _t._scaleY, 1]);		
	}
	
	_t._update = function()
	{
		if (!_t._loaded || !_t._visible) return false;
		
		if (_t._tween) _t._tween._update();
		
		//_M4.lookAt(_t._mesh._rotationM, _t._pos, [0,0,0], [0,1,0]);
		//_M4.multiply(_t._mesh._modelM, _t._mesh._posM, _t._mesh._rotationM);
		_M4.copy(_t._mesh._modelM, _t._mesh._posM);
		_M4.multiply(_t._mesh._modelM, _projectionViewM, _t._mesh._modelM);		  
		return true;
	}; 
	
	function intersectBox(_box, _origin, _dir)
	{
		var _tmin, _tmax, _tymin, _tymax, _tzmin, _tzmax;

		var _invdirx = 1 / _dir.x,
			_invdiry = 1 / _dir.y,
			_invdirz = 1 / _dir.z;

		if ( _invdirx >= 0 ) {

			_tmin = ( _box.min.x - _origin.x ) * _invdirx;
			_tmax = ( _box.max.x - _origin.x ) * _invdirx;

		} else {

			_tmin = ( _box.max.x - _origin.x ) * _invdirx;
			_tmax = ( _box.min.x - _origin.x ) * _invdirx;

		}

		if ( _invdiry >= 0 ) {

			_tymin = ( _box.min.y - _origin.y ) * _invdiry;
			_tymax = ( _box.max.y - _origin.y ) * _invdiry;

		} else {

			_tymin = ( _box.max.y - _origin.y ) * _invdiry;
			_tymax = ( _box.min.y - _origin.y ) * _invdiry;

		}

		if ( ( _tmin > _tymax ) || ( _tymin > _tmax ) ) return false;

		// These lines also handle the case where tmin or tmax is NaN
		// (result of 0 * Infinity). x !== x returns true if x is NaN

		if ( _tymin > _tmin || _tmin !== _tmin ) _tmin = _tymin;

		if ( _tymax < _tmax || _tmax !== _tmax ) _tmax = _tymax;

		if ( _invdirz >= 0 ) {

			_tzmin = ( _box.min.z - _origin.z ) * _invdirz;
			_tzmax = ( _box.max.z - _origin.z ) * _invdirz;

		} else {

			_tzmin = ( _box.max.z - _origin.z ) * _invdirz;
			_tzmax = ( _box.min.z - _origin.z ) * _invdirz;

		}

		if ( ( _tmin > _tzmax ) || ( _tzmin > _tmax ) ) return false;

		if ( _tzmin > _tmin || _tmin !== _tmin ) _tmin = _tzmin;

		if ( _tzmax < _tmax || _tmax !== _tmax ) _tmax = _tzmax;

		//return point closest to the ray (positive side)

		if ( _tmax < 0 ) return false;

		return true;	
	}
	
	_t._raycast = function(_origin, _dir)
	{	
		//origin: camera position, dir: touch point vector to user, point: hotspot position	
		if (!_t._interactive || !_t._loaded || !_t._visible) return;		
								
		var _m = _M4.invert(_t._mesh._inversePosM, _t._mesh._posM); 
		
		//apply inverse transform to ray
		_dir.add( _origin ).applyMatrix4( _m );
		_origin.applyMatrix4( _m );
		_dir.sub( _origin ).normalize();
		//console.log(_dir);
		
		var _intersect = intersectBox(_t._boundingBox, _origin, _dir);
		if (_intersect)
		{
			_EV._fire('hotspot', _t._name);
			if (_t._CTA) _CTA._processCTA(_t._CTA);
		}				
	};	
	
	_t._startAnimation = function(_animationName)
	{		
		var _growAnimationModel = _M4.copy(_M4.create(), _t._mesh._posM);
		function growAnimation()
		{
			_t._tween = new _TW({s: 0.8, a:1})._to({s: [1, 0.9], a: [1, 0.8, 0.2]}, 800)._onUpdate(function(){
				//_M4.scale(_t._mesh._posM, _growAnimationModel, [this.s, this.s, this.s]);
				_t._mesh._alpha = this.a;			
			})._onStop(function(){
				//_M4.copy(_t._mesh._posM, _growAnimationModel);
				_t._mesh._alpha = 1;
			})._repeat(Infinity)._start();		
		}
		
		function glowAnimation()
		{			
			_t._tween = new _TW({g:1})._to({g: [1.2, 2.5, 1]}, 800)._onUpdate(function(){
				_t._mesh._tint = [this.g, this.g, this.g];
			})._onStop(function(){
				_t._mesh._tint = [1, 1, 1];
			})._repeat(Infinity)._start();
		}

		_t._stopAnimation();		

		if (_animationName) _t._animation = _animationName;
		if (_t._animation == 'grow') growAnimation();
		else if (_t._animation == 'glow') glowAnimation();		
	}
	
	_t._stopAnimation = function()
	{
		if (_t._tween) 
		{			
			_t._tween._stop();
			_t._tween = undefined;
		}				
	}	
	
	_t._setTime = function(_start, _end)
	{
		_t._start = _start;
		_t._end = _end;
	}
	
	loadImg();
	initMesh();
	
	_t._API = {
		show: _t._show,
		hide: _t._hide,
		active: _t._active,
		updateImage: loadImg,
		startAnimation: _t._startAnimation,
		stopAnimation: _t._stopAnimation,
		//getQuaternion: _t._getQuaternion,
		setTime: _t._setTime,
		updateScale: _t._updateScale
	};
}

function count()
{
	var _counter = 0;	
	for (_name in _hotSpots)
		if (_hotSpots.hasOwnProperty(_name) && _hotSpots[_name] instanceof HotSpot) _counter++;
		
	_hotSpotsLength = _counter;
}

function addHotSpot(_name, _options)
{	
	_hotSpots[_name] = new HotSpot(_name, _options);
	count();
}

function removeHotSpot(_name)
{
	if (_hotSpots[_name]) delete _hotSpots[_name];
	count();
}

//function getHotSpotByName(_name)
//{
//	var _hotspot = _hotSpots[_name];
//	if (!_hotspot) return undefined;
//	return _hotspot._API;
//}

function getHotSpotQuaternion(_name)
{
	var q = [0, 0, 0, 0];
	var _hotspot = _hotSpots[_name];
	if (_hotspot) q = [_hotspot._modelQ[0], _hotspot._modelQ[1], _hotspot._modelQ[2], _hotspot._modelQ[3]];
	return q;
}

function commandHotSpot(_name, _command, _args)
{
	if (_args) _args = _args instanceof Array ? _args : [_args];
	var _hotspot = _hotSpots[_name];	
	if (_hotspot)
	{
		for (var i in _hotspot._API)
		{
			if (_hotspot._API.hasOwnProperty(i))
			{
				if (_command === i)
				{
					_hotspot._API[i].apply(_hotspot, _args);
					break;
				}
			}
		}
	}
}

function updateHotSpots(_currentTime)
{
	for (var _name in _hotSpots)
	{
		if (_hotSpots.hasOwnProperty(_name))
		{
			var _h = _hotSpots[_name];
			if (_h._controlDisplay) continue; 			
			_h._visible = _h._start <= _currentTime && _h._end >= _currentTime ? true : false; 
			
			//control hotspot animation
			if (_h._visible != _h._lastVisible)
			{
				if (_h._visible) _h._startAnimation(_h._animation);
				else _h._stopAnimation();
				
				_h._lastVisible = _h._visible;				
			}			
		}
	}
}

function loadHotSpots(_hotspots)
{
	for (var i=0; i<_hotspots.length; i++)
		addHotSpot(_hotspots[i].name, _hotspots[i]);
}

function renderHotSpots(_renderFunc, _projectType)
{
	if (_hotSpotsLength < 1) return;

	var _camera = _CTX._get('camera'), _controls = _CTX._get('controls');
	
	var _projectionM = _camera._projectionM;
	if (_projectType == 'left') _projectionM = _camera._leftEyeM;
	else if (_projectType == 'right') _projectionM = _camera._rightEyeM;
	
	_M4.multiply(_projectionViewM, _projectionM, _camera._viewM);
	if (_controls.m) _M4.multiply(_projectionViewM, _projectionViewM, _controls.m);		

	for (var _name in _hotSpots)
		if (_hotSpots.hasOwnProperty(_name) && _hotSpots[_name]._update())
			_renderFunc(_hotSpots[_name]._mesh);		
}



function raycast(e)
{
	if (_hotSpotsLength < 1) return;

	var _camera = _CTX._get('camera'), _controls = _CTX._get('controls');

	var _box = _element.getBoundingClientRect();
	var _scrollX = window.scrollX || 0, _scrollY = window.scrollY || 0;
	var _coords = {};
	_coords.x = (e.pageX-_scrollX-_box.left)/_box.width * 2 - 1;
	_coords.y =  -(e.pageY-_scrollY-_box.top)/_box.height * 2 + 1;
	
	//console.log(_coords.x + ',' + _coords.y);

	//M^V^P^ = (PVM)^		
	var _unProjectM = _M4.create();
	_M4.multiply(_unProjectM, _camera._projectionM, _camera._viewM);	
	if (_controls.m) _M4.multiply(_unProjectM, _unProjectM, _controls.m);
	_M4.invert(_unProjectM, _unProjectM);
						
	var _origin = new _MA.Vector3(_camera._pos[0], _camera._pos[1], _camera._pos[2]);
	var _dir = new _MA.Vector3(_coords.x, _coords.y, -1).applyProjection(_unProjectM).sub(_origin).normalize();
	
	//console.log(_dir);
	for (var _name in _hotSpots)
		if (_hotSpots.hasOwnProperty(_name))
			_hotSpots[_name]._raycast(new _MA.Vector3().copy(_origin), new _MA.Vector3().copy(_dir));	

	
}

function connect(_ele)
{
	_element = _ele;
    _DOM._addMouseTouchEvent(_element, "mousedown", raycast);
    _DOM._addMouseTouchEvent(_element, 'touchstart', raycast);
}

function disconnect()
{
	if (!_element) return;
    _DOM._removeEvent(_element, "mousedown", raycast);
    _DOM._removeEvent(_element, 'touchstart', raycast);
}

function dispose()
{
	disconnect();
	
	_hotSpots = {};
	_hotSpotsLength = 0;
}

module.exports = {
	_connect: connect,
	_addHotSpot: addHotSpot,
	_removeHotSpot: removeHotSpot,
//	_getHotSpotByName: getHotSpotByName,
	_commandHotSpot: commandHotSpot,
	_getHotSpotQuaternion: getHotSpotQuaternion,		
	_renderHotSpots: renderHotSpots,
	_updateHotSpots: updateHotSpots,
	_loadHotSpots: loadHotSpots,
	_dispose: dispose	
};