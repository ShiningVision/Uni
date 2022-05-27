
// Flag for determining which shader program to switch to
let flag = true;

window.onload = () => {

    // basic setup
    let canvas = document.getElementById("canvas");
    gl = canvas.getContext("webgl");

    gl.enable(gl.DEPTH_TEST);

    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);

    gl.clearColor(0.729, 0.764, 0.674, 1);

    // Create and save view and projection matrix
    mat4.perspective(matrices.projection, toRad(45), canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    mat4.lookAt(matrices.view, [0, 0, 2], [0, 0, 0], [0, 1, 0]);

    // create 2 different shaderprograms
    shaderPrograms.noLight = new ShaderProgram(shaderIds.noLight, "f-shader", shaderInfo);
    shaderPrograms.withLight = new ShaderProgram(shaderIds.withLight, "f-shader", shaderInfo);

    // enable shader program
    shaderPrograms.noLight.enable();

    // create 2 cubes and translate them away from each other
    shapes.push(createShape());
    shapes[0].translate([-0.4, 0, 0]);

    shapes.push(createShape());
    shapes[1].translate([0.4, 0, 0]);

    // Add a keypress event listener
    window.addEventListener("keypress", () => {

        // switch the current shader program depending on the value of the flag
        if (flag) shaderPrograms.withLight.enable();
        else shaderPrograms.noLight.enable();
        // flip the flag
        flag = !flag;

    })

    // start render loop
    requestAnimationFrame(render());

}

let then = 0;

function render(now = 0) {

    // calculate time per frame in seconds 
    let delta = now - then;
    delta *= 0.001;
    then = now;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    shapes.forEach(shape => {

        // scale rotation amount by the time passed since the last frame
        shape.rotate(1 * delta, [1, 1, 0]);
        shape.draw();

    });

    requestAnimationFrame(render)

}


function createShape() {

    // define vertex positions & colors 
    // 3 vertices per triangle

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
        [1.0, 0.66, 0.16, 1.0],  // Front face: orange
        [1.0, 0.0, 0.0, 1.0],    // left face: red
        [0.0, 1.0, 0.0, 1.0],    // back face: green
        [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
        [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
        [1.0, 0.0, 1.0, 1.0],    // top face: purple
    ];

    const colors = [];

    const normalData = [
        // X, Y, Z
        [0, 0, 1],  // front
        [-1, 0, 0], // left
        [0, 0, -1], // back
        [0, -1, 0], // bottom
        [1, 0, 0],  // right
        [0, 1, 0],  // top
    ]

    const normals = [];

    // Fill the arrays with the required data
    for (let i = 0; i < 6; ++i) {

        for (let j = 0; j < 6; ++j) {

            colors.push(colorData[i]);
            normals.push(normalData[i]);

        }

    };

    // create shape object and initialize data
    const cube = new Shape();
    cube.initData(vertices, colors, normals)

    return cube;

}

