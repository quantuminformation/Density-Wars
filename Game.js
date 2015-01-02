import {Core} from 'gameUnits/Core'

export class Game {
	constructor() {
		var self = this;
		this.numCores = 6;
		this.defaultY = 1;
		// Load BABYLON 3D engine
		this.canvas = document.getElementById("glcanvas");
		this.engine = new BABYLON.Engine(this.canvas, true);
		this.scene = new BABYLON.Scene(this.engine);
		this.initScene();
		this.cores = this.createInitialPlayerUnits();
		this.postionCircular(this.cores);

		this.engine.runRenderLoop(function () {
			self.scene.render();
		});
		window.addEventListener("resize", function () {
			engine.resize();
		});
	}

	initScene() {
		// This creates and positions a free camera (non-mesh)
		var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene);
		// This targets the camera to scene origin
		camera.setTarget(BABYLON.Vector3.Zero());
		// This attaches the camera to the canvas
		camera.attachControl(this.canvas, true);
		// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
		var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);

		// Default intensity is 1. Let's dim the light a small amount
		light.intensity = 0.7;
		// Move the sphere upward 1/2 its height
		// Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
		var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, this.scene);
	}

	createInitialPlayerUnits() {
		var cores = [];
		for (var i = 0; i < this.numCores; i++) {
			var core = new Core(this.scene);
			core.sphere.position.y = this.defaultY;
			cores.push(core)
		}
		return cores;
	}

	/**
	 positions an array of objects on the edge of a circle equally spaced
	 */
	postionCircular(cores) {
		"use strict";
		for (var i = 0; i < cores.length; i++) {
			var angleDeg = i * (360 / cores.length);
			var angleRad = (angleDeg / 360) * 2 * Math.PI;
			var customVector = new BABYLON.Vector3(-Math.cos(angleRad), this.defaultY, -Math.sin(angleRad));
			cores[i].sphere.position = customVector;
		}
	}

;
}
;
