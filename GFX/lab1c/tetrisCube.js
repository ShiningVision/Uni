class TetrisCube {

    constructor(color=[0.0,1.0,0.0,1.0]) {
        this.cube = this.createCube(color);
        this.transformationMatrix = mat4.create();// for the transformation-operations
        this.normalMatrix = mat3.create();
        this.rotationMatrix = mat4.create();
        this.translationMatrix = mat4.create();

        this.colorData = [
            // R, G, B, Alpha
            [0.0, 0.0, 0.0, 1.0],    // Front face: black
            [1.0, 0.0, 0.0, 1.0],    // left face: red
            [0.0, 1.0, 0.0, 1.0],    // back face: green
            [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
            [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
            [1.0, 0.0, 1.0, 1.0],	 // top face: purple
        ];
    }

    createCube(color) {//set private

        const p1 = vec4.fromValues(0.0, 0.0, 0.0, 1.0);
        const p2 = vec4.fromValues(1.0, 0.0, 0.0, 1.0);
        const p3 = vec4.fromValues(1.0, 0.0, 1.0, 1.0);
        const p4 = vec4.fromValues(0.0, 0.0, 1.0, 1.0);
        const p5 = vec4.fromValues(0.0, 1.0, 0.0, 1.0);
        const p6 = vec4.fromValues(1.0, 1.0, 0.0, 1.0);
        const p7 = vec4.fromValues(1.0, 1.0, 1.0, 1.0);
        const p8 = vec4.fromValues(0.0, 1.0, 1.0, 1.0);


        const front = [
            p1,
            p2,
            p6,
            p1,
            p5,
            p6];// front face end
        const left = [
            p1,
            p4,
            p5,
            p4,
            p5,
            p8]; // left face end
        const back = [
            p3,
            p4,
            p7,
            p4,
            p7,
            p8];// back face end
        const bottom = [
            p1,
            p2,
            p3,
            p1,
            p3,
            p4];// bottom face end
        const right = [
            p2,
            p3,
            p6,
            p3,
            p6,
            p7];// right face end
        const top = [
            p5,
            p6,
            p7,
            p5,
            p7,
            p8];// Top face end

        const colors = [];

        const normalData = [
            // X, Y, Z
            [0, 0, 1],  // front 0
            [-1, 0, 0], // left 1
            [0, 0, -1], // back 2
            [0, -1, 0], // bottom 3
            [1, 0, 0],  // right 4
            [0, 1, 0],  // top 5
        ]
        const normals = [];

        let vertices = [];
        vertices.push(bottom);
        vertices.push(front);
        vertices.push(back);
        vertices.push(left);
        vertices.push(right);
        vertices.push(top);

        for (let i = 0; i < vertices.length; i++) {
            for (let j = 0; j < 6; j++) {
                colors.push(color);
            }
        }

        normals.push(normalData[3]);

        normals.push(normalData[0]);

        normals.push(normalData[2]);

        normals.push(normalData[1]);

        normals.push(normalData[4]);

        normals.push(normalData[5]);

        const allNormals = [];
        normals.forEach((n) => {
            for (let i = 0; i < 6; i++) {
                allNormals.push(n);
            }
        })

        var object = new Shape();
        object.initData(vertices.flat(), allNormals, colors);
        return object

    }

    draw() {
        this.cube.draw();
    }

    saveTranslation(axe){//private method
        var v = new Float32Array(axe);
		var moveDistance = new Float32Array([1.0, 1.0, 1.0]);
		vec3.multiply(v, v, moveDistance);
		mat4.translate(this.translationMatrix, this.translationMatrix, v);
    }

    collide(){
        return this.cube.collide();
    }

    translateUp() {
        let direction = [0,1,0];
        this.saveTranslation(direction);
        this.cube.optionalTranslate(this.translationMatrix);
    }
    translateDown() {
        let direction = [0,-1,0];
        this.saveTranslation(direction);
        this.cube.optionalTranslate(this.translationMatrix);
    }
    translateLeft() {
        let direction = [-1, 0, 0];
        this.saveTranslation(direction);
        this.cube.optionalTranslate(this.translationMatrix);
    }
    translateRight() {
        let direction = [1, 0, 0];
        this.saveTranslation(direction);
        this.cube.optionalTranslate(this.translationMatrix);
    }
    translateForth() {
        let direction = [0, 0, -1];
        this.saveTranslation(direction);
        this.cube.optionalTranslate(this.translationMatrix);
    }
    translateBack() {
        let direction = [0, 0, 1];
        this.saveTranslation(direction);
        this.cube.optionalTranslate(this.translationMatrix);
    }

    translate(axe) {
        this.cube.translate(axe);
    }

    rotate(angle, axe) {

        this.cube.rotate(angle, axe);

    }

    getCoordinate(){
        return this.cube.getCoordinates();
    }

}