/**
 * User commands for units/groups
 *
 * This is used to control units by themselves or as a larger selection of units. If it is just one unit the unit
 * will follow the command as instructed. If the command is applied to a selection
 *
 * No uni
 */
class UnitCommand {

  groupID:number;
  destination:BABYLON.Vector3;
  task;
  commandType:CommandType;

  /**
   * Sets up the command. Some commands require a position vector3d if they do not have an end target like another unit
   * @param commandType
   * @param vector3d
   */
  constructor(commandType:CommandType, vector3d:BABYLON.Vector3 = null) {
    this.groupID; //optional if assigned to user group
    this.destination = vector3d;
    this.task; //attack/defend etc
  }
}

enum CommandType {
  Move = 1,
  Attack = 2,
  Defend = 3
}
