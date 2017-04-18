///<reference path='../node_modules/babylonjs/babylon.d.ts'/>

import { CONFIG } from './Config'
import Core from './gameUnits/Core'
import Formations from './utils/Formations'
import { common } from './Common'
import { IGameUnit } from './gameUnits/IGameUnit'
import Ground from './Ground'
import Lobby from './hud/Lobby'
import MathHelpers from './MathHelpers'
import { CenterOfMassMarker } from './gameUnits/CenterOfMassMarker'
let PickingInfo = BABYLON.PickingInfo
let Vector3 = BABYLON.Vector3
let FreeCamera = BABYLON.FreeCamera

import './styles/index'

export class Game {
  startingNumberOfCores: number = 7
  // lobby: Lobby = new Lobby()

  canvas: HTMLCanvasElement
  engine: BABYLON.Engine = new BABYLON.Engine(document.getElementById('glcanvas') as HTMLCanvasElement, true)
  scene: BABYLON.Scene = new BABYLON.Scene(this.engine)
  gameUnits: Array<IGameUnit>
  camera: BABYLON.FreeCamera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 15, -40), this.scene)

  // todo move to remote Users
  enemyUnits: IGameUnit[] = []

  selectionPrgress = false

  ground: Ground
  centerOfMass: CenterOfMassMarker

  get selectedUnits () {
    return this.gameUnits.filter(unit => unit.isSelected)
  }

  constructor () {

    this.canvas = this.engine.getRenderingCanvas()

    this.initScene()
    this.adjustCanvasDimensions()
    this.addListeners()

    this.gameUnits = this.createInitialPlayerUnits()
    let formation = Formations.circularGrouping(this.gameUnits.length, new Vector3(0, 0, 0))
    for (let i = 0; i < this.gameUnits.length; i++) {
      this.gameUnits[i].mesh.position = formation[i]
    }
    this.camera.detachControl(this.canvas)

    this.centerOfMass = new CenterOfMassMarker(this.scene, true)
    this.centerOfMass.mesh.position = Formations.getCentroid(this.gameUnits)

    this.engine.runRenderLoop(() => {
      this.centerOfMass.mesh.position = Formations.getCentroid(this.gameUnits)

      this.scene.render()
    })
  }

  /**
   * We need this to get proper scaling of the 2d overlay canvas
   */
  adjustCanvasDimensions () {
    var width = this.context.canvas.clientWidth;
    var height = this.context.canvas.clientHeight;

    this.canvas2D.width = width
    this.canvas2D.height = height
    this.canvas2D.height = height
  }

  addListeners () {
    window.addEventListener('resize', () => {
      //todo some logic
      this.engine.resize()
      this.adjustCanvasDimensions()

    })
    this.scene.onPointerUp = this.onScenePointerDown.bind(this)

    /**
     * Creates events related to the 2d overlay
     */

    let onPointerMove = (evt: PointerEvent) => {
      this.endPos = { x: this.scene.pointerX, y: this.scene.pointerY }
      console.log('pointer move')

      let x = Math.min(this.startPos.x, this.endPos.x)
      let y = Math.min(this.startPos.y, this.endPos.y)
      let w = Math.abs(this.startPos.x - this.endPos.x)
      let h = Math.abs(this.startPos.y - this.endPos.y)

      this.context.clearRect(0, 0, this.canvas2D.width, this.canvas2D.height)

      if (CONFIG.SELECTION_CONFIG.Stroke) {
        this.context.strokeStyle = "#28ff26"
        this.context.strokeRect(x, y, w, h)
      }

      if (CONFIG.SELECTION_CONFIG.Fill) {
        this.context.globalAlpha = 0.2;
        this.context.fillRect(x, y, w, h)
        this.context.globalAlpha = 1;

      }

      // ignore accedental mouse select moves
      if (!(w < 4 && h < 4)) {
        this.selectionPrgress = true
      }
      console.log("select progres" + this.selectionPrgress)

    }
    // variable here because we want to remove it on mouse up

    let onPointerMoveB = onPointerMove.bind(this)

    window.addEventListener('mousedown', (evt: PointerEvent) => {
      /*
       if (evt.button !== common.MOUSE.LEFT) {
       return
       }
       */
      console.log('pointer down')

      this.startPos = { x: this.scene.pointerX, y: this.scene.pointerY }
      window.addEventListener('mousemove', onPointerMoveB)
    })

    // todo is this better/possible combined with the scene pointer down
    window.addEventListener('mouseup', (evt: PointerEvent) => {
        /*     if (evt.button !== common.MOUSE.LEFT) {
         return
         }*/
        window.removeEventListener('mousemove', onPointerMoveB)

        console.log('pointer up')
        if (!this.selectionPrgress) {
          return
        }
        this.selectionPrgress = false
        console.log("select progres" + this.selectionPrgress)

        this.context.clearRect(0, 0, this.canvas2D.width, this.canvas2D.height)
        if (!this.endPos) {
          return
        }

        let x = Math.min(this.startPos.x, this.endPos.x)
        let y = Math.min(this.startPos.y, this.endPos.y)
        let w = Math.abs(this.startPos.x - this.endPos.x)
        let h = Math.abs(this.startPos.y - this.endPos.y)

        // no need to select anything in this case
        if (w === 0 || h === 0) {
          return
        }
        this.OnSelectionEnd(x, y, w, h)

      }
    )

  }

  /**
   * Allows drawing over to select units and shows health points of units. Also shows selection rectangle when user
   * clicks and drags over units.
   */
  private canvas2D: HTMLCanvasElement = document.getElementById('gameOverlay') as HTMLCanvasElement

  private context: CanvasRenderingContext2D = this.canvas2D.getContext('2d')

  private startPos
  private endPos

  onScenePointerDown (evt, pickResult: BABYLON.PickingInfo) {
    console.log("scene pointer down")
    // ignore if not click
    if (evt.button !== 0 || this.selectionPrgress) {
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
          el.weapon.fire(el, this.enemyUnits[i], this.scene)
        })
        return
      }
    }

    // check for ground hit
    if (pickResult.pickedMesh === this.ground.mesh) {

      //ground hit, now check if any units selected
      if (this.gameUnits.filter((item: IGameUnit) => {return item.isSelected}).length) {
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
    let light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene)

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7
    // Move the sphere upward 1/2 its height
    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    this.ground = new Ground(this.scene)

    // Skybox
    let skybox = BABYLON.Mesh.CreateBox('skyBox', 750.0, this.scene)
    let skyboxMaterial = new BABYLON.StandardMaterial('skyBox', this.scene)
    skyboxMaterial.backFaceCulling = false
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0)
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0)
    skyboxMaterial.emissiveColor = new BABYLON.Color3(0, 0.0, 0.0)
    skybox.material = skyboxMaterial
    this.setUpDummyEnemys()
  }

  addMoveCommand (pickResult: BABYLON.Vector3) {
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
      // console.log('dist: ' + distance + ' frames' + framesNeeded)

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
      this.scene.beginAnimation(unit.mesh, 0, framesNeeded, true) // todo move animation to server side
    }
  }

  createInitialPlayerUnits () {
    let cores: IGameUnit[] = []
    for (let i = 0; i < this.startingNumberOfCores; i++) {
      let core = new Core(this.scene, true)
      core.mesh.position.y = common.defaultY
      cores.push(core)
    }
    return cores
  }

  setUpDummyEnemys () {

    for (let i = 0; i < 5; i++) {
      let newCore = new Core(this.scene, false)
      let newCore2 = new Core(this.scene, false)
      newCore.mesh.position = new Vector3(10 + 2 * i, common.defaultY, 10 + 2 * i)
      newCore2.mesh.position = new Vector3(14 + 2 * i, common.defaultY, 10 + 2 * i)
      this.enemyUnits.push(newCore)
      this.enemyUnits.push(newCore2)

    }
  }

  deselectAllUnits () {
    this.gameUnits.forEach(unit => {unit.deselect()})
  }

  OnSelectionEnd (x: number, y: number, w: number, h: number) {

    let area: Array<BABYLON.Vector3> = new Array<BABYLON.Vector3>(4)
    let units: Array<BABYLON.AbstractMesh>

    // Translate points to world coordinates
    area[0] = this.scene.pick(x, y).pickedPoint
    area[1] = this.scene.pick(x + w, y).pickedPoint
    area[2] = this.scene.pick(x + w, y + h).pickedPoint
    area[3] = this.scene.pick(x, y + h).pickedPoint

    // this._selectedUnits = this._players[this._localPlayer].units.filter(

    let toBeSelected: IGameUnit[] = this.gameUnits.filter(
      (unit: IGameUnit) => {
        return MathHelpers.isPointInPolyBabylon(area, unit.mesh.position) // helper is up
      })

    if (!toBeSelected.length) {
      return
    }

    // todo option for appending selection
    this.deselectAllUnits()

    toBeSelected.forEach(
      (unit: IGameUnit) => {
        if (MathHelpers.isPointInPolyBabylon(area, unit.mesh.position)) {
          unit.select()
        }
      })

    console.log(this.selectedUnits)

  }

  /**
   * this show health and stuff on 2d canvas
   * @param units
   */
  showUnitsStatus (units: Array<IGameUnit>) {
    units.forEach((unit: IGameUnit) => {
      // let info:BoundingInfo = unit.mesh.getpic
      // this.context2D.fillText(info.toString(),info.x)
    })
  }
}

