const shapes = [];
const grids = [];
var cameraPosition = [];

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
	/*
		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);
	*/




	/*--------create projectionmatrix--------- */

	mat4.perspective(projectionMatrix, toRad(45), canvas.clientWidth / canvas.clientHeight, 0.1, 100);//set a perspective (what is shown and what is not)

	/*---------create viewmatrix--------- */
	//position of the camera,point where camera is looking at,where up is
	mat4.lookAt(viewMatrix, [0, 20, 0], [0, 5, 0], [0, 0, 1]);

	let viewModel = mat4.create();
	mat4.invert(viewModel, viewMatrix);
	cameraPosition = vec3.fromValues(viewModel[12], viewModel[13], viewModel[14]);

	shaderPrograms.gDiffuse = new ShaderProgram(diffuseVertexText, fragmentShaderText, shaderInfo);
	shaderPrograms.gSpecular = new ShaderProgram(specularVertexText, fragmentShaderText, shaderInfo);
	shaderPrograms.pDiffuse = new ShaderProgram(vertexShaderText, diffuseFragmentText, shaderInfo);
	shaderPrograms.pSpecular = new ShaderProgram(vertexShaderText, specularFragmentText, shaderInfo);
	shaderPrograms.default = new ShaderProgram(vertexShaderText, fragmentShaderText, shaderInfo);
	shaderPrograms.gDiffuse.enable();

	/*create the grid */
	let floor = createGridFloor([0, 1, 0]);
	grids.push(floor);
	let frontWall = createGridWall([0, 0, 1]);
	grids.push(frontWall);
	let ceiling = createGridFloor([0, -1, 0]);
	ceiling.translate([0, 10, 0]);
	grids.push(ceiling);
	let backWall = createGridWall([0, 0, -1]);
	backWall.rotate(180, axes.YLEFT);
	grids.push(backWall);
	let leftWall = createGridWall([1, 0, 0]);
	leftWall.rotate(90, axes.YLEFT);
	grids.push(leftWall);
	let rightWall = createGridWall([-1, 0, 0]);
	rightWall.rotate(90, axes.YRIGHT);
	grids.push(rightWall);

	/*create shapes */
	shapes.push(createTetra());

	/*---------move the shapes to the right position---------- */

	shapes[shapes.length - 1].translate([0, 11, 0]);

	let collision = false;
	render();

	//create a ground objects can collide against:
	for (let i = -2; i < 2; i++) {
		for (let j = -2; j < 2; j++) {
			collisionCoordinates.push([i, 0, j]);
		}
	}





	while (!gameOver) {

		let countUp = 1;
		while (!collision) {
			await timeout(1000);
			shapes[shapes.length - 1].translate(axes.YRIGHT);//gravity
			//console.log("begin collisiontest");
			if (countUp != 1) {
				if (shapes[shapes.length - 1].collide() == true) {
					collision = true;

				}
			}
			//console.log("end collisiontest");
			render();
			countUp++;
			if (pause == true) await pauseContinue();
		}
		collision = false;
		console.log("collision!");
		checkGameOver();
		//fill the new collision-options into the system:
		shapes[shapes.length - 1].addToCollidableObjects();

		shapes.push(createTetra());
		shapes[shapes.length - 1].translate([0, 11, 0]);
		//for some reason upon creation of a tetracluster. all cubes vertices are at origin.
		//So I just made the first collision not count instead of looking for the problem!
	}


	//requestAnimationFrame(renderAnimation);

}

function checkGameOver() {
	if (shapes[shapes.length - 1].checkTileAboveCeiling()) {
		gameOver = true;
		alert("GAME OVER!");
	}
}

function pauseContinue() {
	return new Promise(resolve => {
		window.addEventListener('keydown', (input) => {
			if (input.key == 'p') {
				resolve();
			}
		})
	})
}

function timeout(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
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

	//show only the grids that do not block the view inside:
	grids.forEach(grid => {
		let eyeVector = vec3.create();
		vec3.negate(eyeVector, cameraPosition);
		let norm = vec3.dot(grid.getNormal(), cameraPosition);
		if (norm >= 0) grid.draw();
	})


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
	if (activeLightSource == true) {
		translateLight(axes);
		render();
		return;
	}

	shapes[shapes.length - 1].translate(axes);
	render();

}
//private function used in translate(axes)
function translateLight(axes) {
	let v = new Float32Array(axes);
	let moveDistance = new Float32Array([1.1, 1.1, 1.1]);
	vec3.multiply(v, v, moveDistance);
	let move = vec4.fromValues(v[0], v[1], v[2], 0.0);
	vec4.add(this.lightLocation, this.lightLocation, move);
	gl.uniform4fv(currentProgram.uniforms.lightLocation, lightLocation);
}


function rotate(axes) {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//rotate a single object around its own axis:
	shapes[shapes.length - 1].rotate(90, axes);
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
	mat4.translate(viewMatrix, viewMatrix, direction);
	gl.uniformMatrix4fv(currentProgram.uniforms.viewMatrix, gl.FALSE, viewMatrix);
	render();
}

function rotateCamera(axe) {
	switch (axe) {
		case axes.XLEFT:
			mat4.rotateX(viewMatrix, viewMatrix, -0.1);
			gl.uniformMatrix4fv(currentProgram.uniforms.viewMatrix, gl.FALSE, viewMatrix);
			render();
			break;
		case axes.XRIGHT:
			mat4.rotateX(viewMatrix, viewMatrix, 0.1);
			gl.uniformMatrix4fv(currentProgram.uniforms.viewMatrix, gl.FALSE, viewMatrix);
			render();
			break;
		case axes.YLEFT:
			mat4.rotateY(viewMatrix, viewMatrix, -0.1);
			gl.uniformMatrix4fv(currentProgram.uniforms.viewMatrix, gl.FALSE, viewMatrix);
			render();
			break;
		case axes.YRIGHT:
			mat4.rotateY(viewMatrix, viewMatrix, 0.1);
			gl.uniformMatrix4fv(currentProgram.uniforms.viewMatrix, gl.FALSE, viewMatrix);
			render();
			break;
		case axes.ZLEFT:
			mat4.rotateZ(viewMatrix, viewMatrix, -0.1);
			gl.uniformMatrix4fv(currentProgram.uniforms.viewMatrix, gl.FALSE, viewMatrix);
			render();
			break;
		case axes.ZRIGHT:
			mat4.rotateZ(viewMatrix, viewMatrix, 0.1);
			gl.uniformMatrix4fv(currentProgram.uniforms.viewMatrix, gl.FALSE, viewMatrix);
			render();
			break;
		default:
			return;
	}
	let viewModel = mat4.create();
	mat4.invert(viewModel, viewMatrix);
	cameraPosition = vec3.fromValues(viewModel[12], viewModel[13], viewModel[14]);
}

function zoomCamera(inout) {

	let eyeVector =vec3.fromValues(viewMatrix[12],viewMatrix[13],viewMatrix[14]);
	
	
	switch (inout) {
		case '+':
			vec3.scale(eyeVector,eyeVector,0.9);
			viewMatrix[12]=eyeVector[0];
			viewMatrix[13]=eyeVector[1];
			viewMatrix[14]=eyeVector[2];
			gl.uniformMatrix4fv(currentProgram.uniforms.viewMatrix, gl.FALSE, viewMatrix);
			render();
			break;
		case '-':
			vec3.scale(eyeVector,eyeVector,1.1);
			viewMatrix[12]=eyeVector[0];
			viewMatrix[13]=eyeVector[1];
			viewMatrix[14]=eyeVector[2];
			gl.uniformMatrix4fv(currentProgram.uniforms.viewMatrix, gl.FALSE, viewMatrix);
			render();
			break;
	}
}

function dragCamera(direction) {
	var dir = [0, 0, 0];
	glMatrix.vec3.scale(dir, direction, 0.001);//slow down the dragging.
	//dir[0] = dir[0] * -1;//correcting an error, that makes dragging left drag right and vice versa
	mat4.translate(viewMatrix, viewMatrix, dir);
	gl.uniformMatrix4fv(currentProgram.uniforms.viewMatrix, gl.FALSE, viewMatrix);
	render();
}
