import Vector3 = BABYLON.Vector3

export default class MathHelpers {

// A MathHelper for bellow, can be done faster via, I hadn't had time to implement it yet
// http://math.stackexchange.com/questions/190111/how-to-check-if-a-point-is-inside-a-rectangle
  static isPointInPolyBabylon (poly: Array<BABYLON.Vector3>, pt: BABYLON.Vector3) {
    for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i) {
      ((poly[i].z <= pt.z && pt.z < poly[j].z) || (poly[j].z <= pt.z && pt.z < poly[i].z))
      && (pt.x < (poly[j].x - poly[i].x) * (pt.z - poly[i].z) / (poly[j].z - poly[i].z) + poly[i].x)
      && (c = !c)
    }
    return c
  }
}
