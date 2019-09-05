var C = {
	_radius: 1,
	_latBands: 96, 
	_longBands: 96,
	
	_width: 1,
	_height: 1,
	_depth: 1,
	_segments: 1
};

var _typeStrs = ['2d', 'cube', 'sphere', 'doublesphere'];
var T = {
	_PLANE: _typeStrs[0],
	_CUBE: _typeStrs[1],
	_SPHERE: _typeStrs[2],
	_DOUBLESPHERE: _typeStrs[3]
};

function planeGeometry()
{
	return {
        vertex: [-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0],	//12
        //vertex: [-0.5, -0.5, 0, 0.5, -0.5, 0, -0.5, 0.5, 0, 0.5, 0.5, 0],	//12
        uv: [0, 1, 1, 1, 0, 0, 1, 0],						//8
        index: [0, 1, 2, 1, 3, 2],							//6		
        flipSided: false		
	};
}

function sphereGeometry(_radius, _latitudeBands, _longitudeBands)
{
	var _vertexPositionData=[], _normalData=[], _textureCoordData=[], _indexData=[];
	for (var _latNumber = 0; _latNumber <= _latitudeBands; _latNumber++) 
	{
	   var _theta = _latNumber * Math.PI / _latitudeBands;
	   var _sinTheta = Math.sin(_theta);
	   var _cosTheta = Math.cos(_theta);
	
	   for (var _longNumber = 0; _longNumber <= _longitudeBands; _longNumber++) 
	   {
	     var _phi = _longNumber * 2 * Math.PI / _longitudeBands;
	     var _sinPhi = Math.sin(_phi);
	     var _cosPhi = Math.cos(_phi);
	
	     var _x = _cosPhi * _sinTheta;
	     var _y = _cosTheta;
	     var _z = _sinPhi * _sinTheta;
	     var _u = 1- (_longNumber / _longitudeBands);
	     var _v = _latNumber / _latitudeBands;
	
	     _normalData.push(_x);
	     _normalData.push(_y);
	     _normalData.push(_z);
	     _textureCoordData.push(_u);
	     _textureCoordData.push(_v);
	     _vertexPositionData.push(_radius * _x);
	     _vertexPositionData.push(_radius * _y);
	     _vertexPositionData.push(_radius * _z);
	   }
	 }
	 
	 for (var _latNumber = 0; _latNumber < _latitudeBands; _latNumber++) 
	 {
	   for (var _longNumber = 0; _longNumber < _longitudeBands; _longNumber++) 
	   {
	     var _first = (_latNumber * (_longitudeBands + 1)) + _longNumber;
	     var _second = _first + _longitudeBands + 1;
	     _indexData.push(_first);
	     _indexData.push(_second);
	     _indexData.push(_first + 1);
	
	     _indexData.push(_second);
	     _indexData.push(_second + 1);
	     _indexData.push(_first + 1);
	   }
	 }
	 
	 return {
	 	vertex: _vertexPositionData,
	 	normal: _normalData,
	 	uv: _textureCoordData,
	 	index: _indexData,
	 	flipSided: true
	 };			
}

function cubeGeometry(width, height, depth)
{
	var vertices = [	
		-1,1,1, 1,1,1, 1,-1,1, -1,-1,1, 
		1,1,-1, -1,1,-1, -1,-1,-1, 1,-1,-1, 
		1,1,-1, 1,1,1, -1,1,1, -1,1,-1, 
		-1,-1,-1, -1,-1,1, 1,-1,1, 1,-1,-1, 
		-1,1,-1, -1,1,1, -1,-1,1, -1,-1,-1, 
		1,1,1, 1,1,-1, 1,-1,-1, 1,-1,1
	];
	var uvs = [
		0 , 0 , 
		1 , 0 ,
		1 , 1 ,
		0 , 1 ,
		1 , 0 ,
		2 , 0 ,
		2 , 1 ,
		1 , 1 ,
		2 , 0 ,
		3 , 0 ,
		3 , 1 ,
		2 , 1 ,
		0 , 1 , 
		1 , 1 ,
		1 , 2 ,
		0 , 2 ,
		1 , 1 ,
		2 , 1 ,
		2 , 2 ,
		1 , 2 ,
		2 , 1 ,
		3 , 1 ,
		3 , 2 ,
		2 , 2 
	];
	var _SubImageSizeWidth = 1/3, _SubImageSizeHeight = 1/2, _fSafeEdge = 1/1080;
	for (var i = 0 ; i < 6 ; i ++)
	{
		var _iIndexBase = i * 4 * 2;
		uvs[_iIndexBase + 0] = uvs[_iIndexBase + 0] * _SubImageSizeWidth + _fSafeEdge;
		uvs[_iIndexBase + 1] = uvs[_iIndexBase + 1] * _SubImageSizeHeight + _fSafeEdge;
		uvs[_iIndexBase + 2] = uvs[_iIndexBase + 2] * _SubImageSizeWidth - _fSafeEdge;
		uvs[_iIndexBase + 3] = uvs[_iIndexBase + 3] * _SubImageSizeHeight + _fSafeEdge;
		uvs[_iIndexBase + 4] = uvs[_iIndexBase + 4] * _SubImageSizeWidth - _fSafeEdge;
		uvs[_iIndexBase + 5] = uvs[_iIndexBase + 5] * _SubImageSizeHeight - _fSafeEdge;
		uvs[_iIndexBase + 6] = uvs[_iIndexBase + 6] * _SubImageSizeWidth + _fSafeEdge;
		uvs[_iIndexBase + 7] = uvs[_iIndexBase + 7] * _SubImageSizeHeight - _fSafeEdge;		
	}    
    
	var indices = [
    	0,2,3 ,		
		0,1,2 ,
		4,6,7,
		4,5,6,		
		8,10,11,
		8,9,10,		
		12,14,15,
		12,13,14,
		16,18,19,
		16,17,18,
		20,22,23,
		20,21,22
	];
	
	
	return {
		vertex: vertices,		
		uv: uvs,
		index: indices,
		flipSided : false
	}	
}

/*
function cubeGeometry2(width, height, depth)
{
	function buildPlane(u, v, w, udir, vdir, width, height, depth, gridX, gridY, materialIndex)
	{
		var segmentWidth	= width / gridX;
		var segmentHeight = height / gridY;

		var widthHalf = width / 2;
		var heightHalf = height / 2;
		var depthHalf = depth / 2;

		var gridX1 = gridX + 1;
		var gridY1 = gridY + 1;

		var vertexCounter = 0;
		var groupCount = 0;

		var vector = {x: 0, y: 0, z: 0};

		// generate vertices, normals and uvs

		for ( var iy = 0; iy < gridY1; iy ++ ) {

			var y = iy * segmentHeight - heightHalf;

			for ( var ix = 0; ix < gridX1; ix ++ ) {

				var x = ix * segmentWidth - widthHalf;

				// set values to correct vector component
				vector[ u ] = x * udir;
				vector[ v ] = y * vdir;
				vector[ w ] = depthHalf;

				// now apply vector to vertex buffer
				vertices[ vertexBufferOffset ] = vector.x;
				vertices[ vertexBufferOffset + 1 ] = vector.y;
				vertices[ vertexBufferOffset + 2 ] = vector.z;

				// set values to correct vector component
				vector[ u ] = 0;
				vector[ v ] = 0;
				vector[ w ] = depth > 0 ? 1 : - 1;

				// now apply vector to normal buffer
				normals[ vertexBufferOffset ] = vector.x;
				normals[ vertexBufferOffset + 1 ] = vector.y;
				normals[ vertexBufferOffset + 2 ] = vector.z;

				// uvs
				uvs[ uvBufferOffset ] = ix / gridX;
				uvs[ uvBufferOffset + 1 ] = 1 - ( iy / gridY );				

				// update offsets and counters
				vertexBufferOffset += 3;
				uvBufferOffset += 2;
				vertexCounter += 1;

			}

		}

		// 1. you need three indices to draw a single face
		// 2. a single segment consists of two faces
		// 3. so we need to generate six (2*3) indices per segment

		for ( iy = 0; iy < gridY; iy ++ ) {

			for ( ix = 0; ix < gridX; ix ++ ) {

				// indices
				var a = numberOfVertices + ix + gridX1 * iy;
				var b = numberOfVertices + ix + gridX1 * ( iy + 1 );
				var c = numberOfVertices + ( ix + 1 ) + gridX1 * ( iy + 1 );
				var d = numberOfVertices + ( ix + 1 ) + gridX1 * iy;

				// face one
				indices[ indexBufferOffset ] = a;
				indices[ indexBufferOffset + 1 ] = b;
				indices[ indexBufferOffset + 2 ] = d;

				// face two
				indices[ indexBufferOffset + 3 ] = b;
				indices[ indexBufferOffset + 4 ] = c;
				indices[ indexBufferOffset + 5 ] = d;

				// update offsets and counters
				indexBufferOffset += 6;
				groupCount += 6;

			}

		}

		// add a group to the geometry. this will ensure multi material support
		//scope.addGroup( groupStart, groupCount, materialIndex );

		// calculate new start value for groups
		groupStart += groupCount;

		// update total number of vertices
		numberOfVertices += vertexCounter;		
	}
	
	function changeCubeFaceUv(offset, faceUv, edge)
	{
		//a,b,d,b,c,d
//		uvs[indices[offset]*2] = faceUv[0][0] - edge;
//		uvs[indices[offset]*2+1] = faceUv[0][1] - edge;
//
//		uvs[indices[offset+1]*2] = faceUv[1][0] - edge;
//		uvs[indices[offset+1]*2+1] = faceUv[1][1] + edge;
//
//		uvs[indices[offset+4]*2] = faceUv[2][0] + edge;
//		uvs[indices[offset+4]*2+1] = faceUv[2][1] + edge;			 
//
//		uvs[indices[offset+2]*2] = faceUv[3][0] + edge;
//		uvs[indices[offset+2]*2+1] = faceUv[3][1] - edge;
		
		uvs[indices[offset]*2] = faceUv[0][0] + edge;
		uvs[indices[offset]*2+1] = faceUv[0][1] + edge;

		uvs[indices[offset+1]*2] = faceUv[1][0] - edge;
		uvs[indices[offset+1]*2+1] = faceUv[1][1] + edge;

		uvs[indices[offset+4]*2] = faceUv[2][0] - edge;
		uvs[indices[offset+4]*2+1] = faceUv[2][1] - edge;			 

		uvs[indices[offset+2]*2] = faceUv[3][0] + edge;
		uvs[indices[offset+2]*2+1] = faceUv[3][1] - edge;
		
	}	
	
	function changeCubeUV()
	{
		var third = 1/3, third2 = 1-third;
		var step = 6, edge = 1/1080;	
		
		//back version
//		var px = [[third, 1], [third, 0.5], [0, 0.5], [0, 1]];
//		var ny = [ [0, 0], [0, 0.5], [third, 0.5], [third, 0]];
//		var nx = [[third2, 1], [third2, 0.5], [third, 0.5], [third, 1]];
//		var nz = [[third2, 0.5], [third2, 0], [third, 0], [third, 0.5]];			
//		var py = [[third2, 0.5], [third2, 1], [1, 1], [1, 0.5]];
//		var pz = [[1, 0.5], [1, 0], [third2, 0], [third2, 0.5]]; 	
//
//		changeCubeFaceUv(0, px, edge);
//		changeCubeFaceUv(step, nx, edge);
//		changeCubeFaceUv(step*2, py, -edge);
//		changeCubeFaceUv(step*3, ny, -edge);
//		changeCubeFaceUv(step*4, pz, edge);
//		changeCubeFaceUv(step*5, nz, edge);	

		var nx = [[third, 0.5], [third, 1], [third2, 1], [third2, 0.5]]; //pz
		var ny = [[third, 0.5], [0, 0.5], [0, 1], [third, 1]]; 			 //ny	
		var px = [ [third2, 0.5], [third2, 1], [1, 1], [1, 0.5] ]; 		 //nz
		var nz = [[third, 0], [third, 0.5], [third2, 0.5], [third2, 0]]; //px		
		var py = [[third2, 0.5], [1, 0.5], [1, 0], [third2, 0]]; 		 //py
		var pz = [[0, 0], [0, 0.5], [third, 0.5], [third, 0]];			 //nx
		
		changeCubeFaceUv(0, px, edge);			//blue front
		changeCubeFaceUv(step, nx,-edge);		//red  back
		changeCubeFaceUv(step*2, py, edge);		//top  
		changeCubeFaceUv(step*3, ny, edge);		//bottom
		changeCubeFaceUv(step*4, pz, -edge);	//purple right
		changeCubeFaceUv(step*5, nz, -edge);	//yellow left		
	}

	var widthSegments = heightSegments = depthSegments = C._segments;
	var vertexCount = 24, indexCount = 36;
	var vertices = [], normals = [], uvs = [], indices = [];

	var vertexBufferOffset = 0, uvBufferOffset = 0, indexBufferOffset = 0, numberOfVertices = 0;
	var groupStart = 0;	
	
	buildPlane( 'z', 'y', 'x', - 1, - 1, depth, height,   width,  depthSegments, heightSegments, 0 ); // px
	buildPlane( 'z', 'y', 'x',   1, - 1, depth, height, - width,  depthSegments, heightSegments, 1 ); // nx
	buildPlane( 'x', 'z', 'y',   1,   1, width, depth,    height, widthSegments, depthSegments,  2 ); // py
	buildPlane( 'x', 'z', 'y',   1, - 1, width, depth,  - height, widthSegments, depthSegments,  3 ); // ny
	buildPlane( 'x', 'y', 'z',   1, - 1, width, height,   depth,  widthSegments, heightSegments, 4 ); // pz
	buildPlane( 'x', 'y', 'z', - 1, - 1, width, height, - depth,  widthSegments, heightSegments, 5 ); // nz
	
	changeCubeUV();
	
	return {
		vertex: vertices,
	 	normal: normals,		
		uv: uvs,
		index: indices,
		flipSided : true
	}	 		
}
*/

function getGeometry(_type)
{
	var _geometry;
	if (_type == T._PLANE)
		_geometry = planeGeometry();
	else if (_type == T._SPHERE || _type == T._DOUBLESPHERE)
		_geometry = sphereGeometry(C._radius, C._latBands, C._longBands);
	else if (_type == T._CUBE)
		_geometry = cubeGeometry(C._width, C._height, C._depth);

	return _geometry;
}

function computeBoundingBox(_geometry)
{
	var _minX = Infinity, _minY = Infinity, _minZ = Infinity;
	var _maxX = -Infinity, _maxY = -Infinity, _maxZ = -Infinity;
	var _positions = _geometry.vertex;
	for ( var i = 0, l = _positions.length; i < l; i += 3 ) {

		var _x = _positions[ i ];
		var _y = _positions[ i + 1 ];
		var _z = _positions[ i + 2 ];

		if ( _x < _minX ) _minX = _x;
		if ( _y < _minY ) _minY = _y;
		if ( _z < _minZ ) _minZ = _z;

		if ( _x > _maxX ) _maxX = _x;
		if ( _y > _maxY ) _maxY = _y;
		if ( _z > _maxZ ) _maxZ = _z;
	}	
	
	return {
		min: {x: _minX, y: _minY, z: _minZ},
		max: {x: _maxX, y: _maxY, z: _maxZ}
	};
}

module.exports = {
	_getGeometry: getGeometry,	
	_computeBoundingBox: computeBoundingBox,
	T: T,
	C: C
}