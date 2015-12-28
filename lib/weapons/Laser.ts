import {IGameUnit} from "../gameUnits/IGameUnit";
import WeaponModifier from "../modifiers/WeaponModifier";
import StandardMaterial = BABYLON.StandardMaterial;

/**
 * Fires a laser from one game object to another
 *
 * For simplicity it fires and renders instantly(speed of light) and remains 1 second afterglow
 *
 * //todo add group laser firing and laser adding
 */
export default class laser {
  intialDamage:number = 10;
  weaponModifier:WeaponModifier = new WeaponModifier();

  constructor() {

  }

  /**
   * Fires laser from one unit to another
   * @param from
   * @param to
   */
  fire(from:IGameUnit, to:IGameUnit, scene:BABYLON.Scene):boolean {
    //todo draw laser + apply damage to 'tp


    var mesh = BABYLON.Mesh.CreateBox("beam", {width: 0.1, height: 0.1, depth: 10}, scene);
    mesh.position = from.mesh.position;


    var material:StandardMaterial = new BABYLON.StandardMaterial("green", scene);

    material.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.8);
    material.specularColor = new BABYLON.Color3(0.4, 0.4, 0.8);


    material.emissiveColor = BABYLON.Color3.Green();
    mesh.material = material;

    return;
  }
}

