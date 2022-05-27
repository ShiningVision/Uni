const mat4 = glMatrix.mat4;
const mat3 = glMatrix.mat3;
const vec3 = glMatrix.vec3;
const vec4 = glMatrix.vec4;
const toRad = glMatrix.glMatrix.toRadian;

let gl = null;

var viewMatrix = mat4.create();
var projectionMatrix = mat4.create();
var shininess = 120.0;
var lightLocation = vec4.fromValues(0.0, 10.0, 0.0, 1.0);
var ambient = 0.2;

const shaderInfo = {
	attributes: {
		vertexLocation: "vertPosition",
		colorLocation: "vertColor",
		normalLocation: "vertNormal",
	},
	uniforms: {
		transformationMatrix: "transformationMatrix",
		projectionMatrix: "projectionMatrix",
		viewMatrix: "viewMatrix",
		normalMatrix: "normalMatrix",
		shininess: "shininess",
		lightLocation: "lightLocation",
		ambient: "ambient",
	}
}
let collisionCoordinates = [];

const defaultColors = [
	// R, G, B, Alpha
	[0.0, 1.0, 1.0, 1.0],    // cyan
	[1.0, 0.0, 0.0, 1.0],    // red
	[0.0, 1.0, 0.0, 1.0],    // green
	[0.0, 0.0, 1.0, 1.0],    // blue
	[1.0, 1.0, 0.0, 1.0],    // yellow
	[1.0, 0.0, 1.0, 1.0],	 // margenta
];

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

const shaderPrograms={
	gDiffuse:null,
	gSpecular:null,
	pDiffuse:null,
	pSpecular:null,
	default:null
}

const ceiling = 10;
let gameOver = new Boolean(false);
gameOver=false;
let tetrisRotation = 1;
let pause = new Boolean(false);
pause = false;
let currentProgram = null;
//variable: if a single shape has been selected:
var focusOnSingleShape = new Boolean(false);
focusOnSingleShape = false;
//variable: if all shapes have been selected:
var focusOnAllShapes = new Boolean(false);
focusOnAllShapes = false;
//variable: if the camera is activated:
var activeCamera = new Boolean(false);
activeCamera = false;
//variable: if lightMovement is activated:
var activeLightSource = new Boolean(false);
activeLightSource = false;