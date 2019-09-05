var escodegen = require('escodegen');
 
var identityConfig = [
//	{obj: " return document.createElement('div').__proto__; ", ids: ['setAttribute', 'getAttribute', 'appendChild', 'insertBefore']},
	{obj: " return String;", ids: ['fromCharCode']},
	{obj: " return window; ", ids: ['window', 'document', 'scrollTo', 'devicePixelRatio', 
			'Math', 'Array', 'Float32Array', 'Uint16Array', 'Uint32Array', 'requestAnimationFrame', 'cancelAnimationFrame', 'String', 'Image',
			'encodeURIComponent', 'decodeURIComponent', 'JSON', 'dispatchEvent', 'setTimeout', 'HTMLImageElement', 'HTMLCanvasElement']},
	{obj: " return JSON; ", ids: ['parse']},
	{obj: " return document; ", ids: ['documentElement', 'createElement', 'querySelector', 'getElementsByTagName', 'querySelectorAll', 'cookie',
			'createEvent']},
	{obj: " return document.createElement('canvas').__proto__;", ids: ['getContext', 'toDataURL']},
	{obj: " return document.createElement('canvas').getContext('2d').__proto__;", ids: ['drawImage', 'clearRect', 'getImageData']},
	{obj: [ 
		"var _canvas = document.createElement('canvas');",
		"var _glNames = ['webgl', 'experimental-webgl', 'moz-webgl', 'webkit-3d'];",				
		"var _gl = undefined;",
		"try {", 
		"	for (var n=0; n<_glNames.length; n++)",
		"	{",
		"		_gl = _canvas.getContext(_glNames[n]);",
		"		if (_gl) break;", 			
		"	}",				
		"} catch( error ) { }", 
		"if (!_gl) { throw 'cannot create webgl context';}",		
		"return _gl.__proto__"
		].join("\n"),			
 	 ids: ['uniform1i', 'uniform4f', 'blendFunc', 'SRC_ALPHA', 'ONE_MINUS_SRC_ALPHA', 'frontFace', 'getAttribLocation', 'getUniformLocation', 
			 'uniformMatrix4fv', 'uniform1f', 'enableVertexAttribArray', 'useProgram', 'texImage2D', 'viewport', 'drawElements',
			 'vertexAttribPointer', 'bindBuffer', 'createTexture', 'bindTexture', 'COLOR_BUFFER_BIT', 'DEPTH_BUFFER_BIT', 'TEXTURE_2D', 'UNSIGNED_BYTE',
			 'RGBA', 'TRIANGLES', 'UNSIGNED_SHORT', 'BLEND', 'createBuffer', 'texParameteri', 'bufferData', 'TEXTURE_MIN_FILTER', 'TEXTURE_MAG_FILTER',
			 'TEXTURE_WRAP_S', 'TEXTURE_WRAP_T', 'CLAMP_TO_EDGE', 'ARRAY_BUFFER', 'VERTEX_SHADER', 'FRAGMENT_SHADER', 'attachShader', 
			 'getShaderInfoLog', 'ELEMENT_ARRAY_BUFFER', 'deleteShader', 'getProgramParameter', 'LINK_STATUS', 'VALIDATE_STATUS',
			 'createShader', 'shaderSource', 'compileShader', 'getShaderParameter', 'COMPILE_STATUS', 'createProgram', 'linkProgram',
			 'LINEAR', 'STATIC_DRAW', 'FLOAT', 'deleteTexture', 'deleteBuffer', 'deleteProgram']
	},
	{obj: "return Math;", ids: ['abs', 'min', 'max', 'tan', 'atan', 'PI', 'sqrt', 'sin', 'cos', 'atan2', 'asin', 'pow', 'floor', 'ceil', 'random']}
];

var allIdNames = {};
for (var i=0; i<identityConfig.length; i++)
{
	var idConf = identityConfig[i];
		
	var idAlias = [];  
	for (var j=0; j<idConf.ids.length; j++)
	{	
		var id = idConf.ids[j];
		var aliasId = getMangleId(j);
		idAlias.push(aliasId);
		allIdNames[id] = aliasId; 
	}
	
	idConf.alias = idAlias;
}

function getMangleId(i)
{
	function randomBetween(min, max)
	{
		return min + Math.floor((max-min) * Math.random());
	}

	var id = '$';
	var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	var charsLength = chars.length;
	
	var p = Math.floor(i / charsLength), q = i % charsLength;
	for (var m=0; m<p; m++) id += chars.charAt(randomBetween(0, charsLength-1));
	
	id += chars.charAt(q);	
	return id;
}

function getIdentities(n, nodeIds)
{
	if (typeof nodeIds == 'undefined') nodeIds = [];

	if (n && n.type)
	{
		if (n.type == 'Identifier') 
		{
			nodeIds.push(n);
		}
		else 
		{
			for (var i in n) getIdentities(n[i], nodeIds);
		}		
	}

	return nodeIds;
}

function mangle(node, parent)
{
	//get all identities
	var nodeIds = getIdentities(node);
	//console.log(nodeIds);
	
	//filter identities name
	for (var i=0; i<nodeIds.length; i++)
	{
		if (typeof allIdNames[nodeIds[i].name] == 'string')
			nodeIds[i].name = allIdNames[nodeIds[i].name];
	}
	
	//console.log(nodeIds);
}

function getCode()
{
	var arr = 
	[
		"function idAlias(_func, _ids, _alias)",
		"{",
		"	var _obj = new Function(_func)();",
		"	for (var f=0; f<_ids.length; f++)",
		"		_obj[_alias[f]] = _obj[_ids[f]];",
		"}"
	];
	
	for (var i=0; i<identityConfig.length; i++)
	{
		var idConf = identityConfig[i];
		arr.push('var _func'+i+' = ' + JSON.stringify(idConf.obj) + ';');
		arr.push('var _ids'+i+' = ' + JSON.stringify(idConf.ids) + ';');
		arr.push('var _alias'+i+' = ' + JSON.stringify(idConf.alias) + ';');
		arr.push('idAlias(_func'+i+', _ids'+i+', _alias'+i+');');
	}
	
	return arr.join('\n');

//	return [
//		"var _config = " + JSON.stringify(identityConfig) + ";",
//		"for (var i=0; i<_config.length; i++)",
//		"{",
//		"	var _obj = new Function(_config[i].obj)();",
//		"	var _ids = _config[i].ids;",		
//		"	for (var m in _ids)",
//		"		if (_ids.hasOwnProperty(m))",
//		"			_obj[_ids[m]] = _obj[m];",					
//		"}"		
//	].join('\n');
}

module.exports = {
	mangle: mangle,
	getCode: getCode
}