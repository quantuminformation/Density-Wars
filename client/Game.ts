///<reference path='../node_modules/babylonjs/babylon.d.ts'/>

import Core from './gameUnits/Core'
import Formations from './utils/Formations'
import { common } from './Common'
import { IGameUnit } from './gameUnits/IGameUnit'
import Ground from './Ground'
import Lobby from './hud/Lobby'
import MathHelpers from './MathHelpers'
import { CenterOfMassMarker } from './gameUnits/CenterOfMassMarker'
import GameOverlay from './hud/GameOverlay'
let PickingInfo = BABYLON.PickingInfo
let Vector3 = BABYLON.Vector3
let FreeCamera = BABYLON.FreeCamera

import './styles/index'

class Game {
  startingNumberOfCores: number = 6
  lobby: Lobby = new Lobby()

  canvas: HTMLCanvasElement
  engine: BABYLON.Engine = new BABYLON.Engine(document.getElementById('glcanvas') as HTMLCanvasElement, true)
  private _scene: BABYLON.Scene = new BABYLON.Scene(this.engine)
  private _selectedUnits: Array<IGameUnit> //this is what the user has selected, can be one ore more gameUnits
  gameUnits: Array<IGameUnit>
  camera: BABYLON.FreeCamera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 15, -40), this._scene)

  //todo move to remote Users
  enemyUnits: IGameUnit[] = []

  ground: Ground
  centerOfMass: CenterOfMassMarker
  gameOverlay: GameOverlay = new GameOverlay(this._scene, this.camera)

  constructor () {

    this.canvas = this.engine.getRenderingCanvas()

    this.initScene()

    this.gameUnits = this.createInitialPlayerUnits()
    let formation = Formations.circularGrouping(this.gameUnits.length, new Vector3(0, 0, 0))
    for (let i = 0; i < this.gameUnits.length; i++) {
      this.gameUnits[i].mesh.position = formation[i]
    }
    this.camera.detachControl(this.canvas)

    this.centerOfMass = new CenterOfMassMarker(this._scene, true)
    this.centerOfMass.mesh.position = Formations.getCentroid(this.gameUnits)

    this.engine.runRenderLoop(() => {
      this.centerOfMass.mesh.position = Formations.getCentroid(this.gameUnits)

      this._scene.render()
    })
    window.addEventListener('resize', () => {
      //todo some logic
      this.engine.resize()
    })

    this.gameOverlay.showUnitsStatus(this.gameUnits)

  }

  onPointerDown (evt, pickResult: BABYLON.PickingInfo) {

    // ignore if not click
    if (evt.button !== 0) {
      return
    }

// make the pickResult y = 1 to stop things moving vertically
    pickResult.pickedPoint.y = common.defaultY

    let isOwnUnitHit = this.gameUnits.some((el: IGameUnit) => {
      return pickResult.pickedMesh === el.mesh
    })
    if (isOwnUnitHit) {
      if (evt.shiftKey) {
        return // the unit will select itself in the events manager
      }

      // deselection of of other units if selected without shift key
      this.gameUnits.filter((el: IGameUnit) => {
        return pickResult.pickedMesh !== el.mesh
      }).forEach((el: IGameUnit) => {
        el.deselect()
      })
      return
    }

   // check for enemy targeted
    for (let i = 0; i < this.enemyUnits.length; i++) {
      if (pickResult.pickedMesh === this.enemyUnits[i].mesh) {
        this.gameUnits.filter((el: IGameUnit) => {
          return el.isSelected
        }).forEach((el: IGameUnit) => {
          el.weapon.fire(el, this.enemyUnits[i], this._scene)
        })
        return
      }
    }

     // check for ground hit
    if (pickResult.pickedMesh === this.ground.mesh) {

      //ground hit, now check if any units selected
      if (this.gameUnits.filter((item: IGameUnit) => {return item.isSelected}).length) {
        console.log(pickResult.pickedPoint)
        this.addMoveCommand(pickResult.pickedPoint)
      }
    } else {

    }
  }

  initScene () {

    // This targets the camera to scene origin
    this.camera.setTarget(BABYLON.Vector3.Zero())
    // This attaches the camera to the canvas
    this.camera.attachControl(this.canvas, true)
    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    let light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this._scene)

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7
    // Move the sphere upward 1/2 its height
    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    this.ground = new Ground(this._scene)

    // Skybox
    let skybox = BABYLON.Mesh.CreateBox('skyBox', 750.0, this._scene)
    let skyboxMaterial = new BABYLON.StandardMaterial('skyBox', this._scene)
    skyboxMaterial.backFaceCulling = false
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0)
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0)
    skyboxMaterial.emissiveColor = new BABYLON.Color3(0, 0.0, 0.0)
    skybox.material = skyboxMaterial
    this.setUpDummyEnemys()
    this.addListeners()
  }

  addListeners () {
    this._scene.onPointerDown = this.onPointerDown.bind(this)
  }

  addMoveCommand (pickResult: BABYLON.Vector3) {
    console.log(pickResult)
    let selectedUnits = this.gameUnits.filter((unit: IGameUnit) => {
      return unit.isSelected
    })

    let formation = Formations.circularGrouping(selectedUnits.length, pickResult)
    for (let i = 0; i < selectedUnits.length; i++) {

      let unit = selectedUnits[i]

      // use pythagoras to work out the realtive speed for the units to arrive at roughly the same time
      let distance = Math.sqrt(Math.pow(pickResult.x - unit.mesh.position.x, 2)
        + Math.pow(pickResult.z - unit.mesh.position.z, 2))
      let framesNeeded = Math.round((distance / common.MEDIUM_SPEED) * common.ANIMATIONS_FPS)
      console.log('dist: ' + distance + ' frames' + framesNeeded)

      let animationBezierTorus = new BABYLON.Animation('animationCore', 'position',
        common.ANIMATIONS_FPS,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT)
      let keysBezierTorus = []
      keysBezierTorus.push({ frame: 0, value: unit.mesh.position })

      keysBezierTorus.push({
        frame: framesNeeded,
        value: unit.mesh.position = formation[i]
      })
      animationBezierTorus.setKeys(keysBezierTorus)
      unit.mesh.animations.push(animationBezierTorus)
      this._scene.beginAnimation(unit.mesh, 0, framesNeeded, true) // todo move animation to server side
    }
  }

  createInitialPlayerUnits () {
    let cores:IGameUnit[] = []
    for (let i = 0; i < this.startingNumberOfCores; i++) {
      let core = new Core(this._scene, true)
      core.mesh.position.y = common.defaultY
      cores.push(core)
    }
    return cores
  }

  setUpDummyEnemys () {
    let core = new Core(this._scene, false)
    core.mesh.position = new Vector3(10, common.defaultY, 10)
    this.enemyUnits.push(core)
    let core2 = new Core(this._scene, false)
    core2.mesh.position = new Vector3(11, common.defaultY, 11)
    this.enemyUnits.push(core2)
  }

  // OnSelectionEnd implementation
  OnSelectionEnd (x: number, y: number, w: number, h: number) {

    let area: Array<BABYLON.Vector3> = new Array<BABYLON.Vector3>(4)
    let units: Array<BABYLON.AbstractMesh>

    // Clear current selection of selected units
    this._selectedUnits.length = 0

    // In case when area is selected
    if (w != 0 && h != 0) {
      // Translate points to world coordinates
      area[0] = this._scene.pick(x, y).pickedPoint
      area[1] = this._scene.pick(x + w, y).pickedPoint
      area[2] = this._scene.pick(x + w, y + h).pickedPoint
      area[3] = this._scene.pick(x, y + h).pickedPoint

      // todo use this
      // this._selectedUnits = this._players[this._localPlayer].units.filter(

      // Go through all units of your player and save them in an array
      this._selectedUnits = this.gameUnits.filter(
        (unit: IGameUnit) => {
          //(<any>unit).mesh.type === ObjectType.UNIT &&
          return MathHelpers.isPointInPolyBabylon(area, unit.mesh.position) // helper is up
        })

      console.log(this._selectedUnits)
    }
    // Only one unit is selected
    else {
      let p = this._scene.pick(x, y)

      if (!p.pickedMesh)
        return

      // todo check
      // if ((<any>p).type != ObjectType.UNIT)
      // return

      units.push(p.pickedMesh)
    }
  }

}

// start up the game
new Game()
