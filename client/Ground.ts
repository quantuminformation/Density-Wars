import { common } from './Common'
import Texture = BABYLON.Texture

const url =  require('./assets/img/background.png')
console.log(url);


/**
 *
 * The ground (actually a grid in space) that the game sits upon
 */
export default class Ground {
  mesh: BABYLON.Mesh
  click: (e: MouseEvent) => void

  defaultMaterial:  BABYLON.StandardMaterial

   constructor (scene) {

    // Creation of a plane with a texture
    this.mesh = BABYLON.Mesh.CreatePlane('ground', common.MEDIUM_SIZE_MAP, scene)
    let matGround = new BABYLON.StandardMaterial('matGround', scene)
    matGround.diffuseTexture = new BABYLON.Texture(url, scene);
    (matGround.diffuseTexture as Texture).uScale = common.MEDIUM_SIZE_MAP_SUBDIVISIONS;
    (matGround.diffuseTexture as Texture).vScale = common.MEDIUM_SIZE_MAP_SUBDIVISIONS
    matGround.specularColor = new BABYLON.Color3(0, 0, 0)
    matGround.specularColor = new BABYLON.Color3(0, 0, 0)
    this.mesh.material = matGround
    this.mesh.rotation.x = Math.PI / 2
    this.mesh.position = new BABYLON.Vector3(0, 0, 0)
  }
}


/*
let img = new Image()
img.src = require('url-loader?limit=10000!./lib/assets/img/background')
*/
