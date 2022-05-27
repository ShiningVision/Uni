class Shape{
	//hint: create Shape with empty constructor: new Shape(). Then use the initData(...,...) method.
    constructor(){
		
        this.vertices=[];
        this.colors=[];
        this.buffers={
            vertexBuffer:gl.createBuffer(),
            colorBuffer:gl.createBuffer(),
        }
        this.transformationMatrix=mat4.create();// for the transformation-operations
		
		/* ---------- for coordinate system ----------- */
		this.focus = new Boolean(false); // if true then show coordinates
		
		this.cVertices=[];
		
		this.cColors=[];
		
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
		
		var cVertices=[
			1,0,0,1,
			-1,0,0,1,
			
			0,1,0,1,
			0,-1,0,1,
			
			0,0,1,1,
			0,0,-1,1,
		];
		
		var cColors=[
			1.0, 0.0, 0.0, 1.0,    // red
			1.0, 0.0, 0.0, 1.0,		// red
			
			1.0, 1.0, 0.0, 1.0,		//yellow
			1.0, 1.0, 0.0, 1.0,		//yellow
			
			0.0, 0.0, 1.0, 1.0,		//blue
			0.0, 0.0, 1.0, 1.0,		//blue
		];
		
		this.cVertices=new Float32Array(cVertices.flat());
		this.cColors=new Float32Array(cColors.flat());
		
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
        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 4);
		
		/* ----------- draw the coordinates too --------------- */
		Shape.setUpAttribute(this.cBuffers.vertexBuffer,attribLocations.attributes.vertexLocation);
        Shape.setUpAttribute(this.cBuffers.colorBuffer,attribLocations.attributes.colorLocation);
		
		gl.uniformMatrix4fv(attribLocations.uniforms.transformationMatrix,gl.FALSE,this.transformationMatrix);
        
		gl.drawArrays(gl.LINES, 0, this.cVertices.length / 4);
		/* ------------- coordinates drawn ----------------*/
	}

    rotate(angle, axes){
        mat4.rotate(this.transformationMatrix, this.transformationMatrix, angle, axes);
    }

    translate(axes){
		var v=new Float32Array(axes);
		var moveDistance = new Float32Array([1.1,1.1,1.1]);
		vec3.multiply(v,v,moveDistance);
        mat4.translate(this.transformationMatrix, this.transformationMatrix, v);
    }
	
	scale(axes, degree){
		switch(axes){
			case 'x':
				var v = new Float32Array([degree,1,1]);
				mat4.scale(this.transformationMatrix, this.transformationMatrix,v)
			break;
			case 'y':
				var v = new Float32Array([1,degree,1]);
				mat4.scale(this.transformationMatrix, this.transformationMatrix,v)
			break;
			case 'z':
				var v = new Float32Array([1,1,degree]);
				mat4.scale(this.transformationMatrix, this.transformationMatrix,v)
			break;
			default:
				return;
		}
	}
	
	//private function for scale:
	
	
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