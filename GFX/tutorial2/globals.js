const { mat4, mat3 } = glMatrix;
const toRad = glMatrix.glMatrix.toRadian;

let gl = null;

const shapes = [];

const shaderIds = {
    noLight: "v-shader-nolight",
    withLight: "v-shader-withlight"
}

const matrices = {
    projection: mat4.create(),
    view: mat4.create()
}

const shaderInfo = {
    attributes: {
        vertexLocation: "vertexPosition",
        colorLocation: "vertexColor",
        normalLocation: "vertexNormal"
    }, uniforms: {
        transformationMatrix: "transformationMatrix",
        projectionMatrix: "projectionMatrix",
        viewMatrix: "viewMatrix",
        normalMatrix: "normalMatrix"
    }
}

let currentProgram = null;

const shaderPrograms = {
    noLight: null,
    withLight: null
}