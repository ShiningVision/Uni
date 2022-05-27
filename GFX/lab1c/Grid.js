

class Grid {

    constructor() {

        this.vertices = [];
        this.colors = [];
        this.normals = [];
        this.normal = [];
        this.buffers = {
            vertexBuffer: gl.createBuffer(),
            colorBuffer: gl.createBuffer(),
            normalBuffer: gl.createBuffer(),
        }

        this.transformationMatrix = mat4.create();// for the transformation-operations
        this.translationMatrix = mat4.create();
        this.rotationMatrix = mat4.create();
        this.normalMatrix = mat3.create();

    }

    parseFloat32Array(arr) {
        if (arr[0] instanceof Float32Array)
            return new Float32Array(arr.map(a => Array.from(a)).flat());
        return new Float32Array(arr.flat());
    }

    initData(vertices, normal) {

        this.vertices = this.parseFloat32Array(vertices);
        const vertexeCount = this.vertices.length / 4;
        let colors = [];

        for (let i = 0; i < vertexeCount; i++) {
            colors.push(defaultColors[1]);
        }

        let normals = [];

        for (let i = 0; i < vertexeCount; i++) {
            normals.push(normal);
        }


        this.normal = this.parseFloat32Array(normal);
        this.colors = this.parseFloat32Array(colors);
        this.normals = this.parseFloat32Array(normals);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);


    }

    draw() {
        Shape.setUpAttribute(this.buffers.vertexBuffer, currentProgram.attributes.vertexLocation);
        Shape.setUpAttribute(this.buffers.colorBuffer, currentProgram.attributes.colorLocation);
        Shape.setUpAttribute(this.buffers.normalBuffer, currentProgram.attributes.normalLocation, true);

        mat4.multiply(this.transformationMatrix,this.translationMatrix,this.rotationMatrix);

        gl.uniformMatrix4fv(currentProgram.uniforms.transformationMatrix, gl.FALSE, this.transformationMatrix);
        mat3.normalFromMat4(this.normalMatrix, this.transformationMatrix);
        gl.uniformMatrix3fv(currentProgram.uniforms.normalMatrix, gl.FALSE, this.normalMatrix);

        gl.drawArrays(gl.LINES, 0, this.vertices.length / 4);

    }



    //private function for scale:


    static setUpAttribute(buffer, attribLocation, isNormal = false) {

        if (attribLocation === -1) return;

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        gl.vertexAttribPointer(
            attribLocation,//Attribute location
            isNormal ? 3 : 4,//Number of elements per attribute
            gl.FLOAT,//Type of elements
            gl.FALSE,
            (isNormal ? 3 : 4) * Float32Array.BYTES_PER_ELEMENT,//Size of an individual vertex
            0//Offset from the beginning of a single vertex to this attribute
        );

        gl.enableVertexAttribArray(attribLocation);
    }

    rotate(angle, axe) {
		mat4.rotate(this.rotationMatrix, this.rotationMatrix, toRad(angle), axe);
	}

	translate(axe) {
		var v = new Float32Array(axe);
		var moveDistance = new Float32Array([1.0, 1.0, 1.0]);
		vec3.multiply(v, v, moveDistance);
		mat4.translate(this.translationMatrix, this.translationMatrix, v);
	}

    getNormal(){
        return this.normal;
    }
}

function createGridFloor(normal) {
    const vertices = [
        //base grid
        //horizontal lines:
        [-2, 0, 0, 1],
        [2, 0, 0, 1],
        [-2, 0, -1, 1],
        [2, 0, -1, 1],
        [-2, 0, 1, 1],
        [2, 0, 1, 1],
        [-2, 0, 2, 1],
        [2, 0, 2, 1],
        [-2, 0, -2, 1],
        [2, 0, -2, 1],
        //vertical lines:
        [0, 0, -2, 1],
        [0, 0, 2, 1],
        [1, 0, -2, 1],
        [1, 0, 2, 1],
        [2, 0, -2, 1],
        [2, 0, 2, 1],
        [-1, 0, -2, 1],
        [-1, 0, 2, 1],
        [-2, 0, -2, 1],
        [-2, 0, 2, 1],
    ];
    const normalVector=normal;
    const grid = new Grid();
    grid.initData(vertices, normalVector);
    return grid;

    /*

    const vertices2 = [
        //right grid
        //vertical lines:
        [2, 0, -2, 1],
        [2, 10, -2, 1],
        [2, 0, -1, 1],
        [2, 10, -1, 1],
        [2, 0, 0, 1],
        [2, 10, 0, 1],
        [2, 0, 1, 1],
        [2, 10, 1, 1],
        [2, 0, 2, 1],
        [2, 10, 2, 1],
        //horizontal lines:
        [2, 0, -2, 1],
        [2, 0, 2, 1],
        [2, 1, -2, 1],
        [2, 1, 2, 1],
        [2, 2, -2, 1],
        [2, 2, 2, 1],
        [2, 3, -2, 1],
        [2, 3, 2, 1],
        [2, 4, -2, 1],
        [2, 4, 2, 1],
        [2, 5, -2, 1],
        [2, 5, 2, 1],
        [2, 6, -2, 1],
        [2, 6, 2, 1],
        [2, 7, -2, 1],
        [2, 7, 2, 1],
        [2, 8, -2, 1],
        [2, 8, 2, 1],
        [2, 9, -2, 1],
        [2, 9, 2, 1],
        [2, 10, -2, 1],
        [2, 10, 2, 1],
    ]
    const normal2 = [-1.0, 0.0, 0.0];
    const grid2 = new Grid();
    grid2.initData(vertices2, normal2);
    grid2.draw();

    const vertices3 = [
        //back grid
        //vertical lines:
        [-2, 0, -2, 1],
        [-2, 10, -2, 1],
        [-1, 0, -2, 1],
        [-1, 10, -2, 1],
        [0, 0, -2, 1],
        [0, 10, -2, 1],
        [1, 0, -2, 1],
        [1, 10, -2, 1],
        [2, 0, -2, 1],
        [2, 10, -2, 1],
        //horizontal lines:
        [-2, 0, -2, 1],
        [2, 0, -2, 1],
        [-2, 1, -2, 1],
        [2, 1, -2, 1],
        [-2, 2, -2, 1],
        [2, 2, -2, 1],
        [-2, 3, -2, 1],
        [2, 3, -2, 1],
        [-2, 4, -2, 1],
        [2, 4, -2, 1],
        [-2, 5, -2, 1],
        [2, 5, -2, 1],
        [-2, 6, -2, 1],
        [2, 6, -2, 1],
        [-2, 7, -2, 1],
        [2, 7, -2, 1],
        [-2, 8, -2, 1],
        [2, 8, -2, 1],
        [-2, 9, -2, 1],
        [2, 9, -2, 1],
        [-2, 10, -2, 1],
        [2, 10, -2, 1],
    ]
    const normal3 = [0.0, 0.0, 1.0];
    const grid3 = new Grid();
    grid3.initData(vertices3, normal3);
    grid3.draw();

    const vertices4 = [
        //front grid
        //vertical lines:
        [-2, 0, 2, 1],
        [-2, 10, 2, 1],
        [-1, 0, 2, 1],
        [-1, 10, 2, 1],
        [0, 0, 2, 1],
        [0, 10, 2, 1],
        [1, 0, 2, 1],
        [1, 10, 2, 1],
        [2, 0, 2, 1],
        [2, 10, 2, 1],
        //horizontal lines:
        [-2, 0, 2, 1],
        [2, 0, 2, 1],
        [-2, 1, 2, 1],
        [2, 1, 2, 1],
        [-2, 2, 2, 1],
        [2, 2, 2, 1],
        [-2, 3, 2, 1],
        [2, 3, 2, 1],
        [-2, 4, 2, 1],
        [2, 4, 2, 1],
        [-2, 5, 2, 1],
        [2, 5, 2, 1],
        [-2, 6, 2, 1],
        [2, 6, 2, 1],
        [-2, 7, 2, 1],
        [2, 7, 2, 1],
        [-2, 8, 2, 1],
        [2, 8, 2, 1],
        [-2, 9, 2, 1],
        [2, 9, 2, 1],
        [-2, 10, 2, 1],
        [2, 10, 2, 1],
    ]
    const normal4 = [0.0, 0.0, -1.0];
    const grid4 = new Grid();
    grid4.initData(vertices4, normal4);
    grid4.draw();*/

    
}
function createGridWall(normal){
    const vertices = [
        //back grid
        //vertical lines:
        [-2, 0, -2, 1],
        [-2, 10, -2, 1],
        [-1, 0, -2, 1],
        [-1, 10, -2, 1],
        [0, 0, -2, 1],
        [0, 10, -2, 1],
        [1, 0, -2, 1],
        [1, 10, -2, 1],
        [2, 0, -2, 1],
        [2, 10, -2, 1],
        //horizontal lines:
        [-2, 0, -2, 1],
        [2, 0, -2, 1],
        [-2, 1, -2, 1],
        [2, 1, -2, 1],
        [-2, 2, -2, 1],
        [2, 2, -2, 1],
        [-2, 3, -2, 1],
        [2, 3, -2, 1],
        [-2, 4, -2, 1],
        [2, 4, -2, 1],
        [-2, 5, -2, 1],
        [2, 5, -2, 1],
        [-2, 6, -2, 1],
        [2, 6, -2, 1],
        [-2, 7, -2, 1],
        [2, 7, -2, 1],
        [-2, 8, -2, 1],
        [2, 8, -2, 1],
        [-2, 9, -2, 1],
        [2, 9, -2, 1],
        [-2, 10, -2, 1],
        [2, 10, -2, 1],
    ]
    const normalVector = normal;
    const grid1 = new Grid();
    grid1.initData(vertices, normalVector);
    return grid1;
}