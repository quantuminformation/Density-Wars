import Core from 'gameUnits/Core'

export class Game {
	constructor() {

		this.gl = null; // A global variable for the WebGL context

		// Load BABYLON 3D engine
		this.canvas = document.getElementById("glcanvas");
		this.engine = new BABYLON.Engine(this.canvas, true);

		this.initWebGL(this.canvas);      // Initialize the GL context
		// Only continue if WebGL is available and working
		if (this.gl) {
			this.gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // Set clear color to black, fully opaque
			this.gl.enable(this.gl.DEPTH_TEST);                               // Enable depth testing
			this.gl.depthFunc(this.gl.LEQUAL);                                // Near things obscure far things
			this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);      // Clear the color as well as the depth buffer.
			this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
		}
	}

	initWebGL(canvas) {
		try {
			// Try to grab the standard context. If it fails, fallback to experimental.
			this.gl = this.canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		}
		catch (e) {
		}

		// If we don't have a GL context, give up now
		if (!this.gl) {
			alert("Unable to initialize WebGL. Your browser may not support it.");
			this.gl = null;
		}
	}
}
;
