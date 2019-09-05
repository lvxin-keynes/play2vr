var _M4 = require('../../utils/node_modules/gl-mat4');
var _CTX = require('./context');
var _G = require('./geometry');
var _GL = require('./gl');

var _titleWidth, _titleHeight, _titleMargin = 10,
	_titleMesh, _titleCanvas, _titleCtx;

function initTitle(_gl)
{	
	_titleMesh = _GL._createMesh(_gl, _G._getGeometry(_G.T._PLANE));
    _titleMesh._modelM = _M4.create();    
    _titleMesh._alpha = 1.0;

	_titleCanvas = document.createElement('canvas');
	_titleCtx = _titleCanvas.getContext('2d');			
}

function drawTitle(_gl, _title)
{
	if (!_titleCanvas) return;	
	
	var _height = _CTX._get('height'), _devicePixelRatio = _CTX._get('devicePixelRatio');
	var _textHeight = Math.ceil(_height/18);	
	_titleMargin = _textHeight/1.5;
	
	_titleCtx.font =  _textHeight + 'px Arial';
	var _textWidth = Math.ceil(_titleCtx.measureText(_title).width);  							
	_titleWidth = _textWidth * _devicePixelRatio;
	_titleHeight = _textHeight * _devicePixelRatio;
	_titleCanvas.width = _titleWidth;
	_titleCanvas.height = _titleHeight;	
	
	//console.log(_titleWidth+','+_titleHeight);							
	//_titleCtx.fillStyle = '#FF0000';							
	//_titleCtx.fillRect(0, 0, _titleWidth, _titleHeight);
	_titleCtx.shadowColor = "black";
	_titleCtx.shadowOffsetX = 1; 
	_titleCtx.shadowOffsetY = 1; 
	_titleCtx.shadowBlur = 3;
	_titleCtx.fillStyle = '#FFFFFF';		
	_titleCtx.font = _textHeight + 'px Arial';
	_titleCtx.textBaseline = 'bottom';
	_titleCtx.fillText(_title, 0, _textHeight*_devicePixelRatio);
	
	_GL._renderTexture(_gl, _titleMesh._texture, _titleCanvas);		
}

function renderTitle(_gl, _width, _height, _renderFunc)
{
	_gl.viewport(_titleMargin, _titleMargin, _titleWidth, _titleHeight);
	_renderFunc(_titleMesh);	
}

module.exports = {
	_initTitle: initTitle,
	_drawTitle: drawTitle,
	_renderTitle: renderTitle
}