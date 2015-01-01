/**
 *
 * User controllable unit
 */
export class Core {
	constructor(scene) {
		this.sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
	}
}

