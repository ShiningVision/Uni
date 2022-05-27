class Shape{
    constructor(){
		
        this.vertices=[
			2,0,0,1,
			-2,0,0,1,
		];
        this.colors=[1.0, 0.0, 0.0, 1.0, ];
        this.buffers={
            vertexBuffer:gl.createBuffer(),
            colorBuffer:gl.createBuffer(),
        }
        this.transformationMatrix=mat4.create();// for the transformation-operations
		
		/* ---------- for coordinate system ----------- */
		this.cVertices=[
			2,0,0,1,
			-2,0,0,1,
		];
		
		this.cColors=[
			1.0, 0.0, 0.0, 1.0,    // red
		];
		
		this.cBuffers={
			vertexBuffer:gl.createBuffer(),
            colorBuffer:gl.createBuffer(),
		}
		/* ---------- thats all for coordinate system -------- */
    }

    initData(vertices,colors){
        this.vertices=new Float32Array(vertices.flat());
        this.colors=new Float32Array(colors.flat());


        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);

		/* -------------- for coordinate system --------------- */
		gl.bindBuffer(gl.ARRAY_BUFFER, this.cBuffers.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.cVertices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.cBuffers.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.cColors, gl.STATIC_DRAW);
		
		/* ---------- thats all for coordinate system -------- */
    }

    draw(){
        Shape.setUpAttribute(this.buffers.vertexBuffer,attribLocations.attributes.vertexLocation);
        Shape.setUpAttribute(this.buffers.colorBuffer,attribLocations.attributes.colorLocation);

        gl.uniformMatrix4fv(attribLocations.uniforms.transformationMatrix,gl.FALSE,this.transformationMatrix);
        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 4);
        
    }
	
	drawWithCoordinates(){
		
		Shape.setUpAttribute(this.buffers.vertexBuffer,attribLocations.attributes.vertexLocation);
        Shape.setUpAttribute(this.buffers.colorBuffer,attribLocations.attributes.colorLocation);

        gl.uniformMatrix4fv(attribLocations.uniforms.transformationMatrix,gl.FALSE,this.transformationMatrix);
        //gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 4);
		
		//Shape.setUpAttribute(this.cBuffers.vertexBuffer,attribLocations.attributes.vertexLocation);
        //Shape.setUpAttribute(this.cBuffers.colorBuffer,attribLocations.attributes.colorLocation);
		
		//gl.uniformMatrix4fv(attribLocations.uniforms.transformationMatrix,gl.FALSE,this.transformationMatrix);
        
		gl.drawArrays(gl.LINES, 0, this.cVertices.length / 4);
	}

    rotate(angle, axes){
        mat4.rotate(this.transformationMatrix, this.transformationMatrix, angle, axes);
    }

    translate(vector){
        mat4.translate(this.transformationMatrix, this.transformationMatrix, vector);
    }

    showCoordinates(){
        vertices
    }

    static setUpAttribute(buffer, attribLocation){
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(
            attribLocation,//Attribute location
            4,//Number of elements per attribute
            gl.FLOAT,//Type of elements
            gl.FALSE,
            4*Float32Array.BYTES_PER_ELEMENT,//Size of an individual vertex
            0//Offset from the beginning of a single vertex to this attribute
        );
        gl.enableVertexAttribArray(attribLocation);
    }
}