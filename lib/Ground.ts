import Common from "./Common";
/**
 *
 * The ground (actually a grid in space) that the game sits upon
 */
export default class Ground {
  mesh:BABYLON.Mesh;
  click:(e:MouseEvent)=>void;

  defaultMaterial:BABYLON.StandardMaterial;

  constructor(scene) {

    //Creation of a plane with a texture
    this.mesh = BABYLON.Mesh.CreatePlane("ground", Common.MEDIUM_SIZE_MAP, scene);
    var matGround = new BABYLON.StandardMaterial("matGround", scene);
    matGround.diffuseTexture = new BABYLON.Texture("lib/assets/img/background.png", scene);
    matGround.diffuseTexture.uScale = Common.MEDIUM_SIZE_MAP_SUBDIVISIONS;
    matGround.diffuseTexture.vScale = Common.MEDIUM_SIZE_MAP_SUBDIVISIONS;
    matGround.specularColor = new BABYLON.Color3(0, 0, 0);
    this.mesh.material = matGround;
    this.mesh.rotation.x = Math.PI / 2;
    this.mesh.position = new BABYLON.Vector3(0, 0, 0);
  }

}

