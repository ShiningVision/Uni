const mat4=glMatrix.mat4;
const shapes=[];
let gl=null;
const toRad = glMatrix.glMatrix.toRadian;
var viewMatrix = mat4.create();
const attribLocations={
	attributes:{
		vertexLocation:null,
		colorLocation:null,
		//cVertexLocation:null,//I don't know if this helps drawing the Coordinate System
		//cColorLocatioin:null//I don't know if this helps drawing the Coordinate System

	},
	uniforms:{
		transformationMatrix:null,
		projectionMatrix:null,
		viewMatrix:null

	}
}

var vertexShaderText = [
	'precision mediump float;',
	'',
	'attribute vec4 vertPosition;',
	'attribute vec4 vertColor;',
	'uniform mat4 transformationMatrix;',
    'uniform mat4 projectionMatrix;',
    'uniform mat4 viewMatrix;',
	'varying vec4 fragColor;',
	'',
	'void main()',
	'{',
	'	fragColor=vertColor;',
	'	gl_Position=  projectionMatrix* viewMatrix *transformationMatrix * vertPosition;',
	'}'
].join('\n');

var fragmentShaderText=[
	'precision mediump float;',
	'',
	'varying vec4 fragColor;',
	'void main()',
	'{',
	'	gl_FragColor=fragColor;',
	'}'
].join('\n')

var InitDemo = function(){

	/*---------------first steps------------*/

	console.log("triangleGl.js is working");
	
	var canvas=document.getElementById("theScreen");
	gl=canvas.getContext('webgl');
	checkWebGLSupport(gl);
	gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
	gl.enable(gl.DEPTH_TEST);
	gl.clearColor(0.5,0.5,0.8,1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var program=createShaderProgram(gl,vertexShaderText,fragmentShaderText);
	gl.useProgram(program);

	/*------- settup AttributeLocations --------*/

	attribLocations.attributes.vertexLocation = gl.getAttribLocation(program, "vertPosition");
	attribLocations.attributes.colorLocation = gl.getAttribLocation(program, "vertColor");
    attribLocations.uniforms.transformationMatrix = gl.getUniformLocation(program, "transformationMatrix");
    attribLocations.uniforms.projectionMatrix = gl.getUniformLocation(program, "projectionMatrix");
    attribLocations.uniforms.viewMatrix = gl.getUniformLocation(program, "viewMatrix");

	/*--------create and send projectionmatrix--------- */

	var projectionMatrix=mat4.create();//create a matrix
	mat4.perspective(projectionMatrix, toRad(120), canvas.clientWidth / canvas.clientHeight, 0.1, 100);//set a perspective (what is shown and what is not)
    gl.uniformMatrix4fv(attribLocations.uniforms.projectionMatrix, gl.FALSE, projectionMatrix);//save it to the location

	/*---------create and send viewmatrix--------- */

	
    mat4.lookAt(viewMatrix,[0,0,4], [0, 0, 0], [0, 1, 0]);
    gl.uniformMatrix4fv(attribLocations.uniforms.viewMatrix, gl.FALSE, viewMatrix);

	/*create the shapes to be displayed */
	shapes.push(createTriangle());
	shapes.push(createCube());
	shapes.push(createTriangle());
	shapes.push(createCube());
	shapes.push(createTriangle());
	shapes.push(createCube());
	shapes.push(createTriangle());
	shapes.push(createCube());
	shapes.push(createTriangle());
	shapes[0].translate([-2, 2, 0]);
	shapes[1].translate([0, 2, 0]);
	shapes[2].translate([2, 2, 0]);
	shapes[3].translate([-2, 0, 0]);
	shapes[4].translate([0, 0, 0]);
	shapes[5].translate([2, 0, 0]);
	shapes[6].translate([-2, -2, 0]);
	shapes[7].translate([0, -2, 0]);
	shapes[8].translate([2, -2, 0]);
	render();

}

function render() {

    /* --------- calculate time per frame in seconds --------- */

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    shapes.forEach(shape => {

        /* --------- scale rotation by time difference --------- */
        //shape.rotate(0.1, [0, 1, 0]);
        shape.drawWithCoordinates();

    });

    //window.requestAnimationFrame(render)
	
}

/** functions and attributes to be used in keyboardEvents.js */
const directions = {//an Enum for directions
	UP: [0,1,0],
	DOWN: [0,-1,0],
	LEFT: [-1,0,0],
	RIGHT: [1,0,0],
}

function rotate(direction){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    shapes.forEach(shape => {

        shape.rotate(0.1, direction);
        shape.draw();

    });
}

function moveCamera(direction){
	var dir=[0,0,0];
	mat4.translate(viewMatrix, viewMatrix, direction);
    gl.uniformMatrix4fv(attribLocations.uniforms.viewMatrix, gl.FALSE, viewMatrix); 
	render();
}

function dragCamera(direction){
	var dir=[0,0,0];
	glMatrix.vec3.scale(dir,direction,0.001);//slow down the dragging.
	dir[0]=dir[0]*-1;//correcting an error, that makes dragging left drag right and vice versa
	mat4.translate(viewMatrix, viewMatrix, dir);
    gl.uniformMatrix4fv(attribLocations.uniforms.viewMatrix, gl.FALSE, viewMatrix); 
	render();
}
