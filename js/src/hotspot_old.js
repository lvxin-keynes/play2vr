var _CTX = require('./context');
var _M4 = require('../../utils/node_modules/gl-mat4');
var _EV = require('./event');
var _G = require('./geometry');
var _GL = require('./gl');
var _UA = require('./ua');
var _DOM = require('./dom');
var _MA = require('./sensor-fusion/math-util');

var _hotSpots = {}, _hotSpotsLength = 0;
var _projectionViewM = _M4.create();
var _element, _isTouching;

function HotSpot(_name, _options)
{
	var _t = this;
	_t._name = _name;
	_t._img = _options.img;
	_t._pos = _options.pos;
	_t._width = _options.width || 0.5;
	_t._height = _options.height || 0.5;
	_t._visible = _options.visible;	
	_t._interactive = _options.interactive;
	
	_t._imgWidth = 0;
	_t._imgHeight = 0;
	_t._loaded = false;
	_t._mesh = undefined;
	
	var _canvas, _ctx;
	
	function initMesh(_loadedImg)
	{
		var _img = _loadedImg;
		
		_t._imgWidth = _img.width;
		_t._imgHeight = _img.height;
		
		var _imgRatio = _img.width/_img.height;
		
		_t._width = _t._imgWidth;
		_t._height = _t._imgHeight;
		
		_canvas = document.createElement('canvas');
		_canvas.width = _t._width;
		_canvas.height = _t._height;
		_ctx = _canvas.getContext('2d');
		_ctx.drawImage(_img, 0, 0, _t._imgWidth, _t._imgHeight, 0, 0, _t._width, _t._height);
				
		//_t._img = _canvas;		
		
		var _gl = _CTX._get('gl');
		var _mesh = _GL._createMesh(_gl, _G._getGeometry(_G.T._PLANE));	
		
		_mesh._posM = _M4.create();
		_mesh._inversePosM = _M4.create();
		_mesh._rotationM = _M4.create();
		_mesh._modelM = _M4.create(); 
		
		
		_t._pos = [_t._pos[0]*_G.C._radius, (0-_t._pos[1])*_G.C._radius, _t._pos[2]*_G.C._radius];
		var _scaleFactor = _G.C._radius / 3;
		_t._scale = [-_scaleFactor, _scaleFactor/_imgRatio, 1];
		//console.log(_t._scale);
		
		_M4.rotateY(_mesh._posM, _mesh._posM, -Math.PI/2);
		_M4.translate(_mesh._posM, _mesh._posM, _t._pos);
		_M4.scale(_mesh._posM, _mesh._posM, _t._scale);
		
		_M4.invert(_mesh._inversePosM, _mesh._posM);		
		   
    	_mesh._alpha = 1.0;
    	
    	_GL._renderTexture(_gl, _mesh._texture, _canvas);
    	
    	_t._boundingBox = _G._computeBoundingBox(_mesh._geometry);
    	_t._mesh = _mesh;
   		
    	
		_t._loaded = true;    	
	}

	function loadImg()
	{
		if (typeof _t._img == 'string')
		{
			var _img = new Image();
			_img.setAttribute("crossorigin", "anonymous");
			_img.onload = initMesh.bind(undefined, _img);
			_img.src = _t._img;
		}
		else if (_t._img instanceof HTMLImageElement && _t._img.src && _t._img.complete)
		{
			initMesh(_t._img);
		}
		else if (_t._img instanceof HTMLCanvasElement)
		{
			initMesh(_t._img);
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
	
	_t._updateImage = function()
	{
		if (!_t._loaded || !_t._visible) return;
		
		_ctx.drawImage(_t._img, 0, 0, _t._imgWidth, _t._imgHeight, 0, 0, _t._width, _t._height);
		_GL._renderTexture(_CTX._get('gl'), _t._mesh._texture, _canvas);
	};
	
	_t._update = function()
	{
		if (!_t._loaded || !_t._visible) return false;
		
		_M4.lookAt(_t._mesh._rotationM, _t._pos, [0,0,0], [0,1,0]);
		_M4.multiply(_t._mesh._modelM, _t._mesh._posM, _t._mesh._rotationM);
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
		
		
		var _m = _t._mesh._inversePosM;
		
		//apply inverse transform to ray
		_dir.add( _origin ).applyMatrix4( _m );
		_origin.applyMatrix4( _m );
		_dir.sub( _origin ).normalize();		
		//console.log(_dir);
		
		var _intersect = intersectBox(_t._boundingBox, _origin, _dir);
		if (_intersect)
		{
			_EV._fire('hotspot', _t._name);
		}				
	};	
	
	loadImg();
	
	_t._API = {
		show: _t._show,
		hide: _t._hide,
		updateImage: _t._updateImage
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

function getHotSpotByName(_name)
{
	var _hotspot = _hotSpots[_name];
	if (!_hotspot) return undefined;
	return _hotspot._API;
}

function renderHotSpots(_renderFunc, _projectType)
{
	if (_hotSpotsLength < 1) return;

	var _camera = _CTX._get('camera'), _controls = _CTX._get('controls');
	
	var _projectionM = _camera._projectionM;
	if (_projectType == 'left') _projectionM = _camera._leftEyeM;
	else if (_projectType == 'right') _projectionM = _camera._rightEyeM;
	
	_M4.multiply(_projectionViewM, _projectionM, _camera._viewM);
	_M4.multiply(_projectionViewM, _projectionViewM, _controls.m);

	for (var _name in _hotSpots)
		if (_hotSpots.hasOwnProperty(_name) && _hotSpots[_name]._update())
			_renderFunc(_hotSpots[_name]._mesh);		
}



function raycast(e)
{
	if (_hotSpotsLength < 1) return;

	var _camera = _CTX._get('camera'), _controls = _CTX._get('controls');

	var _box = _element.getBoundingClientRect();
	var _coords = {};
	_coords.x = (e.pageX-_box.left)/_box.width * 2 - 1;
	_coords.y =  -(e.pageY-_box.top)/_box.height * 2 + 1;

	//console.log(_coords.x + ',' + _coords.y);

	//M^V^P^ = (PVM)^
	var _unProjectM = _M4.create();
	_M4.multiply(_unProjectM, _camera._projectionM, _camera._viewM);
	_M4.multiply(_unProjectM, _unProjectM, _controls.m);
	_M4.invert(_unProjectM, _unProjectM);
	
				
	var _origin = new _MA.Vector3(_camera._pos[0], _camera._pos[1], _camera._pos[2]);
	var _dir = new _MA.Vector3(_coords.x, _coords.y, 1).applyProjection(_unProjectM).sub(_origin).normalize();
	
	//console.log(_dir);

	for (var _name in _hotSpots)
		if (_hotSpots.hasOwnProperty(_name))
			_hotSpots[_name]._raycast(_origin, _dir);	

	
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
	_getHotSpotByName: getHotSpotByName,
	_renderHotSpots: renderHotSpots,
	_dispose: dispose	
};