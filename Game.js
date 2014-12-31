import Core from 'gameUnits/Core'

export class Game {
	constructor() {
		var self = this;
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

		// Our built-in 'sphere' shape. Params: name, subdivs, size, scene
		var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);

		// Move the sphere upward 1/2 its height
		sphere.position.y = 1;

		// Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
		var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);

		return scene;

	}

;
}
;
