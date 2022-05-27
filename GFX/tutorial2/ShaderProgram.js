class ShaderProgram {

    constructor(vertex, fragment, shaderInfo) {

        // Create shader program using the provided vertex and fragment shader ids
        this.program = createShaderProgram(vertex, fragment);
        gl.useProgram(this.program)

        this.attributes = {}
        this.uniforms = {}

        // Extract attribute and uniform information fromm the shaderInfo object
        // and look up their locations
        Object.entries(shaderInfo.attributes).forEach(([key, value]) => {

            this.attributes[key] = gl.getAttribLocation(this.program, value);

        });

        Object.entries(shaderInfo.uniforms).forEach(([key, value]) => {

            this.uniforms[key] = gl.getUniformLocation(this.program, value);

        });

        // Send projection and view matrix
        // You might want to send the view matrix at a different location in your application
        gl.uniformMatrix4fv(this.uniforms.viewMatrix, gl.FALSE, matrices.view);
        gl.uniformMatrix4fv(this.uniforms.projectionMatrix, gl.FALSE, matrices.projection);

    }

    enable() {

        currentProgram = this;
        gl.useProgram(this.program);

    }

}