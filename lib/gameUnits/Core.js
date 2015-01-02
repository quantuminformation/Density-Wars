/**
 *
 * User controllable unit
 */
export default
class Core {
	constructor(scene) {
		this.sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
		this.isSelected;//selected units receive commands
		this.modifiers = [];//powerups,sheldss etc
		this.currentCommands = [];
		//todo investigate queued commands
	}
}

