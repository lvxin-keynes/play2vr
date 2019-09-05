var _M4 = require('../../utils/node_modules/gl-mat4');
var _CTX = require('./context');
var _TW = require('./tween');

var _idM, _modelM, _tween, _tweenUpdate; 
var _animationType = '';

function yawAnimation()
{
	_tweenUpdate = yawAnimationUpdate;
	_tween = new _TW({_rotateY:0})._to({_rotateY: [1/2*Math.PI, 1/2*Math.PI+0.2, Math.PI, Math.PI+0.2, 3/2*Math.PI, 3/2*Math.PI+0.2, 2*Math.PI]}, 10000)._easing('EaseInQuat')
	._repeat(Infinity)._start();	
}

function yawAnimationUpdate()
{
	_M4.rotateY(_modelM, _idM, this._rotateY);
}

function setup(_type)
{
	dispose();

	_animationType = _type; 

	_idM = _M4.create();
	
	_modelM = _M4.create();
	if (_animationType == 'yaw')
		yawAnimation()
	
}

function dispose()
{
	if (_tween) _tween._stop();
}

function update()
{
	if (_tween) _tween._update();
}

function getM()
{
	return _modelM;
}

function getTween()
{
	return _tween;
}

function getTweenUpdate()
{
	return _tweenUpdate;
}

module.exports = {
	_getM: getM,
	_getTween: getTween,
	_getTweenUpdate: getTweenUpdate,
	_setup: setup,
	_update: update
}