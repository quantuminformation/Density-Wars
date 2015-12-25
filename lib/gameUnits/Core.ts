import UnitCommand from '../utils/UnitCommand';
import Common from "../Common";
import {IGameUnit} from "../gameUnits/IGameUnit";


/**
 *
 * User controllable unit
 */
export default class Core implements IGameUnit {
  mesh:BABYLON.Mesh;
  isSelected:boolean; //selected units can receive new commands
  modifiers:Array<any>;
  hitPoints:number = 10;
  click:(e:MouseEvent)=>void;

  defaultMaterial:BABYLON.StandardMaterial;
  selectedMaterial:BABYLON.StandardMaterial;

  //todo investigate the feasibility of chained commands or queued commands
  //currentCommands:Array<any>;
  currentCommand:UnitCommand; //poss move to Igameunit

  constructor(scene, isSelected = false) {
    this.mesh = BABYLON.Mesh.CreateSphere("sphere1", 8, Common.MEDIUM_UNIT_SIZE, scene);
    this.isSelected;//selected units receive commands
    this.isSelected;//selected units receive commands
    this.isSelected;//selected units receive commands
    this.modifiers = [];//powerups,shields etc

    this.selectedMaterial = new BABYLON.StandardMaterial("selected", scene);
    this.selectedMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    this.selectedMaterial.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    // sphereMat.emissiveColor = BABYLON.Color3.Green();

    //Creation of a material with wireFrame
    this.defaultMaterial = new BABYLON.StandardMaterial("wireframe", scene);
    this.defaultMaterial.wireframe = true;

    this.mesh.material = this.defaultMaterial;
  }

  setSelected(isSelected:boolean) {
    this.isSelected = isSelected;
    if (this.isSelected) {
      this.mesh.material = this.selectedMaterial;
    }
    else {
      this.mesh.material = this.defaultMaterial;
    }
  }
}

