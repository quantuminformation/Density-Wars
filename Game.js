import Core from 'gameUnits/Core'

export class Game {
	constructor() {
		var self = this;
		this.cores = [];
		this.numCores = 6;
		// Load BABYLON 3D engine
		this.canvas = document.getElementById("glcanvas");
		this.engine = new BABYLON.Engine(this.canvas, true);
		this.scene = this.createScene();

		this.engine.runRenderLoop(function () {
			self.scene.render();
		});
		window.addEventListener("resize", function () {
			engine.resize();
		});
	}

	createScene() {
		// This creates a basic Babylon Scene object (non-mesh)
		var scene = new BABYLON.Scene(this.engine);
		// This creates and positions a free camera (non-mesh)
		var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
		// This targets the camera to scene origin
		camera.setTarget(BABYLON.Vector3.Zero());
		// This attaches the camera to the canvas
		camera.attachControl(this.canvas, true);
		// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
		var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

		// Default intensity is 1. Let's dim the light a small amount
		light.intensity = 0.7;
		this.cores = this.createInitialPlayerUnits(scene);
		this.postionCircular(this.cores);
		// Move the sphere upward 1/2 its height
		sphere.position.y = 1;
		// Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
		var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);
		return scene;
	}

	createInitialPlayerUnits(scene) {
		var cores;
		for (var i = 0; i < this.numCores; i++) {
			var sphere = new Core();
		}
		return cores;
	}

	/**
	 positions an array of objects on the edge of a circle equally spaced
	 */
	postionCircular(arr) {
		"use strict";
		for (var i = 0; i < arr.length; i++) {
			var angleDeg = i * (360 / arr.length);
			var angleRad = (angleDeg / 360) * 2 * Math.PI;
			var customVector = new BABYLON.Vector2(-Math.cos(radAngle), -Math.sin(radAngle));
			arr[i].position = customVector();
		}
		return arr;
	}

;
}
;
