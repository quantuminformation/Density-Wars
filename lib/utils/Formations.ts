import Common from "../Common"
import {IGameUnit} from "../gameUnits/IGameUnit";
import Vector3 = BABYLON.Vector3;

export default class Formations {
  /**
   * returns array of vector3 on the edge of a circle equally spaced around a given point

   * @param amount
   * @param center
   * @param spacing
   * @returns {Array<Vector3>}
   */

  static circularGrouping(amount:number, center:Vector3, spacing:number = 1) {

    if (amount < 1) {
      //  throw new Error("weird formation");
    }
    var arr:Array<Vector3> = [];
    if (amount === 1) {
      arr.push(center);
      return arr;
    }

    for (var i = 0; i < amount; i++) {
      var angleDeg = i * (360 / amount);
      var angleRad = (angleDeg / 360) * 2 * Math.PI;
      var customVector = new BABYLON.Vector3(-Math.cos(angleRad) * spacing, Common.defaultY * spacing, -Math.sin(angleRad) * spacing);
      arr.push(center.add(customVector));
    }

    return arr;
  }

  /**
   * Gets centroid (center of mass) of units
   * @param units
   * @returns {BABYLON.Vector3}
     */
  static getCentroid(units:Array<IGameUnit>) {
    var totalMass:number = 0;
    var totalX:number = 0;
    var totalZ:number = 0;
    units.forEach(unit=> {
      totalMass += unit.mass;
      totalX += unit.mesh.position.x * unit.mass
      totalZ += unit.mesh.position.z * unit.mass
    })

    return new Vector3 (totalX / totalMass,Common.defaultY, totalZ / totalMass);
  }


}
