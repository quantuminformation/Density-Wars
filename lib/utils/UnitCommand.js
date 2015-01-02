/**
 *
 * User controls for units/groups
 */
export default
class UnitCommand {
	constructor(vector3d) {
		this.groupID; //optional if assigned to user group
		this.destination = vector3d;
		this.task; //attack/defend etc
	}
}

