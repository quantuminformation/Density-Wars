import {IGameUnit} from "../gameUnits/IGameUnit";
import {common} from "../Common";
import Config from "../Config";
import BoundingInfo = BABYLON.BoundingInfo;
import FreeCamera = BABYLON.FreeCamera;


/**
 * Allows drawing over to select units and shows health points of units. Also shows selection rectangle when user
 * clicks and drags over units.
 */
export default class GameOverlay {

  private _scene:BABYLON.Scene;
  private _clicked = false;
  private _canvas2D:HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("gameOverlay")
  private _context:CanvasRenderingContext2D = this._canvas2D.getContext('2d');

  private _startPos;
  private _endPos;

  private _onPointerDown:(evt:PointerEvent) => void;
  private _onPointerMove:(evt:PointerEvent) => void;
  private _onPointerUp:(evt:PointerEvent) => void;

  private _selectedUnits:Array<IGameUnit>;

  public OnSelectionEnd:(x:number, y:number,
                         w:number, h:number) => void = undefined;

  constructor(scene:BABYLON.Scene, public camera:FreeCamera) {
    this._scene = scene;
    this.createEvents();
  }

  createEvents() {
    this._onPointerDown = (evt:PointerEvent) => {
      if (evt.button != common.MOUSE.LEFT) {
        return;
      }
      console.log("pointer down")
      // window.onmousemove = this.OnPointerMove;
      window.addEventListener("mousemove", this._onPointerMove);
      this._startPos = {x: this._scene.pointerX, y: this._scene.pointerY};
    }

    this._onPointerMove = (evt:PointerEvent) => {
      this._endPos = {x: this._scene.pointerX, y: this._scene.pointerY};
      console.log("pointer move")

      // Calculate positions
      var x = Math.min(this._startPos.x, this._endPos.x);
      var y = Math.min(this._startPos.y, this._endPos.y);
      var w = Math.abs(this._startPos.x - this._endPos.x);
      var h = Math.abs(this._startPos.y - this._endPos.y);

      // Draw rect
      this._context.clearRect(0, 0, this._canvas2D.width, this._canvas2D.height);
      this._context.beginPath();

      if (Config.SELECTION_CONFIG.Stroke)
        this._context.strokeRect(x, y, w, h);

      if (Config.SELECTION_CONFIG.Fill)
        this._context.fillRect(x, y, w, h);

      this._context.stroke();
    }

    this._onPointerUp = (evt:PointerEvent) => {
      if (evt.button != common.MOUSE.LEFT) {
        return;
      }
      console.log("pointer up")


      this._context.clearRect(0, 0, this._canvas2D.width, this._canvas2D.height);
      window.removeEventListener("mousemove", this._onPointerMove);

      if (this.OnSelectionEnd != undefined) {
        var x = Math.min(this._startPos.x, this._endPos.x);
        var y = Math.min(this._startPos.y, this._endPos.y);
        var w = Math.abs(this._startPos.x - this._endPos.x);
        var h = Math.abs(this._startPos.y - this._endPos.y);

        this.OnSelectionEnd(x, y, w, h);
        h = 0;
        w = 0;
      }
    }

    window.addEventListener("mousedown", this._onPointerDown);
    window.addEventListener("mouseup", this._onPointerUp);
  }

  /**
   * this show health and stuff on 2d canvas
   * @param units
   */
  showUnitsStatus(units:Array<IGameUnit>) {
    units.forEach((unit:IGameUnit)=> {
      //var tm = camera
      //var info:BoundingInfo = unit.mesh.getpic;
      // this.context2D.fillText(info.toString(),info.x)
    })
  }

  // todo, destroy method?

}

