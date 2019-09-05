var _M4 = require('../../utils/node_modules/gl-mat4');
var _CTX = require('./context');
var _G = require('./geometry');
var _GL = require('./gl');
var _R = require('./res');

var	_wmWidth, _wmHeight, _wmMargin = 10, _wmPortion = 4,
    _wmCanvas, _wmCtx, _wmMesh, _wmImg;
    
function initWM(_gl)
{	
	_wmMesh = _GL._createMesh(_gl, _G._getGeometry(_G.T._PLANE));
 	_wmMesh._modelM = _M4.create();
 	_wmMesh._alpha = 1.0;

	_wmImg = new Image();	
	function onImgLoad()
	{
		_wmCanvas = document.createElement('canvas');
		_wmCtx = _wmCanvas.getContext('2d');
		drawWM();
	}
	
	_wmImg.onload = onImgLoad;
	_wmImg.src = _R._wm;
}

function drawWM()
{
	if (!_wmCanvas) return;
	
	var _gl = _CTX._get('gl'), _width = _CTX._get('width'), _devicePixelRatio = _CTX._get('devicePixelRatio');

	_wmWidth = _wmImg.width;
	_wmHeight = _wmImg.height;				

	_wmWidth *= _devicePixelRatio;
	_wmHeight *= _devicePixelRatio;

	if (_wmWidth > _width/_wmPortion) 
	{
		_wmWidth = _width/_wmPortion;
		_wmHeight = Math.ceil(_wmImg.height/_wmImg.width * _wmWidth);
	} 
	
	_wmCanvas.width = _wmWidth;
	_wmCanvas.height = _wmHeight;
	_wmCtx.drawImage(_wmImg, 0, 0, _wmImg.width, _wmImg.height, 0, 0, _wmWidth, _wmHeight);									
	_GL._renderTexture(_gl, _wmMesh._texture, _wmCanvas);
}

function renderWM(_gl, _width, _height, _renderFunc)
{
	_gl.viewport(_wmMargin, _height - _wmHeight - _wmMargin, _wmWidth, _wmHeight);
	_renderFunc(_wmMesh);
}     

function dispose()
{
	//_wmCanvas = undefined;
}

module.exports = {
	_initWM: initWM,
	_drawWM: drawWM,
	_renderWM: renderWM,
	_dispose: dispose
}
