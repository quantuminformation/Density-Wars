import Core from "./gameUnits/Core"
import Formations from "./utils/Formations.ts"
import Common from "./Common"
import {IGameUnit} from "./gameUnits/IGameUnit";
import Ground from "./Ground";
import RemotePlayer from "./RemotePlayer";
import PickingInfo = BABYLON.PickingInfo;
import Vector3 = BABYLON.Vector3;


declare function require(module:string):any

require('../styles/main.styl');

//todo I can't figure out a way to import with webpack so I load in index.html
//import BABYLON from 'babylonjs'

var self;//todo not sure about this

class Game {
  startingNumberOfCores:number = 6;

  remoteUsers:Array<RemotePlayer>//other players in the game, start with just 1 for now for simplicity

  canvas:HTMLCanvasElement;
  engine:BABYLON.Engine;
  scene:BABYLON.Scene;
  cores:Array<IGameUnit>;
  ground:Ground;
  selection:Array<IGameUnit>; //this is what the user has selected, can be one ore more gameUnits

  constructor() {
    self = this;

    // Load BABYLON 3D engine
    this.engine = new BABYLON.Engine(<HTMLCanvasElement> document.getElementById("glcanvas"), true);

    this.canvas = this.engine.getRenderingCanvas();

    this.initScene();

    this.cores = this.createInitialPlayerUnits();
    Formations.postionCircular(this.cores);

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
    window.addEventListener("resize", function () {
      //todo some logic
      self.engine.resize();
    });


    this.scene.onDispose = function () {
      //   this.canvas.removeEventListener("pointerdown", this.onPointerDown);
      // this.canvas.removeEventListener("pointerup", onPointerUp);
      //   this.canvas.removeEventListener("pointermove", onPointerMove);
    }

  }

  /*  onPointerDown(evt) {
   if (evt.button !== 0) {
   return;
   }*/

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
  // }


  initScene() {
    this.scene = new BABYLON.Scene(this.engine);

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
    this.ground = new Ground(this.scene);

    this.scene.onPointerDown = (evt, pickResult:PickingInfo) => {

      if (evt.button !== 0) {
        return;
      }

      // check if we are under a mesh
      var pickInfo = self.scene.pick(self.scene.pointerX, self.scene.pointerY, function (mesh) {
        return mesh !== self.ground.mesh;
      });
      if (!pickInfo.hit) {
        return;
        /*  this.cores.forEach(core=> {
         core.deselect();
         })*/
      }

      this.addMoveCommand(pickResult.pickedPoint);
    }

    // Skybox
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 750.0, this.scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.emissiveColor = new BABYLON.Color3(0, 0.0, 0.0);
    skybox.material = skyboxMaterial;

  }

  getGroundPosition () {
  // Use a predicate to get position on the ground
  var pickinfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY, function (mesh) { return mesh !== this.ground.mesh; });
  if (pickinfo.hit) {
    return pickinfo.pickedPoint;
  }

  return null;
}


  //todo from mouse/keyboard
  addMoveCommand(pickResult:Vector3) {
    this.cores.filter( (unit:IGameUnit)=> {
      return unit.isSelected;
    }).forEach((unit:IGameUnit)=> {
      var animationBezierTorus = new BABYLON.Animation("animationBezierTorus", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
      var keysBezierTorus = [];
      keysBezierTorus.push({frame: 0, value: unit.mesh.position});
      keysBezierTorus.push({
        frame: 120,
        value: unit.mesh.position.add(new BABYLON.Vector3(pickResult.x, pickResult.y, 0))
      });
      animationBezierTorus.setKeys(keysBezierTorus);
      var bezierEase = new BABYLON.BezierCurveEase(0.32, -0.73, 0.69, 1.59);
      animationBezierTorus.setEasingFunction(bezierEase);
      unit.mesh.animations.push(animationBezierTorus);
      this.scene.beginAnimation(unit.mesh, 0, 120, true);

    });
    //todo investigate queued commands
  }

  createInitialPlayerUnits() {
    //var cores = Array<IGameUnit>;
    var cores = [];
    for (var i = 0; i < this.startingNumberOfCores; i++) {
      var core = new Core(this.scene);
      core.mesh.position.y = Common.defaultY;
      cores.push(core)
    }
    return cores;
  }


}

//start up the game
new Game();
