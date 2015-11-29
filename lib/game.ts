/// <reference path="./gameUnits/Core.ts" />
/// <reference path="./utils/UnitCommand.ts" />
/// <reference path="./utils/Formations.ts" />
/// <reference path="./User.ts" />
declare function require(module: string):any

require('../style.css');
//var BABYLON = require('babylonjs');



class Game {
  currentUser:User;
  remoteUsers:Array<User>//other players in the game, start with just 1 for now for simplicity

  numCores:number;
  canvas:HTMLCanvasElement;
  engine:BABYLON.Engine;
  scene:BABYLON.Scene;
  cores:Array<IGameUnit>;
  selection:Array<IGameUnit>; //this is what the user has selected, can be one ore more gameUnits

  constructor() {
    var self = this;
    this.numCores = 6;

    // Load BABYLON 3D engine
    this.canvas = <HTMLCanvasElement> document.getElementById("glcanvas");
    this.engine = new BABYLON.Engine(this.canvas, true);
    this.scene = new BABYLON.Scene(this.engine);
    this.initScene();
    this.cores = this.createInitialPlayerUnits();
    Formations.postionCircular(this.cores);

    this.engine.runRenderLoop(function () {
      self.scene.render();
    });
    window.addEventListener("resize", function () {
      //todo decide what to do here
      // self.engine.resize();
    });


    this.canvas.addEventListener("pointerdown", this.onPointerDown, false);
    //this.canvas.addEventListener("pointerup", onPointerUp, false);
    //this.canvas.addEventListener("pointermove", onPointerMove, false);

    this.scene.onDispose = function () {
      this.canvas.removeEventListener("pointerdown", this.onPointerDown);
      // this.canvas.removeEventListener("pointerup", onPointerUp);
      //   this.canvas.removeEventListener("pointermove", onPointerMove);
    }
  }

  onPointerDown(evt) {
    if (evt.button !== 0) {
      return;
    }

    // check if we are under a mesh
    /*  var pickInfo = thisscene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh !== ground; });
     if (pickInfo.hit) {
     currentMesh = pickInfo.pickedMesh;
     startingPoint = getGroundPosition(evt);

     if (startingPoint) { // we need to disconnect camera from canvas
     setTimeout(function () {
     camera.detachControl(canvas);
     }, 0);
     }
     }*/
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
    //var cores = Array<IGameUnit>;
    var cores = [];
    for (var i = 0; i < this.numCores; i++) {
      var core = new Core(this.scene);
      core.mesh.position.y = Common.defaultY;
      cores.push(core)
    }
    return cores;
  }

  //todo from mouse/keyboard
  addCommand() {
    "use strict";
    var selectedUnits = this.cores.filter(function (unit:IGameUnit) {
      return unit.isSelected;
    })
    //todo investigate queued commands
  }


}

//start up the game
new Game();
