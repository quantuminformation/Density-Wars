/// <reference path="IGameUnit.ts" />
/// <reference path="../../babylonjs.d.ts" />


/**
 *
 * User controllable unit
 */
class Core implements IGameUnit {
  mesh:BABYLON.Mesh;
  isSelected:boolean;
  modifiers:Array<any>;
  hitPoints:number = 10;
  click:(e:MouseEvent)=>void;

  //todo investigate the feasibility of chained commands or queued commands
  //currentCommands:Array<any>;
  currentCommand:UnitCommand; //poss move to Igameunit

  constructor(scene) {
    this.mesh = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
    this.isSelected;//selected units receive commands
    this.modifiers = [];//powerups,shields etc

    var sphereMat = new BABYLON.StandardMaterial("ground", scene);
    sphereMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    sphereMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    sphereMat.emissiveColor = BABYLON.Color3.Purple();
    this.mesh.material = sphereMat;
  }
}

