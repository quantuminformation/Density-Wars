import {IGameUnit} from "../gameUnits/IGameUnit";
import WeaponModifier from "../modifiers/WeaponModifier";
import StandardMaterial = BABYLON.StandardMaterial;
import Formations from "../utils/Formations";
import Common from "../Common";
import {IWeapon} from "./IWeapon";

/**
 * Fires a laser from one game object to another
 *
 * For simplicity it fires and renders instantly(speed of light) and remains 1 second afterglow
 *
 * //todo add range dependant laser damage for lasers that diffuse through area like this one
 */
export default class Laser implements IWeapon {
  initialDamage:number = 5;
  weaponModifier:WeaponModifier = new WeaponModifier();

  constructor() {

  }

  /**
   * Fires laser from one unit to another
   * @param from
   * @param to
   */
  fire(from:IGameUnit, to:IGameUnit, scene:BABYLON.Scene):boolean {
    //todo apply damage to target
    to.takeDamage(this.initialDamage);

    var distance = Formations.Distance2D(from.mesh.position, to.mesh.position);


    var mesh:BABYLON.Mesh = BABYLON.Mesh.CreateCylinder("cylinder", distance, 0.02, 0.2, 36, 2, scene, true);

    mesh.setPivotMatrix(BABYLON.Matrix.Translation(0, -distance / 2, 0));
    mesh.position = from.mesh.position;

    var v1 = from.mesh.position.subtract(to.mesh.position);
    v1.normalize();
    var v2 = new BABYLON.Vector3(0, 1, 0);

    // Using cross we will have a vector perpendicular to both vectors
    var axis = BABYLON.Vector3.Cross(v1, v2);
    axis.normalize();
    console.log(axis);

    // Angle between vectors
    var angle = BABYLON.Vector3.Dot(v1, v2);
    console.log(angle);

    // Then using axis rotation the result is obvious
    mesh.rotationQuaternion = BABYLON.Quaternion.RotationAxis(axis, -Math.PI / 2 + angle);

    var material:StandardMaterial = new BABYLON.StandardMaterial("green", scene);

    material.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.8);
    material.specularColor = new BABYLON.Color3(0.4, 0.4, 0.8);


    material.emissiveColor = BABYLON.Color3.Green();
    mesh.material = material;

    var animationFadeOut = new BABYLON.Animation("animationCore", "position", Common.ANIMATIONS_FPS, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
/*    var keys = [];
    keys.push({frame: 0, value: 1});

    keys.push({
      frame: Common.ANIMATIONS_FPS * 2, //fade lasting n seconds
      value: 0
    });*/
   // animationFadeOut.setKeys(keys);
  //  scene.beginAnimation(material.alpha, 0, Common.ANIMATIONS_FPS * 21,true,1, ()=> mesh.dispose());


    return;
  }
}

