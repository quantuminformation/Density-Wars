import Common from "../Common"

export default class Formations{
  /**
   * positions an array of GameUnit's on the edge of a circle equally spaced
   * @param gameUnits
   */
  static postionCircular(gameUnits:Array<IGameUnit>) {
    "use strict";
    for (var i = 0; i < gameUnits.length; i++) {
      var angleDeg = i * (360 / gameUnits.length);
      var angleRad = (angleDeg / 360) * 2 * Math.PI;
      var customVector = new BABYLON.Vector3(-Math.cos(angleRad), Common.defaultY, -Math.sin(angleRad));
      gameUnits[i].mesh.position = customVector;
    }
  }
}
