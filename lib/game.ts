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
    var formation = Formations.circularGrouping(this.cores.length, new Vector3(0, 0, 0));
    for (var i = 0; i < this.cores.length; i++) {
      this.cores[i].mesh.position = formation[i];
    }

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
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 15, -40), this.scene);
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

      //ignore if not click
      if (evt.button !== 0) {
        return;
      }
      //check for ground hit
      if (pickResult.pickedMesh === self.ground.mesh) {

        //ground hit, now check if any units selected
        if (self.cores.filter((item:IGameUnit) => {
            return item.isSelected;
          }).length) {
          self.addMoveCommand(pickResult.pickedPoint);
        }
      }
    };

    // Skybox
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 750.0, this.scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.emissiveColor = new BABYLON.Color3(0, 0.0, 0.0);
    skybox.material = skyboxMaterial;
    this.setUpDummyEnemy();
  }


  //todo from mouse/keyboard
  addMoveCommand(pickResult:Vector3) {
    console.log(pickResult);
    var selectedUnits = this.cores.filter((unit:IGameUnit)=> {
      return unit.isSelected;
    })

    var formation = Formations.circularGrouping(selectedUnits.length, pickResult);
    for (var i = 0; i < selectedUnits.length; i++) {

      var unit = selectedUnits[i];

      //pythagoras
      var distance = Math.sqrt(Math.pow(pickResult.x - unit.mesh.position.x, 2) + Math.pow(pickResult.z - unit.mesh.position.z, 2));
      var framesNeeded = Math.round((distance / Common.MEDIUM_SPEED) * Common.ANIMATIONS_FPS);
      console.log('dist: ' + distance + ' frames' + framesNeeded);

      var animationBezierTorus = new BABYLON.Animation("animationCore", "position", Common.ANIMATIONS_FPS, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
      var keysBezierTorus = [];
      keysBezierTorus.push({frame: 0, value: unit.mesh.position});

      keysBezierTorus.push({
        frame: framesNeeded,
        value: unit.mesh.position = formation[i]
      });
      animationBezierTorus.setKeys(keysBezierTorus);
      // var bezierEase = new BABYLON.BezierCurveEase(0.445, 0.05, 0.55, 0.95);
      //animationBezierTorus.setEasingFunction(bezierEase);
      unit.mesh.animations.push(animationBezierTorus);
      this.scene.beginAnimation(unit.mesh, 0, framesNeeded, true);

    }
    ;
    //todo investigate queued commands
  }

  createInitialPlayerUnits() {
    //var cores = Array<IGameUnit>;
    var cores = [];
    for (var i = 0; i < this.startingNumberOfCores; i++) {
      var core = new Core(this.scene, true);
      core.mesh.position.y = Common.defaultY;
      cores.push(core)
    }
    return cores;
  }

  setUpDummyEnemy() {
    var core = new Core(this.scene, false);
    core.mesh.position = new Vector3(10, Common.defaultY, 10)
    {

    }
  }

}

//start up the game
new Game();
