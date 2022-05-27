
const  mat4  = glMatrix.mat4;
const toRad = glMatrix.glMatrix.toRadian;

const shapes = [];
let gl = null;

const locations = {

    attributes: {

        vertexLocation: null,
        colorLocation: null

    }, uniforms: {

        transformationMatrix: null,
        projectionMatrix: null,
        viewMatrix: null

    }
}

window.onload = () => {

    /* --------- basic setup --------- */

    let canvas = document.getElementById("canvas");
    gl = canvas.getContext("webgl");

    gl.enable(gl.DEPTH_TEST);

    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);

    gl.clearColor(0.729, 0.764, 0.674, 1);

    const program = createShaderProgram("v-shader", "f-shader");
    gl.useProgram(program);

    /* --------- save attribute & uniform locations --------- */

    locations.attributes.vertexLocation = gl.getAttribLocation(program, "vertexPosition");
    locations.attributes.colorLocation = gl.getAttribLocation(program, "vertexColor");
    locations.uniforms.transformationMatrix = gl.getUniformLocation(program, "transformationMatrix");
    locations.uniforms.projectionMatrix = gl.getUniformLocation(program, "projectionMatrix");
    locations.uniforms.viewMatrix = gl.getUniformLocation(program, "viewMatrix");

    /* --------- create & send projection matrix --------- */

    let projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, toRad(45), canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    gl.uniformMatrix4fv(locations.uniforms.projectionMatrix, gl.FALSE, projectionMatrix);

    /* --------- create & send view matrix --------- */

    let viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, [0, 0, 2], [0, 0, 0], [0, 1, 0]);
    gl.uniformMatrix4fv(locations.uniforms.viewMatrix, gl.FALSE, viewMatrix);

    /* --------- create 2 cubes and translate them away from each other --------- */

    shapes.push(createShape());
    shapes[0].translate([-0.4, 0, 0]);

    shapes.push(createShape());
    shapes[1].translate([0.4, 0, 0]);

    /* --------- start render loop --------- */

    render();

}

/* --------- simple example of loading external files --------- */

async function loadSomething() {

    const data = await fetch('Shape.js').then(result => result.text());
    console.log(data);

}


let then = 0;

function render(now = 0) {

    /* --------- calculate time per frame in seconds --------- */

    let delta = now - then;
    delta *= 0.001;
    then = now;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    shapes.forEach(shape => {

        /* --------- scale rotation by time difference --------- */
        shape.rotate(1 * delta, [1, 1, 0]);
        shape.draw();

    });

    requestAnimationFrame(render)

}


function createShape() {

    /* --------- define vertex positions & colors --------- */
    /* -------------- 3 vertices per triangle ------------- */

    const vertices = [

        // X, Y, Z, W
        0.2, 0.2, 0.2, 1,
        -0.2, 0.2, 0.2, 1,
        0.2, -0.2, 0.2, 1,

        -0.2, 0.2, 0.2, 1,
        -0.2, -0.2, 0.2, 1,
        0.2, -0.2, 0.2, 1, // front face end

        -0.2, -0.2, -0.2, 1,
        -0.2, -0.2, 0.2, 1,
        -0.2, 0.2, 0.2, 1,

        -0.2, -0.2, -0.2, 1,
        -0.2, 0.2, 0.2, 1,
        -0.2, 0.2, -0.2, 1, // left face end

        0.2, 0.2, -0.2, 1,
        -0.2, -0.2, -0.2, 1,
        -0.2, 0.2, -0.2, 1,

        0.2, 0.2, -0.2, 1,
        0.2, -0.2, -0.2, 1,
        -0.2, -0.2, -0.2, 1, // back face end

        0.2, -0.2, 0.2, 1,
        -0.2, -0.2, -0.2, 1,
        0.2, -0.2, -0.2, 1,

        0.2, -0.2, 0.2, 1,
        -0.2, -0.2, 0.2, 1,
        -0.2, -0.2, -0.2, 1, // bottom face end

        0.2, 0.2, 0.2, 1,
        0.2, -0.2, -0.2, 1,
        0.2, 0.2, -0.2, 1,

        0.2, -0.2, -0.2, 1,
        0.2, 0.2, 0.2, 1,
        0.2, -0.2, 0.2, 1, // right face end

        0.2, 0.2, 0.2, 1,
        0.2, 0.2, -0.2, 1,
        -0.2, 0.2, -0.2, 1,

        0.2, 0.2, 0.2, 1,
        -0.2, 0.2, -0.2, 1,
        -0.2, 0.2, 0.2, 1, // Top face end

    ];

    const colorData = [
        // R, G, B, Alpha
        [0.0, 0.0, 0.0, 1.0],    // Front face: black
        [1.0, 0.0, 0.0, 1.0],    // left face: red
        [0.0, 1.0, 0.0, 1.0],    // back face: green
        [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
        [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
        [1.0, 0.0, 1.0, 1.0],    // top face: purple
    ];

    const colors = [];

    colorData.forEach(color => {

        for (let i = 0; i < colorData.length; ++i) {

            colors.push(color);

        }

    });

    /* --------- create shape object and initialize data --------- */

    const cube = new Shape();

    cube.initData(vertices, colors)

    return cube;

}

