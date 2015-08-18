/// <reference path="IGameUnit.ts" />
/// <reference path="../../babylonjs.d.ts" />


/**
 *
 * User controllable unit
 */
class Core implements IGameUnit {
  mesh:any;
  isSelected:boolean;
  modifiers:Array<any>;
  //todo investigate the feasibility of chained commands or queued commands
  //currentCommands:Array<any>;
  currentCommand:UnitCommand; //poss move to Igameunit
  click:(e:MouseEvent)=>void;

  constructor(scene) {
    this.mesh = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
    this.isSelected;//selected units receive commands
    this.modifiers = [];//powerups,shields etc
  }
}

