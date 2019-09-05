var _M4 = require('../../utils/node_modules/gl-mat4');
var _CTX = require('./context');
var _G = require('./geometry');
var _GL = require('./gl');
var _TW = require('./tween');
var _R = require('./res');
var _AN = require('./animation');

var _msgMesh, _msgCanvas, _msgCtx, _msgWidth, _msgHeight, _msgPortion=8,
	_msgConfig = {
		load: {i: _R._loadImg, a: spinAnimation},
		compass: {i: _R._compassImg, a: imageAnimation},
		play: {i: _R._playImg, a: growFadeAnimation},
		pause: {i: _R._pauseImg, a: growFadeAnimation}
	};
	
var _spinAnimationModel = _M4.create();
function spinAnimation()
{
	_M4.identity(_spinAnimationModel);
	_msgMesh._tween = new _TW({z:0})._to({z: -2*Math.PI}, 3000)._easing('EaseOutQuat')._onUpdate(function(){
		_M4.rotateZ(_msgMesh._modelM, _spinAnimationModel, this.z);
	})._repeat(Infinity)._start();
}

var _imageAnimationModel = _M4.create();
function imageAnimation()
{
	_M4.identity(_imageAnimationModel);
	
	_msgMesh._tween = _AN._getTween()._onUpdate(function(){
		_AN._getTweenUpdate().apply(this);
		_M4.rotateZ(_msgMesh._modelM, _imageAnimationModel, -this._rotateY);
	})
}

var _growAnimationModel = _M4.create();
function growFadeAnimation()
{
	_M4.identity(_growAnimationModel);
	_msgMesh._tween = new _TW({s: 0.8, a:1})._to({s: [1, 0.9], a: [1, 0.8, 0]}, 800)._onUpdate(function(){
		_M4.scale(_msgMesh._modelM, _growAnimationModel, [this.s, this.s, this.s]);
		_msgMesh._alpha = this.a;				
	})._onComplete(stopMessage)._start();
}

function initMessage(_gl)
{    
	_msgMesh = _GL._createMesh(_gl, _G._getGeometry(_G.T._PLANE));
	_msgCanvas = document.createElement('canvas');
	_msgCtx = _msgCanvas.getContext('2d');
	
    _msgMesh._modelM = _M4.create();    
    _msgMesh._alpha = 1.0;
}

function startMessage(_msgName)
{
	if (!_msgMesh || _msgMesh._msgName === _msgName) return;

	function drawAndPlayMsg(_img, _anim)
	{
		var _gl = _CTX._get('gl'), _width = _CTX._get('width'), _devicePixelRatio = _CTX._get('devicePixelRatio');
	
		_msgWidth = _img.width;
		_msgHeight = _img.height;

		_msgWidth *= _devicePixelRatio;
		_msgHeight *= _devicePixelRatio;

		if (_msgWidth > _width/_msgPortion) 
		{
			_msgWidth = _width/_msgPortion;
			_msgHeight = Math.ceil(_img.height/_img.width * _msgWidth);
		} 	
				
		_msgCanvas.width = _msgWidth;
		_msgCanvas.height = _msgHeight;
		_msgCtx.drawImage(_img, 0, 0, _img.width, _img.height, 0, 0, _msgWidth, _msgHeight);											
		_GL._renderTexture(_gl, _msgMesh._texture, _msgCanvas);		
		
		stopMessage();
		
		_anim();		
	}

	var _msgImg = _msgConfig[_msgName].i; 
	var _msgAnim = _msgConfig[_msgName].a;
	if (typeof _msgImg == 'string')	
	{
		var _img = new Image();		
		_img.onload = function()
		{
			_msgImg = _img;
			drawAndPlayMsg(_msgImg, _msgAnim);	
		}
		_img.src = _msgImg; 
	}
	else
	{
		drawAndPlayMsg(_msgImg, _msgAnim);
	}
	
	_msgMesh._msgName = _msgName;
}

function stopMessage(_msgName)
{
	if (_msgMesh._tween)
	{
		if (_msgName === undefined || (_msgName !== undefined && _msgMesh._msgName === _msgName)) 
		{		
			_msgMesh._tween._stop();
			_msgMesh._tween = undefined;
		}
	}
}

function renderMessage(_gl, _width, _height, _renderFunc)
{
	if (_msgMesh._tween)
	{
		_msgMesh._tween._update();
			
		_gl.viewport((_width-_msgWidth)/2, (_height-_msgHeight)/2, _msgWidth, _msgHeight);
		_renderFunc(_msgMesh);
	}

}
	
module.exports = {
	_initMessage: initMessage,
	_startMessage: startMessage,
	_stopMessage: stopMessage,
	_renderMessage: renderMessage
}