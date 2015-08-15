/**
 *
 * User controllable unit
 */
export default
class Core implements IGameUnit{
  sphere: BABYLON.Mesh.Sphere;
  isSelected:boolean;
  modifiers:Array;
  currentCommands:Array;
  constructor(scene) {
    this.sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
    this.isSelected;//selected units receive commands
    this.modifiers = [];//powerups,sheldss etc
    this.currentCommands = [];
    //todo investigate queued commands
  }
}

