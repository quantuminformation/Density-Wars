import UnitCommand from '../utils/UnitCommand';
import {common} from "../Common";
import {IGameUnit} from "../gameUnits/IGameUnit";
import ActionEvent = BABYLON.ActionEvent;
import Laser from "../weapons/Laser";


/**
 * CenterOfMassMarker
 *
 * Shows center of mass of all units
 */


//todo team colours, friendlies
export  class CenterOfMassMarker {
  mesh: BABYLON.Mesh;

  isOwn: boolean;

  /**
   *
   * @param scene
   * @param isOwn
   */
  constructor(scene, isOwn) {

    this.mesh = BABYLON.Mesh.CreateBox("sphere1", common.MEDIUM_UNIT_SIZE, scene);
    this.isOwn = isOwn;

    var material = new BABYLON.StandardMaterial("green", scene);

    if (isOwn) {
      material.diffuseColor = new BABYLON.Color3(1, 1, 1);
      material.specularColor = new BABYLON.Color3(1, 1, 1);
    } else {
      material.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
      material.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    }
    material.emissiveColor = BABYLON.Color3.Green();

    this.mesh.material = material;

  }
}

