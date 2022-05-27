const defaultColors=[
	// R, G, B, Alpha
	[0.0, 0.0, 0.0, 1.0],    // black
	[1.0, 0.0, 0.0, 1.0],    // red
	[0.0, 1.0, 0.0, 1.0],    // green
	[0.0, 0.0, 1.0, 1.0],    // blue
	[1.0, 1.0, 0.0, 1.0],    // yellow
	[1.0, 0.0, 1.0, 1.0],	 // purple
];
let colorCycle =0;

class Shape{
	//hint: create Shape with empty constructor: new Shape(). Then use the initData(...,...) method.
    constructor(){
		
        this.vertices=[];
        this.colors=[];
		this.normals=[];
        this.buffers={
            vertexBuffer:gl.createBuffer(),
            colorBuffer:gl.createBuffer(),
			normalBuffer:gl.createBuffer(),
        }
        this.transformationMatrix=mat4.create();// for the transformation-operations
		this.normalMatrix=mat3.create();
		
		/* ---------- for coordinate system ----------- */
		this.focus = new Boolean(false); // if true then show coordinates
		
		this.cVertices=[];
		
		this.cColors=[];

		this.cNormals=[];
		
		this.cBuffers={
			vertexBuffer:gl.createBuffer(),
            colorBuffer:gl.createBuffer(),
			normalBuffer:gl.createBuffer(),
		}
		/* ---------- thats all for coordinate system -------- */
    }

	parseFloat32Array(arr){
		if(arr[0] instanceof Float32Array)
			return new Float32Array(arr.map(a => Array.from(a)).flat());
		return new Float32Array(arr.flat());
	}

    initData(vertices,normals,colors=[]){
		
		const vertexeCount=vertices.length/4;
		
		if(colors.length==0){
			for(let i = 0;i<vertexeCount;i++){
				colors.push(defaultColors[1]);// change to colorCycle if different colors are wished.
				colorCycle++;
				if(colorCycle>5)colorCycle=0;
			}
		}

		if(normals.length==0){
			for(let i = 0;i<vertexeCount;i++){
				normals.push([0.0,0.0,0.0]);
			}
		}
		
		this.vertices=this.parseFloat32Array(vertices);
        this.colors=this.parseFloat32Array(colors);
		this.normals=this.parseFloat32Array(normals);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);

		/* -------------- for coordinate system --------------- */
		/*
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

		var cNormals=[
			1,0,0,
			-1,0,0,
			
			0,1,0,
			0,-1,0,
			
			0,0,1,
			0,0,-1,
		]
		
		this.cVertices=new Float32Array(cVertices.flat());
		this.cColors=new Float32Array(cColors.flat());
		this.cNormals=new Float32Array(cNormals.flat());
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.cBuffers.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.cVertices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.cBuffers.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.cColors, gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.cBuffers.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.cNormals, gl.STATIC_DRAW);
		
		*/
		/* ---------- thats all for coordinate system -------- */
    }

    draw(withCoord=false){
        Shape.setUpAttribute(this.buffers.vertexBuffer,currentProgram.attributes.vertexLocation);
        Shape.setUpAttribute(this.buffers.colorBuffer,currentProgram.attributes.colorLocation);
        Shape.setUpAttribute(this.buffers.normalBuffer,currentProgram.attributes.normalLocation, true);
		
		if(withCoord == true){
			//Shape.setUpAttribute(this.cBuffers.vertexBuffer,currentProgram.attributes.vertexLocation);
        	//Shape.setUpAttribute(this.cBuffers.colorBuffer,currentProgram.attributes.colorLocation);
			//Shape.setUpAttribute(this.cBuffers.normalBuffer,currentProgram.attributes.normalLocation, true);
			//gl.drawArrays(gl.LINES, 0, this.cVertices.length / 4);
		}


		gl.uniformMatrix4fv(currentProgram.uniforms.transformationMatrix,gl.FALSE,this.transformationMatrix);
		mat3.normalFromMat4(this.normalMatrix, this.transformationMatrix);
		gl.uniformMatrix3fv(currentProgram.uniforms.normalMatrix,gl.FALSE,this.normalMatrix);

        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 4);
        
    }
	/**
	 * deprecated: use draw(true) instead
	 */
	/*
	drawWithCoordinates(){
		
		Shape.setUpAttribute(this.buffers.vertexBuffer,currentProgram.attributes.vertexLocation);
        Shape.setUpAttribute(this.buffers.colorBuffer,currentProgram.attributes.colorLocation);

        gl.uniformMatrix4fv(currentProgram.uniforms.transformationMatrix,gl.FALSE,this.transformationMatrix);
        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 4);
		
		// ----------- draw the coordinates too --------------- 
		
		Shape.setUpAttribute(this.cBuffers.vertexBuffer,currentProgram.attributes.vertexLocation);
        Shape.setUpAttribute(this.cBuffers.colorBuffer,currentProgram.attributes.colorLocation);
		
		gl.uniformMatrix4fv(currentProgram.uniforms.transformationMatrix,gl.FALSE,this.transformationMatrix);
        
		gl.drawArrays(gl.LINES, 0, this.cVertices.length / 4);
		// ------------- coordinates drawn ----------------
	}*/

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
	
	
    static setUpAttribute(buffer, attribLocation, isNormal=false){

		if(attribLocation === -1)return;

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        gl.vertexAttribPointer(
            attribLocation,//Attribute location
            isNormal ? 3 : 4,//Number of elements per attribute
            gl.FLOAT,//Type of elements
            gl.FALSE,
            (isNormal ? 3 : 4)*Float32Array.BYTES_PER_ELEMENT,//Size of an individual vertex
            0//Offset from the beginning of a single vertex to this attribute
        );

        gl.enableVertexAttribArray(attribLocation);
    }
}