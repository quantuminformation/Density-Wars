
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

    //Creation of a material with wireFrame
    this.defaultMaterial = new BABYLON.StandardMaterial("wireframe", scene);
    this.defaultMaterial.wireframe = true;


    this.mesh = BABYLON.Mesh.CreateGround("ground1", Common.MEDIUM_SIZE_MAP, Common.MEDIUM_SIZE_MAP, Common.MEDIUM_SIZE_MAP_SUBDIVISIONS, scene);

    this.defaultMaterial = new BABYLON.StandardMaterial("wireframe", scene);
    this.defaultMaterial.wireframe = true;

    this.mesh.material = this.defaultMaterial;
  }

}

