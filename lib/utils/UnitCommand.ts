/**
 *
 * User controls for units/groups
 */
export default
class UnitCommand {

  groupID:number;
  destination:BABYLON.Vector3;
  task;

  constructor(vector3d:BABYLON.Vector3) {
    this.groupID; //optional if assigned to user group
    this.destination = vector3d;
    this.task; //attack/defend etc
  }
}

