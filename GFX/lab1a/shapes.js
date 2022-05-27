function createCube() {

    /* --------- define vertex positions & colors --------- */
    /* -------------- 3 vertices per triangle ------------- */

    const vertices = [

        0.5, 0.5, 0.5, 1,
        -0.5, 0.5, 0.5, 1,
        0.5, -0.5, 0.5, 1,

        -0.5, 0.5, 0.5, 1,
        -0.5, -0.5, 0.5, 1,
        0.5, -0.5, 0.5, 1, // front face end

        -0.5, -0.5, -0.5, 1,
        -0.5, -0.5, 0.5, 1,
        -0.5, 0.5, 0.5, 1,

        -0.5, -0.5, -0.5, 1,
        -0.5, 0.5, 0.5, 1,
        -0.5, 0.5, -0.5, 1, // left face end

        0.5, 0.5, -0.5, 1,
        -0.5, -0.5, -0.5, 1,
        -0.5, 0.5, -0.5, 1,

        0.5, 0.5, -0.5, 1,
        0.5, -0.5, -0.5, 1,
        -0.5, -0.5, -0.5, 1, // back face end

        0.5, -0.5, 0.5, 1,
        -0.5, -0.5, -0.5, 1,
        0.5, -0.5, -0.5, 1,

        0.5, -0.5, 0.5, 1,
        -0.5, -0.5, 0.5, 1,
        -0.5, -0.5, -0.5, 1, // bottom face end

        0.5, 0.5, 0.5, 1,
        0.5, -0.5, -0.5, 1,
        0.5, 0.5, -0.5, 1,

        0.5, -0.5, -0.5, 1,
        0.5, 0.5, 0.5, 1,
        0.5, -0.5, 0.5, 1, // right face end

        0.5, 0.5, 0.5, 1,
        0.5, 0.5, -0.5, 1,
        -0.5, 0.5, -0.5, 1,

        0.5, 0.5, 0.5, 1,
        -0.5, 0.5, -0.5, 1,
        -0.5, 0.5, 0.5, 1, // Top face end

    ];

    const colorData = [
        // R, G, B, Alpha
        [0.0, 0.0, 0.0, 1.0],    // Front face: black
        [1.0, 0.0, 0.0, 1.0],    // left face: red
        [0.0, 1.0, 0.0, 1.0],    // back face: green
        [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
        [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
        [1.0, 0.0, 1.0, 1.0],	 // top face: purple
    ];

    const colors = [];

    colorData.forEach(color => {

        for (let i = 0; i < 6; ++i) {

            colors.push(color);

        }

    });
	

    const cube = new Shape();
    cube.initData(vertices, colors)

    return cube;

}

function createTriangle(){


	var triangleVertices=[
		0.0, 0.5, 0, 1,
		-0.5,-0.5, -0.5, 1,
		0.5, -0.5, -0.5, 1,

		0.0, 0.5, 0, 1,
		-0.5,-0.5, -0.5, 1,
		0.5, -0.5, -0.5, 1,//back face

		0.0, 0.5, 0, 1,
		-0.5,-0.5, -0.5, 1,
		-0.5, -0.5, 0.5, 1,

		0.0, 0.5, 0, 1,
		-0.5,-0.5, -0.5, 1,
		-0.5, -0.5, 0.5, 1,//left face

		0.0, 0.5, 0, 1,
		0.5,-0.5, -0.5, 1,
		0.5, -0.5, 0.5, 1,

		0.0, 0.5, 0, 1,
		0.5,-0.5, -0.5, 1,
		0.5, -0.5, 0.5, 1,//right face

		0.0, 0.5, 0, 1,
		-0.5,-0.5, 0.5, 1,
		0.5, -0.5, 0.5, 1,

		0.0, 0.5, 0, 1,
		-0.5,-0.5, 0.5, 1,
		0.5, -0.5, 0.5, 1,//front face

		-0.5,-0.5, 0.5, 1,
		0.5, -0.5, -0.5, 1,
		0.5, -0.5, 0.5, 1,

		-0.5,-0.5, 0.5, 1,
		0.5, -0.5, -0.5, 1,
		-0.5, -0.5, -0.5, 1,//bottom square
	]
	
	const colorData = [
        // R, G, B, Alpha
        [1.0, 0.0, 0.0, 1.0],    // left face: red
        [0.0, 1.0, 0.0, 1.0],    // back face: green
        [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
        [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
        [1.0, 0.0, 1.0, 1.0],    // top face: purple
		[1.0, 0.0, 1.0, 1.0],    // top face: purple

    ];
	const colors = [];

    colorData.forEach(color => {

        for (let i = 0; i < colorData.length; ++i) {

            colors.push(color);

        }

    });
	const triangle=new Shape();
	triangle.initData(triangleVertices,colors)
	return triangle;

}