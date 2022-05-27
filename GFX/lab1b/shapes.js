class ShapeFactory {
    constructor() { }

    createCube() {

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


        for (let i = 0; i < 6; i++) {

            for (let j = 0; j < 6; ++j) {

                colors.push(colorData[i]);
                normals.push(normalData[i]);

            }

        }

        const cube = new Shape();
        cube.initData(vertices, normals, colors);

        return cube;

    }

    createPyramid() {


        var pyramidVertices = [
            0.0, 0.5, 0, 1,
            -0.5, -0.5, -0.5, 1,
            0.5, -0.5, -0.5, 1,

            0.0, 0.5, 0, 1,
            -0.5, -0.5, -0.5, 1,
            0.5, -0.5, -0.5, 1,//back face

            0.0, 0.5, 0, 1,
            -0.5, -0.5, -0.5, 1,
            -0.5, -0.5, 0.5, 1,

            0.0, 0.5, 0, 1,
            -0.5, -0.5, -0.5, 1,
            -0.5, -0.5, 0.5, 1,//left face

            0.0, 0.5, 0, 1,
            0.5, -0.5, -0.5, 1,
            0.5, -0.5, 0.5, 1,

            0.0, 0.5, 0, 1,
            0.5, -0.5, -0.5, 1,
            0.5, -0.5, 0.5, 1,//right face

            0.0, 0.5, 0, 1,
            -0.5, -0.5, 0.5, 1,
            0.5, -0.5, 0.5, 1,

            0.0, 0.5, 0, 1,
            -0.5, -0.5, 0.5, 1,
            0.5, -0.5, 0.5, 1,//front face

            -0.5, -0.5, 0.5, 1,
            0.5, -0.5, -0.5, 1,
            0.5, -0.5, 0.5, 1,

            -0.5, -0.5, 0.5, 1,
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

            for (let i = 0; i < 6; ++i) {

                colors.push(color);

            }

        });

        const normals = [];
        for (let i = 0; i < pyramidVertices.length; i += 12) {
    
            let normal = vec3.create();
            const p1 = vec3.fromValues(pyramidVertices[i], pyramidVertices[i+1], pyramidVertices[i+2]);
            const p2 = vec3.fromValues(pyramidVertices[i+4], pyramidVertices[i+5], pyramidVertices[i+6]);
            const p3 = vec3.fromValues(pyramidVertices[i+8],pyramidVertices[i+9],pyramidVertices[i+10]);
            let v1=vec3.create();
            let v2=vec3.create();
            vec3.subtract(v1,p3,p2);
            vec3.subtract(v2,p3,p1);
            vec3.cross(normal, v1, v2);//The direction could be wrong
            vec3.normalize(normal,normal);
            for (let j = 0; j < 3; j++) {
                normals.push(normal);
            }
        }

 
        //manually correcting the direction
        for(let i=6;i<12;i++){
            normals[i][0]*=-1;
            normals[i][1]*=-1;
            normals[i][2]*=-1;
        }
        for(let i=18;i<27;i++){
            normals[i][0]*=-1;
            normals[i][1]*=-1;
            normals[i][2]*=-1;
        }

        const triangle = new Shape();
        triangle.initData(pyramidVertices, normals, colors)
        return triangle;

    }
}