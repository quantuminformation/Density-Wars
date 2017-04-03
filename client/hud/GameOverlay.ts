import { IGameUnit } from '../gameUnits/IGameUnit'
import { common } from '../Common'
import {CONFIG} from '../Config'
import BoundingInfo = BABYLON.BoundingInfo
import FreeCamera = BABYLON.FreeCamera

/**
 * Allows drawing over to select units and shows health points of units. Also shows selection rectangle when user
 * clicks and drags over units.
 */
export default class GameOverlay {

  public OnSelectionEnd: (x: number, y: number,
                          w: number, h: number) => void = undefined

  private scene: BABYLON.Scene
  private clicked = false
  private canvas2D: HTMLCanvasElement = document.getElementById('gameOverlay') as HTMLCanvasElement
  private context: CanvasRenderingContext2D = this.canvas2D.getContext('2d')

  private startPos
  private endPos

  private onPointerDown: (evt: PointerEvent) => void
  private onPointerMove: (evt: PointerEvent) => void
  private onPointerUp: (evt: PointerEvent) => void

  private selectedUnits: Array<IGameUnit>

  constructor (scene: BABYLON.Scene, public camera: FreeCamera) {
    this.scene = scene
    this.createEvents()
  }

  createEvents () {
    this.onPointerDown = (evt: PointerEvent) => {
/*
      if (evt.button !== common.MOUSE.LEFT) {
        return
      }
*/
      console.log('pointer down')
      // window.onmousemove = this.OnPointerMove
      window.addEventListener('mousemove', this.onPointerMove)
      this.startPos = { x: this.scene.pointerX, y: this.scene.pointerY }
    }

    this.onPointerMove = (evt: PointerEvent) => {
      this.endPos = { x: this.scene.pointerX, y: this.scene.pointerY }
      console.log('pointer move')

      // Calculate positions
      let x = Math.min(this.startPos.x, this.endPos.x)
      let y = Math.min(this.startPos.y, this.endPos.y)
      let w = Math.abs(this.startPos.x - this.endPos.x)
      let h = Math.abs(this.startPos.y - this.endPos.y)

      // Draw rect
      this.context.clearRect(0, 0, this.canvas2D.width, this.canvas2D.height)
      this.context.beginPath()

      if (CONFIG.SELECTION_CONFIG.Stroke) {
        this.context.strokeRect(x, y, w, h)
      }

      if (CONFIG.SELECTION_CONFIG.Fill) {
        this.context.fillRect(x, y, w, h)
      }

      this.context.stroke()
    }

    this.onPointerUp = (evt: PointerEvent) => {
 /*     if (evt.button !== common.MOUSE.LEFT) {
        return
      }*/
      console.log('pointer up')

      this.context.clearRect(0, 0, this.canvas2D.width, this.canvas2D.height)
      window.removeEventListener('mousemove', this.onPointerMove)

      if (this.OnSelectionEnd !== undefined) {
        let x = Math.min(this.startPos.x, this.endPos.x)
        let y = Math.min(this.startPos.y, this.endPos.y)
        let w = Math.abs(this.startPos.x - this.endPos.x)
        let h = Math.abs(this.startPos.y - this.endPos.y)

        this.OnSelectionEnd(x, y, w, h)
        h = 0
        w = 0
      }
    }

    window.addEventListener('mousedown', this.onPointerDown)
    window.addEventListener('mouseup', this.onPointerUp)
  }

  /**
   * this show health and stuff on 2d canvas
   * @param units
   */
  showUnitsStatus (units: Array<IGameUnit>) {
    units.forEach((unit: IGameUnit) => {
      // let tm = camera
      // let info:BoundingInfo = unit.mesh.getpic
      // this.context2D.fillText(info.toString(),info.x)
    })
  }

}
