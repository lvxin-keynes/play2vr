function DeviceProfile()
{
	var _Lenses = {
    	_AlignTop: -1,    // Offset is measured down from top of device.
    	_AlignCenter: 0,  // Center alignment ignores offset, hence scale is zero.
    	_AlignBottom: 1  // Offset is measured up from bottom of device.		
	};

	var _Screens = {
		_Nexus5: {
			w: 0.110,
			h: 0.062,
			b: 0.004
		},
		_Nexus6: {
			w: 0.133,
			h: 0.074,
			b: 0.004
		},
		_GalaxyS6: {
			w: 0.114,
			h: 0.0635,
			b: 0.0035
		},
		_GalaxyNote4: {
			w: 0.125,
			h: 0.0705,
			b: 0.0045
		},
		_LGG3: {
			w: 0.121,
			h: 0.068,
			b: 0.003
		},
		_iPhone4: {
			w: 0.075,
			h: 0.050,
			b: 0.0045
		},
		_iPhone5: {
			w: 0.089,
			h: 0.050,
			b: 0.0045
		},
		_iPhone6: {
			w: 0.104,
			h: 0.058,
			b: 0.005
		},
		_iPhone6p: {
			w: 0.112,
			h: 0.068,
			b: 0.005
		}
	};	
	
	var _Viewers = {
		_CardboardJun2015: {
		  	_lenses : {
		      _separation : 0.064,
		      _offset : 0.035,
		      _screenDistance : 0.039,
		      _alignment : _Lenses._AlignBottom
		    },
		    _maxFOV : {
		      _outer : 60.0,
		      _inner : 60.0,
		      _upper : 60.0,
		      _lower : 60.0
		    },
		    _distortion : {
		      _Coef : [ 0.34, 0.55 ]
		    }			
		}
	};
	
	var _deg2Rad = Math.PI/180;
	var _t = this;	
	
	_t._getLeftEyeVisibleTanAngles = function()
	{
		var _viewer = _t._viewer, _screen = _t._screen;
		var _result = new Array(4);
		var _verticalLensOffset =  (_viewer._lenses._offset - _screen.b - _screen.h/2) * _viewer._lenses._alignment;
	    // Tan-angles from the max FOV.
	    var _fovLeft = Math.tan(-_viewer._maxFOV._outer * _deg2Rad);
	    var _fovTop = Math.tan(_viewer._maxFOV._upper * _deg2Rad);
	    var _fovRight = Math.tan(_viewer._maxFOV._inner * _deg2Rad);
	    var _fovBottom = Math.tan(-_viewer._maxFOV._lower * _deg2Rad);
	    // Viewport size.
	    var _halfWidth = _screen.w / 4;
	    var _halfHeight = _screen.h / 2;
	    // Viewport center, measured from left lens position.
	    var _centerX = _viewer._lenses._separation / 2 - _halfWidth;
	    var _centerY = -_verticalLensOffset;
	    var _centerZ = _viewer._lenses._screenDistance;
	    // Tan-angles of the viewport edges, as seen through the lens.
	    var _screenLeft = _viewer._distortion._distort((_centerX - _halfWidth) / _centerZ);
	    var _screenTop = _viewer._distortion._distort((_centerY + _halfHeight) / _centerZ);
	    var _screenRight = _viewer._distortion._distort((_centerX + _halfWidth) / _centerZ);
	    var _screenBottom = _viewer._distortion._distort((_centerY - _halfHeight) / _centerZ);
	    // Compare the two sets of tan-angles and take the value closer to zero on each side.
	    _result[0] = Math.max(_fovLeft, _screenLeft);
	    _result[1] = Math.min(_fovTop, _screenTop);
	    _result[2] = Math.min(_fovRight, _screenRight);
	    _result[3] = Math.max(_fovBottom, _screenBottom);
	    return _result;		
	};
	
	_t._getMaxRadius = function()
	{
		var _tanAngleRect = _t._getLeftEyeVisibleTanAngles();
	    var _x = Math.max(Math.abs(_tanAngleRect[0]), Math.abs(_tanAngleRect[2]));
	    var _y = Math.max(Math.abs(_tanAngleRect[1]), Math.abs(_tanAngleRect[3]));
	    return Math.sqrt(_x * _x + _y * _y);	
	};
	
	var _getProfile = function()
	{
		_t._screen = _Screens._iPhone6p;
		_t._viewer = new Viewer(_Viewers._CardboardJun2015);
		_t._viewer._maxRadius = _t._getMaxRadius();
		_t._viewer._inverse = new Distortion(_t._viewer._distortion._coefficients)._approximateInverse(_t._viewer._maxRadius);
	};	
	
	_getProfile();
}

function Viewer(_options)
{
	this._lenses = _options._lenses;	
	this._maxFOV = _options._maxFOV;
	this._distortion = new Distortion(_options._distortion._Coef);
}

function Distortion(_coefficients)
{
	this._coefficients = _coefficients;
	var _t = this;
	
	//Distorts a radius by its distortion factor from the center of the lenses.
	_t._distort = function(_radius) {
		var _r2 = _radius * _radius;
		var _ret = 0;
		for (var i=_t._coefficients.length-1; i>=0; i--)
		{
			_ret = _r2 * (_ret + _t._coefficients[i]);		
		}
		return (_ret + 1) * _radius;
	};
	
	//Calculates the inverse distortion for a radius.
	_t._distortInverse = function(_radius) {
		var _r0 = 0;
		var _r1 = 1;
		var _dr0 = _radius - _t._distort(_r0);
		while (Math.abs(_r1 - _r0) > 0.0001 /** 0.1mm */) {
		    var _dr1 = _radius - _t._distort(_r1);
		    var _r2 = _r1 - _dr1 * ((_r1 - _r0) / (_dr1 - _dr0));
		    _r0 = _r1;
		    _r1 = _r2;
		    _dr0 = _dr1;
		}
		return _r1;
	};
	
	//Solves a small linear equation via destructive gaussian elimination and back substitution
	var _solveLinear = function(a, y) {
		var n = a.length;
		for (var j = 0; j < n - 1; ++j) {
			for (var k = j + 1; k < n; ++k) {
				var p = a[j][k] / a[j][j];
				for (var i = j + 1; i < n; ++i) {
					a[i][k] -= p * a[i][j];
				}
				y[k] -= p * y[j];
	   		}
	  	}	
	  	
		var x = new Array(n);	
		for (var j = n - 1; j >= 0; --j) {
			var v = y[j];
			for (var i = j + 1; i < n; ++i) {
				v -= a[i][j] * x[i];
			}
			x[j] = v / a[j][j];
		}	  	
	  	return x;
	};
	
	//Solves a least-squares matrix equation.  Given the equation A * x = y, calculate the least-square fit x = inverse(A * transpose(A)) * transpose(A) * y
	var _solveLeastSquares	= function(_matA, _vecY) {
		var i, j, k, _sum;
		var _numSamples = _matA[0].length;
		var _numCoefficients = _matA.length;
		//console.log(numSamples + ' vs ' + vecY.length + ' vs ' + numCoefficients);
		if (_numSamples != _vecY.length) {
			throw new Error("Matrix / vector dimension mismatch");
		}

		// Calculate transpose(A) * A
		var _matATA = new Array(_numCoefficients);
		for (k = 0; k < _numCoefficients; ++k) {
			_matATA[k] = new Array(_numCoefficients);
			for (j = 0; j < _numCoefficients; ++j) {
				_sum = 0;
				for (i = 0; i < _numSamples; ++i) {
					_sum += _matA[j][i] * _matA[k][i];
				}
				_matATA[k][j] = _sum;
			}
  		}

		// Calculate transpose(A) * y
		var _vecATY = new Array(_numCoefficients);
		for (j = 0; j < _numCoefficients; ++j) {
			_sum = 0;
			for (i = 0; i < _numSamples; ++i) {
				_sum += _matA[j][i] * _vecY[i];
			}
			_vecATY[j] = _sum;
		}

		// Now solve (A * transpose(A)) * x = transpose(A) * y.
		return _solveLinear(_matATA, _vecATY);
	};
	
	// Calculates an approximate inverse to the given radial distortion parameters.
	_t._approximateInverse = function(_maxRadius, _numSamples) {
		_maxRadius = _maxRadius || 1;
		_numSamples = _numSamples || 100;
		var _numCoefficients = 6;
		var i, j;

		// R + K1*R^3 + K2*R^5 = r, with R = rp = _distort(r)
		// Repeating for numSamples:
		//   [ R0^3, R0^5 ] * [ K1 ] = [ r0 - R0 ]
		//   [ R1^3, R1^5 ]   [ K2 ]   [ r1 - R1 ]
		//   [ R2^3, R2^5 ]            [ r2 - R2 ]
		//   [ etc... ]                [ etc... ]
		// That is:
		//   matA * [K1, K2] = y
		// Solve:
		//   [K1, K2] = inverse(transpose(matA) * matA) * transpose(matA) * y
		var _matA = new Array(_numCoefficients);
		for (j = 0; j < _numCoefficients; ++j) {
			_matA[j] = new Array(_numSamples);
		}
		var _vecY = new Array(_numSamples);
		
		for (i = 0; i < _numSamples; ++i) {
			var r = _maxRadius * (i + 1) / _numSamples;
			var rp = _t._distort(r);
			//console.log(r + ' vs ' + rp + ' delta ' + (r-rp));
			var v = rp;
			for (j = 0; j < _numCoefficients; ++j) {
				v *= rp * rp;
				_matA[j][i] = v;
			}
			_vecY[i] = r - rp;
		}

		var _inverseCoefficients = _solveLeastSquares(_matA, _vecY);

		return new Distortion(_inverseCoefficients);
	};
}

module.exports = DeviceProfile;