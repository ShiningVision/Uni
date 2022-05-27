
var vertexShaderText = [
	'precision mediump float;',
	'',
	'attribute vec2 vertPosition;',
	'attribute vec3 vertColor;',
	'varying vec3 fragColor;',
	'',
	'void main()',
	'{',
	'	fragColor=vertColor;',
	'	gl_Position=vec4(vertPosition,0.0,1.0);',
	'}'
].join('\n');

var fragmentShaderText=[
	'precision mediump float;',
	'',
	'varying vec3 fragColor;',
	'void main()',
	'{',
	'	gl_FragColor=vec4(fragColor,1.0);',
	'}'
].join('\n')

var InitDemo = function(){
	console.log("triangleGl.js is working");
	
	var canvas=document.getElementById("theScreen");
	var gl=canvas.getContext('webgl');
	
	if(!gl){
		console.log("WebGL is not supported. Switching to alternative experimental-webgl");
		gl=canvas.getContext('experimental-webgl');
	}
	
	if(!gl){
		alert('Your browser does not support WebGL');
	}
	
	gl.clearColor(0.5,0.5,0.8,1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	//
	//Create shaders
	//
	var vertexShader=gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader=gl.createShader(gl.FRAGMENT_SHADER);
	
	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);
	
	gl.compileShader(vertexShader);
	if(!gl.getShaderParameter(vertexShader,gl.COMPILE_STATUS)){
		console.error('ERROR compiling vertexShader!',gl.getShaderInfoLog(vertexShader));
		return;
	}
	gl.compileShader(fragmentShader);
	if(!gl.getShaderParameter(fragmentShader,gl.COMPILE_STATUS)){
		console.error('ERROR compiling fragmentShader!',gl.getShaderInfoLog(fragmentShaderShader));
		return;
	}
	
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
		console.error('ERROR linking program!',gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){	
		console.error('ERROR validating program!',gl.getProgramInfoLog(program));
		return;
	}
	
	//
	//create buffer
	//
	
	var triangleVertices=[
		0.0,0.5,
		-0.5,-0.5,
		0.5, -0.5
	]
	
	var triangleVertexBufferObject=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices),gl.STATIC_DRAW);
	
	var positionAttribLocation=gl.getAttribLocation(program, 'vertPosition');
	var colorAttribLocation= gl.getAttribLocation(program, 'vertColor');
	gl.vertexAttribPointer(
		positionAttribLocation,//Attribute location
		2,//Number of elements per attribute
		gl.FLOAT,//Type of elements
		gl.FALSE,
		2*Float32Array.BYTES_PER_ELEMENT,//Size of an individual vertex
		0//Offset from the beginning of a single vertex to this attribute
	);
	gl.enableVertexAttribArray(positionAttribLocation);
	
	//
	//Main render loop
	//
	gl.useProgram(program);
	gl.drawArrays(gl.TRIANGLES,0,3);
};