class Shape {

    constructor() {

        this.vertices = [];
        this.colors = [];
        this.normals = [];

        this.buffers = {

            // initialize buffers
            vertexBuffer: gl.createBuffer(),
            colorBuffer: gl.createBuffer(),
            normalBuffer: gl.createBuffer()

        }

        // initialize transformation matrix
        this.transformationMatrix = mat4.create();
        // initialize normal matrix
        this.normalMatrix = mat3.create();

    }

    initData(vertices, colors, normals) {

        // flatten & convert to 32 bit float arrays
        this.vertices = new Float32Array(vertices.flat());
        this.colors = new Float32Array(colors.flat());
        this.normals = new Float32Array(normals.flat());

        // send data to buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);

    }

    draw() {

        // set up attribute arrays
        Shape.setupAttribute(this.buffers.vertexBuffer, currentProgram.attributes.vertexLocation);
        Shape.setupAttribute(this.buffers.colorBuffer, currentProgram.attributes.colorLocation);
        Shape.setupAttribute(this.buffers.normalBuffer, currentProgram.attributes.normalLocation, true);

        // send transformation matrix 
        gl.uniformMatrix4fv(currentProgram.uniforms.transformationMatrix, gl.FALSE, this.transformationMatrix);

        // compute normal matrix as inverse transpose of the model matrix...
        mat3.normalFromMat4(this.normalMatrix, this.transformationMatrix);
        // ... and send it to the GPU
        gl.uniformMatrix3fv(currentProgram.uniforms.normalMatrix, gl.FALSE, this.normalMatrix);

        // draw the shape
        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 4);

    }

    rotate(angle, axes) {

        mat4.rotate(this.transformationMatrix, this.transformationMatrix, angle, axes);

    }

    translate(vector) {

        mat4.translate(this.transformationMatrix, this.transformationMatrix, vector);

    }

    static setupAttribute(buffer, location, isNormal = false) {

        // Check if the location is invalid, and return if true
        if (location === -1) return;

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        gl.vertexAttribPointer(
            location, // The location of the attribute
            isNormal ? 3 : 4, // How many elements does each vertex consist of?
            gl.FLOAT, // Datatype of the attribute
            gl.FALSE, // Is our data normalized?
            (isNormal ? 3 : 4) * Float32Array.BYTES_PER_ELEMENT, // size for one vertex
            0 // Offset from the begin of the vertex to the attribute start
        );

        gl.enableVertexAttribArray(location);

    }

}
