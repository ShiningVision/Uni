const shapes = [];


var InitDemo = async function () {

	/*---------------first steps------------*/

	console.log("triangleGl.js is working");

	var canvas = document.getElementById("theScreen");
	gl = canvas.getContext('webgl');
	checkWebGLSupport(gl);
	gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
	gl.enable(gl.DEPTH_TEST);
	gl.clearColor(0.729, 0.764, 0.674, 1);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);





	/*--------create projectionmatrix--------- */

	mat4.perspective(projectionMatrix, toRad(45), canvas.clientWidth / canvas.clientHeight, 0.1, 100);//set a perspective (what is shown and what is not)

	/*---------create viewmatrix--------- */

	mat4.lookAt(viewMatrix, [0, 0, 4], [0, 0, 0], [0, 1, 0]);
	

	shaderPrograms.gDiffuse = new ShaderProgram(diffuseVertexText, fragmentShaderText, shaderInfo);
	shaderPrograms.gSpecular = new ShaderProgram(specularVertexText, fragmentShaderText, shaderInfo);
	shaderPrograms.pDiffuse = new ShaderProgram(vertexShaderText, diffuseFragmentText, shaderInfo);
	shaderPrograms.pSpecular = new ShaderProgram(vertexShaderText, specularFragmentText, shaderInfo);

	shaderPrograms.gDiffuse.enable();

	/*create the shapes to be displayed */
	const factory=new ShapeFactory;
	shapes.push(factory.createPyramid());
	shapes.push(factory.createCube());
	shapes.push(factory.createPyramid());
	shapes.push(factory.createCube());

	var text = loadObj('http://localhost:8000/sampleModels/teapot.obj');
	var cubeData = parseOBJ2((await text).valueOf());
	var cube = new Shape();
	cube.initData(cubeData.position,cubeData.normal);
	shapes.push(cube);

	shapes.push(factory.createPyramid());

	var text = loadObj('http://localhost:8000/sampleModels/sphere.obj');
	var sphereData = parseOBJ2((await text).valueOf());
	var sphere = new Shape();
	sphere.initData(sphereData.position,sphereData.normal);
	shapes.push(sphere);

	shapes.push(factory.createCube());
	shapes.push(factory.createPyramid());

	/*---------move the shapes to the right position---------- */
	shapes[0].translate([-3, 3, -7]);
	shapes[1].translate([0, 3, -7]);
	shapes[2].translate([3, 3, -7]);
	shapes[3].translate([-3, 0, -7]);
	shapes[4].translate([0, 0, -7]);
	shapes[5].translate([3, 0, -7]);
	shapes[6].translate([-7, -7, -20]);
	shapes[7].translate([0, -3, -7]);
	shapes[8].translate([3, -3, -7]);
	render();

	//requestAnimationFrame(renderAnimation);

}

async function loadObj(path) {
	const response = await fetch(path);
	const text = await response.text();
	return text;
}

let then = 0;
function renderAnimation(now = 0) {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	let delta = now - then;
	delta *= 0.001;
	then = now;

	shapes.forEach(shape => {

		/* --------- scale rotation by time difference --------- */
		shape.rotate(1 * delta, [-1, 1.2, 0]);
		shape.draw(shape.focus)

	});

	requestAnimationFrame(renderAnimation);
}

function render() {

	/* --------- calculate time per frame in seconds --------- */

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	shapes.forEach(shape => {

		/* --------- scale rotation by time difference --------- */
		//shape.rotate(0.1, [0, 1, 0]);
		if (shape.focus == true) { // I don't know why I have to use == to get my desired result. Javascript seems to interpret the existence of the variable "focus" as true, instead of its value.
			shape.draw(true);
		} else {
			shape.draw();
		}

	});


}

/** functions and attributes to be used in keyboardEvents.js */
const directions = {//an Enum for camera directions
	UP: [0, 1, 0],
	DOWN: [0, -1, 0],
	LEFT: [-1, 0, 0],
	RIGHT: [1, 0, 0],
}

const axes = {//an Enum for rotation and translation methods
	XLEFT: [1, 0, 0],
	XRIGHT: [-1, 0, 0],
	YLEFT: [0, 1, 0],
	YRIGHT: [0, -1, 0],
	ZLEFT: [0, 0, 1],
	ZRIGHT: [0, 0, -1],
}

function scale(axes, degree) {

	//you can only scale a single shape:
	if (focusOnSingleShape == false) return;

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	shapes.forEach(shape => {

		if (shape.focus == true)
			shape.scale(axes, degree);

	});

	render();
}

function translate(axes) {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	if(activeLightSource==true){
		translateLight(axes);
		render();
		return;
	}
	// moves all selected shapes into the desired direction:
	shapes.forEach(shape => {
		if (shape.focus == true)
			shape.translate(axes);

	});
	render();

}
//private function used in translate(axes)
function translateLight(axes){
	let v = new Float32Array(axes);
	let moveDistance = new Float32Array([1.1,1.1,1.1]);
	vec3.multiply(v,v,moveDistance);
	let move = vec4.fromValues(v[0],v[1],v[2],0.0);
	vec4.add(this.lightLocation, this.lightLocation, move);
	gl.uniform4fv(currentProgram.uniforms.lightLocation,lightLocation);
}


function rotate(direction) {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//rotate around global axis
	if (focusOnAllShapes == true) {
		globalRotate(0.1, direction);
		render();
		return;
	}


	//rotate all objects around their own axis
	if (focusOnSingleShape == false)
		shapes.forEach(shape => {

			rotation(shape, direction);

		});

	//rotate a single object around its own axis:
	if (focusOnSingleShape == true)
		shapes.forEach(shape => {

			if (shape.focus == true)
				shape.rotate(0.1, direction);

		})

	render();
}

//private function for rotate:
function rotation(shape, direction) {
	shape.rotate(0.1, direction);

	if (shape.focus == true) {
		shape.drawWithCoordinates();
	} else {
		shape.draw();
	}
}



//private function for global rotation:
function globalRotate(angle, axes) {
	mat4.rotate(projectionMatrix, projectionMatrix, angle, axes);
	gl.uniformMatrix4fv(currentProgram.uniforms.projectionMatrix, gl.FALSE, projectionMatrix);
}

function moveCamera(direction) {
	var dir = [0, 0, 0];
	mat4.translate(viewMatrix, viewMatrix, direction);
	gl.uniformMatrix4fv(currentProgram.uniforms.viewMatrix, gl.FALSE, viewMatrix);
	render();
}

function dragCamera(direction) {
	var dir = [0, 0, 0];
	glMatrix.vec3.scale(dir, direction, 0.001);//slow down the dragging.
	dir[0] = dir[0] * -1;//correcting an error, that makes dragging left drag right and vice versa
	mat4.translate(viewMatrix, viewMatrix, dir);
	gl.uniformMatrix4fv(currentProgram.uniforms.viewMatrix, gl.FALSE, viewMatrix);
	render();
}
