class Game {
	constructor(message) {
		this.message = message;

		this.gl; // A global variable for the WebGL context
	}

	greet() {
		let element = document.querySelector('#message');
		element.innerHTML = this.message;
	}


	initWebGL(canvas) {
		this.gl = null;

		try {
			// Try to grab the standard context. If it fails, fallback to experimental.
			this.gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		}
		catch (e) {
		}

		// If we don't have a GL context, give up now
		if (!this.gl) {
			alert("Unable to initialize WebGL. Your browser may not support it.");
			this.gl = null;
		}
	}


	start() {
		var canvas = document.getElementById("glcanvas");

		this.initWebGL(canvas);      // Initialize the GL context

		// Only continue if WebGL is available and working

		if (this.gl) {
			this.gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // Set clear color to black, fully opaque
			this.gl.enable(this.gl.DEPTH_TEST);                               // Enable depth testing
			this.gl.depthFunc(this.gl.LEQUAL);                                // Near things obscure far things
			this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);      // Clear the color as well as the depth buffer.
			this.gl.viewport(0, 0, canvas.width, canvas.height);
		}
	}


}
;

function start() {
	"use strict";

	var game = new Game();
	game.start();

}