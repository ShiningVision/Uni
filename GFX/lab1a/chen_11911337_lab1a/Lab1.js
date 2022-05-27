const mat4=glMatrix.mat4;
const vec3=glMatrix.vec3;
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


//variable: if a single shape has been selected:
var focusOnSingleShape = new Boolean(false);
//variable: if all shapes have been selected:
var focusOnAllShapes= new Boolean(false);
//variable: if the camera is activated:
var activeCamera= new Boolean(false);

var InitDemo = async function(){

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
	shapes.push(createTriangle());//to comment out to make space for obj object.
	shapes[0].translate([-3, 3, 0]);
	shapes[1].translate([0, 3, 0]);
	shapes[2].translate([3, 3, 0]);
	shapes[3].translate([-3, 0, 0]);
	shapes[4].translate([0, 0, 0]);
	shapes[5].translate([3, 0, 0]);
	shapes[6].translate([-3, -3, 0]);
	shapes[7].translate([0, -3, 0]);
	shapes[8].translate([3, -3, 0]);//to comment out to make space for obj object.

	/*replace the 9. object with an imported one on local server*/
	/*
	var text = loadObj('http://localhost:8000/sampleModels/cube.obj');
	var cube = parseOBJ((await text).valueOf());
	shapes.push(cube);
	shapes[8].translate([3, -3, 0]);
	 */
	
	render();



}

async function loadObj(path){
	const response = await fetch(path);
	const text = await response.text();
	return text;
}

function render() {

    /* --------- calculate time per frame in seconds --------- */

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    shapes.forEach(shape => {

        /* --------- scale rotation by time difference --------- */
        //shape.rotate(0.1, [0, 1, 0]);
		if(shape.focus==true){ // I don't know why I have to use == to get my desired result. Javascript seems to interpret the existence of the variable "focus" as true, instead of its value.
			shape.drawWithCoordinates();
		}else{
			shape.draw();
		}

    });

    //window.requestAnimationFrame(render)
	
}

/** functions and attributes to be used in keyboardEvents.js */
const directions = {//an Enum for camera directions
	UP: [0,1,0],
	DOWN: [0,-1,0],
	LEFT: [-1,0,0],
	RIGHT: [1,0,0],
}

const axes = {//an Enum for rotation and translation methods
	XLEFT: [1,0,0],
	XRIGHT: [-1,0,0],
	YLEFT: [0,1,0],
	YRIGHT: [0,-1,0],
	ZLEFT: [0,0,1],
	ZRIGHT: [0,0,-1],
}

function scale(axes,degree){
	
	//you can only scale a single shape:
	if(focusOnSingleShape==false)return;
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	shapes.forEach(shape => {
		
		if(shape.focus==true)
			shape.scale(axes, degree);
		
	});
	
	render();
}

function translate(axes){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	// moves all selected shapes into the desired direction:
	shapes.forEach(shape => {
		if(shape.focus==true)
			shape.translate(axes);
		
    });
	
	render();
	
}

function rotate(direction){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	//rotate around global axis
	if(focusOnAllShapes==true){
		globalRotate(0.1,direction);
		render();
		return;
	}
	
	
	//rotate all objects around their own axis
	if(focusOnSingleShape==false)
    shapes.forEach(shape => {

        rotation(shape, direction);

    });
	
	//rotate a single object around its own axis:
	if(focusOnSingleShape==true)
	shapes.forEach(shape => {
		
		if(shape.focus==true)
			shape.rotate(0.1, direction);
		
	})
	
	render();
}

//private function for rotate:
function rotation(shape, direction){
	shape.rotate(0.1, direction);
		
	if(shape.focus==true){
		shape.drawWithCoordinates();
	}else{
		shape.draw();
	}
}

//private function for global rotation:
function globalRotate(angle, axes){
	mat4.rotate(viewMatrix, viewMatrix, angle, axes);
	gl.uniformMatrix4fv(attribLocations.uniforms.viewMatrix, gl.FALSE, viewMatrix); 
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

function parseOBJ(text){
	const lines = text.split('\n');
	const keywords=['v ','f '];
	const points=[];
	const planes=[];
	for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
		const line = lines[lineNo].trim();
		if (line === '' || line.startsWith('#')) {
		  continue;
		}
		if(line.startsWith(keywords[0])){
			fields=line.split(' ');
			points.push([parseFloat(fields[1]),parseFloat(fields[2]),parseFloat(fields[3]),parseFloat(1)]);
		}
		else if(line.startsWith(keywords[1])){
			fields=line.split(' ');
			planes.push([fields[1],fields[2],fields[3]]);
		}
		
		else{
		  console.warn('unhandled keyword:',line[0],line[1], 'at line', lineNo + 1);
		  continue;
		}
	}
	const vertices=[];
	for(let planeNo=0; planeNo<planes.length;++planeNo){
		vertices.push([points[planes[planeNo][0]-1],points[planes[planeNo][1]-1],points[planes[planeNo][2]-1]]);
	}
	const colors=[];
	for(let vNo=0;vNo<vertices.length;vNo++){
		colors.push([1.0,0,0,1]);
		colors.push([0,1.0,0,1]);
		colors.push([0,0,1.0,1]);
	}

	var shape = new Shape();
	shape.initData(vertices.flat(), colors);
	return shape;
}
