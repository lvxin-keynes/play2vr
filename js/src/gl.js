function initWebGL(_canvas, _glConfig)
{
	if (!_canvas)
	{
		_canvas = document.createElement('canvas');
	}

	var _glNames = ['webgl', 'experimental-webgl', 'moz-webgl', 'webkit-3d'];		
	// Initialise WebGL
	var _gl = undefined;
	try { 
		for (var n=0; n<_glNames.length; n++)
		{
			_gl = _canvas.getContext(_glNames[n], _glConfig);
			if (_gl) break; 			
		}				
	} catch( error ) { }
	//_gl = undefined; 
	if (!_gl) return false;
	
	return {
		_canvas: _canvas,
		_gl: _gl
	};
}

var _resources = {};
function _createGLResource(_gl, _type)
{
	if (_resources[_gl] == undefined) _resources[_gl] = {p:[], b:[], t:[]};

	var _resource = undefined;
	if (_type == 'p') _resource = _gl.createProgram();
	else if (_type == 'b') _resource = _gl.createBuffer();
	else if (_type == 't') _resource = _gl.createTexture();	
	
	if (_resource) _resources[_gl][_type].push(_resource);
	
	return _resource;	
}


function createProgram(_gl, _vertex, _fragment) 
{
	//var _program = _gl.createProgram();
	var _program = _createGLResource(_gl, 'p');

	var _vs = createShader(_gl, _vertex, _gl.VERTEX_SHADER );
	var _fs = createShader(_gl, _fragment, _gl.FRAGMENT_SHADER );

	if ( _vs == null || _fs == null ) return null;

	_gl.attachShader( _program, _vs );
	_gl.attachShader( _program, _fs );

	_gl.deleteShader( _vs );
	_gl.deleteShader( _fs );

	_gl.linkProgram( _program );
	_gl.useProgram( _program );

	if ( !_gl.getProgramParameter( _program, _gl.LINK_STATUS ) ) {

		alert( "ERROR:\n" +
		"VALIDATE_STATUS: " + _gl.getProgramParameter( _program, _gl.VALIDATE_STATUS ) + "\n" +
		"ERROR: " + _gl.getError() + "\n\n" +
		"- Vertex Shader -\n" + _vertex + "\n\n" +
		"- Fragment Shader -\n" + _fragment );

		return null;
	}
	
	_program.P = {};

	return _program;

}

function createShader(_gl, _src, _type ) 
{
	var _shader = _gl.createShader( _type ); 
	_gl.shaderSource( _shader, _src );
	_gl.compileShader( _shader ); 
	if ( !_gl.getShaderParameter( _shader, _gl.COMPILE_STATUS ) ) {
		alert( ( _type == _gl.VERTEX_SHADER ? "VERTEX" : "FRAGMENT" ) + " SHADER:\n" + _gl.getShaderInfoLog( _shader ) );
		return null;
	}
	return _shader;
}

function createMesh(_gl, _geometry)
{
	//var _tex = _gl.createTexture();
	var _tex =  _createGLResource(_gl, 't');
	var	_buf = {
		vertex: _createGLResource(_gl, 'b'),
		uv: _createGLResource(_gl, 'b'),
		index: _createGLResource(_gl, 'b')
	};
    _gl.bindBuffer(_gl.ARRAY_BUFFER, _buf.vertex); 
    _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(_geometry.vertex), _gl.STATIC_DRAW);
	_buf.vertex.itemSize = 3;
	_buf.vertex.numItems = _geometry.vertex.length/3;
	
	_gl.bindBuffer( _gl.ARRAY_BUFFER, _buf.uv );
	_gl.bufferData( _gl.ARRAY_BUFFER, new Float32Array(_geometry.uv), _gl.STATIC_DRAW );
	_buf.uv.itemSize = 2;
	_buf.uv.numItems = _geometry.uv.length/2;	   
	
	_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, _buf.index );
	_gl.bufferData( _gl.ELEMENT_ARRAY_BUFFER, 
		_geometry.vertex.length > 65535 ? new Uint32Array(_geometry.index) : new Uint16Array(_geometry.index), 
		_gl.STATIC_DRAW );
	_buf.index.itemSize = 1;
	_buf.index.numItems = _geometry.index.length;	         												
    
	return {
		_geometry: _geometry,  
		_texture: _tex,
		_buffer: _buf
	};
}

function prepareMesh(_gl, _program, _mesh)
{
	_gl.bindBuffer( _gl.ARRAY_BUFFER, _mesh._buffer.vertex );
	_gl.vertexAttribPointer(_program.P._aPosition, 3, _gl.FLOAT, true, 0, 0);

	_gl.bindBuffer( _gl.ARRAY_BUFFER, _mesh._buffer.uv );
	_gl.vertexAttribPointer(_program.P._aUv, 2, _gl.FLOAT, true, 0, 0);     

    _gl.bindTexture(_gl.TEXTURE_2D, _mesh._texture);                     		      
    _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, _mesh._buffer.index);    
}

var _blackImg = new Uint8Array([0, 0, 0, 255]);
function renderTexture(_gl, _tex, _img)
{
	if (_resources[_gl] === undefined) return;

    _gl.bindTexture(_gl.TEXTURE_2D, _tex);
    _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MAG_FILTER, _gl.LINEAR); 
    _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, _gl.LINEAR); 
    _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_S, _gl.CLAMP_TO_EDGE); 
    _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_T, _gl.CLAMP_TO_EDGE);   
    
    var _ext = _gl.getExtension("EXT_texture_filter_anisotropic");
    if (_ext)
    {
    	var _maxAnisotropy = _gl.getParameter(_ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
    	_gl.texParameterf(_gl.TEXTURE_2D, _ext.TEXTURE_MAX_ANISOTROPY_EXT, _maxAnisotropy);
    }  
    	
	//_gl.texImage2D(_gl.TEXTURE_2D, 0, _gl.RGBA, _gl.RGBA, _gl.UNSIGNED_BYTE, _img);
	if (!_img) _gl.texImage2D(_gl.TEXTURE_2D, 0, _gl.RGBA, 1, 1, 0, _gl.RGBA, _gl.UNSIGNED_BYTE, _blackImg); 
	else
	{
		if (_img.readyState === undefined || _img.readyState >= 2) _gl.texImage2D(_gl.TEXTURE_2D, 0, _gl.RGBA, _gl.RGBA, _gl.UNSIGNED_BYTE, _img);
		else _gl.texImage2D(_gl.TEXTURE_2D, 0, _gl.RGBA, 1, 1, 0, _gl.RGBA, _gl.UNSIGNED_BYTE, _blackImg); 
	}   
      
    _gl.bindTexture(_gl.TEXTURE_2D, null);	
}

function dispose(_gl)
{	
	var _glResource = _resources[_gl];
	
	if (!_glResource) return;
	
	var _textures = _glResource['t'] || [];	
	for (var i=0; i<_textures.length; i++) _gl.deleteTexture(_textures[i]);
	
	var _buffers = _glResource['b'] || [];
	for (var i=0; i<_buffers.length; i++) _gl.deleteBuffer(_buffers[i]);
	
	var _programs = _glResource['p'] || [];
	for (var i=0; i<_programs.length; i++) _gl.deleteProgram(_programs[i]);	
	
	_gl.clear( _gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT );
	
	_resources[_gl] = undefined;
}

module.exports = {
	_initWebGL: initWebGL,
	_createProgram: createProgram,
	_createMesh: createMesh,
	_prepareMesh: prepareMesh,
	_renderTexture: renderTexture,
	_blackImg: _blackImg,
	_dispose: dispose
}