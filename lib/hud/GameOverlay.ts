import {IGameUnit} from "../gameUnits/IGameUnit";
import BoundingInfo = BABYLON.BoundingInfo;
import FreeCamera = BABYLON.FreeCamera;
import {MOUSE} from "../Common";


/**
 * Allows drawing over to select units and shows health points of units. Also shows selection rectangle when user
 * clicks and drags over units.
 *
 *
 */
export default class GameOverlay {

  private _scene:BABYLON.Scene;
  private _clicked = false;
  private _canvas2D:HTMLCanvasElement;
  private _context:CanvasRenderingContext2D =this._canvas2D.getContext('2d');


  private _startPos;
  private _endPos;
  private _config:Config;

  private _onPointerDown:(evt:PointerEvent) => void;
  private _onPointerMove:(evt:PointerEvent) => void;
  private _onPointerUp:(evt:PointerEvent) => void;

  public OnSelectionEnd:(x:number, y:number,
                         w:number, h:number) => void = undefined;


  constructor(scene:BABYLON.Scene, public camera:FreeCamera) {
    this._scene = scene;
    this.createEvents();
  }






// A MathHelper for bellow, can be done faster via, I hadn't had time to implement it yet
// http://math.stackexchange.com/questions/190111/how-to-check-if-a-point-is-inside-a-rectangle
  static isPointInPolyBabylon(poly: Array<BABYLON.Vector3>, pt: BABYLON.Vector3) {
    for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
      ((poly[i].z <= pt.z && pt.z < poly[j].z) || (poly[j].z <= pt.z && pt.z < poly[i].z))
      && (pt.x < (poly[j].x - poly[i].x) * (pt.z - poly[i].z) / (poly[j].z - poly[i].z) + poly[i].x)
      && (c = !c);
    return c;
  }

//
// Somehwhere in code ...
//

// OnSelectionEnd implementation
  _handleSelection.OnSelectionEnd =
    (x:number, y:number, w:number, h:number) => {

      var area:Array<BABYLON.Vector3> = new Array<BABYLON.Vector3>(4);
      var units:Array<BABYLON.AbstractMesh>;

      // Clear current selection of selected units
      this._selectedUnits.length = 0;

      // In case when area is selected
      if (w != 0 && h != 0) {
        // Translate points to world coordinates
        area[0] = this.scene.pick(x, y).pickedPoint;
        area[1] = this.scene.pick(x + w, y).pickedPoint;
        area[2] = this.scene.pick(x + w, y + h).pickedPoint;
        area[3] = this.scene.pick(x, y + h).pickedPoint;

        // Go through all units of your player and save them in an array
        this._selectedUnits = this._players[this._localPlayer].units.filter(
          (e:Entities.IUnit) => {
            return (<any>e).mesh.type === ObjectType.UNIT &&
              MathHelpers.isPointInPolyBabylon(area, e.position); // helper is up
          });

        console.log(this._selectedUnits);
      }
      // Only one unit is selected
      else {
        var p = this.scene.pick(x, y);

        if (!p.pickedMesh)
          return;

        if ((<any>p).type != ObjectType.UNIT)
          return;

        units.push(p.pickedMesh);
      }
    }











  private createEvents() {
    this._onPointerDown = (evt:PointerEvent) => {
      if (evt.button != MOUSE.)
        return;

      // window.onmousemove = this.OnPointerMove;
      window.addEventListener("mousemove", this._onPointerMove);
      this._startPos = {x: this._scene.pointerX, y: this._scene.pointerY};
    }

    this._onPointerMove = (evt:PointerEvent) => {
      this._endPos = {x: this._scene.pointerX, y: this._scene.pointerY};

      // Calculate positions
      var x = Math.min(this._startPos.x, this._endPos.x);
      var y = Math.min(this._startPos.y, this._endPos.y);
      var w = Math.abs(this._startPos.x - this._endPos.x);
      var h = Math.abs(this._startPos.y - this._endPos.y);

      // Draw rect
      this._context.clearRect(0, 0, this._canvas2D.width, this._canvas2D.height);
      this._context.beginPath();

      if (this._config.Selection.Stroke)
        this._context.strokeRect(x, y, w, h);

      if (this._config.Selection.Fill)
        this._context.fillRect(x, y, w, h);

      this._context.stroke();
    }

    this._onPointerUp = (evt:PointerEvent) => {
      if (evt.button != MOUSE.)
        return;

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


  showUnitsStatus(units:Array<IGameUnit>) {
    units.forEach((unit:IGameUnit)=> {
      //var tm = camera
      //var info:BoundingInfo = unit.mesh.getpic;
      // this.context2D.fillText(info.toString(),info.x)
    })
  }
}

// A couple of variable to remove hard coded variables
class SelectionConfig {
  public Stroke:boolean = true;
  public StrokeWidth:number = 2;
  public StrokeColor:string = "rgba(0, 255, 0, 0.5)";

  public Shadow:boolean = true;

  public Fill:boolean = true;
  public FillColor:string = "rgba(0, 255, 0, 0.15)";
}

export class Config {
  public Selection:SelectionConfig = new SelectionConfig();
}


// I wrapped my code logic in here, it only handles
// drawing a rectangle on the canvas and when mouse button released
// OnSelectionEnd method is called (bellow implementation)


