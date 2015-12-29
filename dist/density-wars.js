/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Core_1 = __webpack_require__(2);
	var Formations_ts_1 = __webpack_require__(6);
	var Common_1 = __webpack_require__(3);
	var Ground_1 = __webpack_require__(7);
	var Vector3 = BABYLON.Vector3;
	var CenterOfMassMarker_1 = __webpack_require__(8);
	__webpack_require__(9);
	//todo I can't figure out a way to import with webpack so I load in index.html
	//import BABYLON from 'babylonjs'
	var self; //todo not sure about this
	var Game = (function () {
	    function Game() {
	        var _this = this;
	        this.startingNumberOfCores = 6;
	        //todo move to remote Users
	        this.enemyUnits = [];
	        self = this;
	        // Load BABYLON 3D engine
	        this.engine = new BABYLON.Engine(document.getElementById("glcanvas"), true);
	        this.canvas = this.engine.getRenderingCanvas();
	        this.initScene();
	        this.cores = this.createInitialPlayerUnits();
	        var formation = Formations_ts_1.default.circularGrouping(this.cores.length, new Vector3(0, 0, 0));
	        for (var i = 0; i < this.cores.length; i++) {
	            this.cores[i].mesh.position = formation[i];
	        }
	        this.centerOfMass = new CenterOfMassMarker_1.default(this.scene, true);
	        this.centerOfMass.mesh.position = Formations_ts_1.default.getCentroid(this.cores);
	        this.engine.runRenderLoop(function () {
	            _this.centerOfMass.mesh.position = Formations_ts_1.default.getCentroid(_this.cores);
	            _this.scene.render();
	        });
	        window.addEventListener("resize", function () {
	            //todo some logic
	            self.engine.resize();
	        });
	    }
	    Game.prototype.initScene = function () {
	        var _this = this;
	        this.scene = new BABYLON.Scene(this.engine);
	        // This creates and positions a free camera (non-mesh)
	        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 15, -40), this.scene);
	        // This targets the camera to scene origin
	        camera.setTarget(BABYLON.Vector3.Zero());
	        // This attaches the camera to the canvas
	        camera.attachControl(this.canvas, true);
	        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
	        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);
	        // Default intensity is 1. Let's dim the light a small amount
	        light.intensity = 0.7;
	        // Move the sphere upward 1/2 its height
	        // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
	        this.ground = new Ground_1.default(this.scene);
	        this.scene.onPointerDown = function (evt, pickResult) {
	            //ignore if not click
	            if (evt.button !== 0) {
	                return;
	            }
	            //deselction of of other units if todo add to selection (shift
	            var isOwnUnitHit = _this.cores.some(function (el) {
	                return pickResult.pickedMesh === el.mesh;
	            });
	            if (isOwnUnitHit) {
	                if (evt.shiftKey) {
	                    return; // the unit will select itself in the events manager
	                }
	                //desselect others
	                _this.cores.filter(function (el) {
	                    return pickResult.pickedMesh !== el.mesh;
	                }).forEach(function (el) {
	                    el.deselect();
	                });
	                return;
	            }
	            //check for enemy targeted
	            for (var i = 0; i < _this.enemyUnits.length; i++) {
	                if (pickResult.pickedMesh === _this.enemyUnits[i].mesh) {
	                    _this.cores.filter(function (el) {
	                        return el.isSelected;
	                    }).forEach(function (el) {
	                        el.weapon.fire(el, _this.enemyUnits[i], _this.scene);
	                    });
	                    return;
	                }
	            }
	            //check for ground hit
	            if (pickResult.pickedMesh === self.ground.mesh) {
	                //ground hit, now check if any units selected
	                if (self.cores.filter(function (item) {
	                    return item.isSelected;
	                }).length) {
	                    self.addMoveCommand(pickResult.pickedPoint);
	                }
	            }
	            else {
	            }
	        };
	        // Skybox
	        var skybox = BABYLON.Mesh.CreateBox("skyBox", 750.0, this.scene);
	        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
	        skyboxMaterial.backFaceCulling = false;
	        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	        skyboxMaterial.emissiveColor = new BABYLON.Color3(0, 0.0, 0.0);
	        skybox.material = skyboxMaterial;
	        this.setUpDummyEnemys();
	    };
	    //todo from mouse/keyboard
	    Game.prototype.addMoveCommand = function (pickResult) {
	        console.log(pickResult);
	        var selectedUnits = this.cores.filter(function (unit) {
	            return unit.isSelected;
	        });
	        var formation = Formations_ts_1.default.circularGrouping(selectedUnits.length, pickResult);
	        for (var i = 0; i < selectedUnits.length; i++) {
	            var unit = selectedUnits[i];
	            //pythagoras
	            var distance = Math.sqrt(Math.pow(pickResult.x - unit.mesh.position.x, 2) + Math.pow(pickResult.z - unit.mesh.position.z, 2));
	            var framesNeeded = Math.round((distance / Common_1.default.MEDIUM_SPEED) * Common_1.default.ANIMATIONS_FPS);
	            console.log('dist: ' + distance + ' frames' + framesNeeded);
	            var animationBezierTorus = new BABYLON.Animation("animationCore", "position", Common_1.default.ANIMATIONS_FPS, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
	            var keysBezierTorus = [];
	            keysBezierTorus.push({ frame: 0, value: unit.mesh.position });
	            keysBezierTorus.push({
	                frame: framesNeeded,
	                value: unit.mesh.position = formation[i]
	            });
	            animationBezierTorus.setKeys(keysBezierTorus);
	            // var bezierEase = new BABYLON.BezierCurveEase(0.445, 0.05, 0.55, 0.95);
	            //animationBezierTorus.setEasingFunction(bezierEase);
	            unit.mesh.animations.push(animationBezierTorus);
	            this.scene.beginAnimation(unit.mesh, 0, framesNeeded, true);
	        }
	        ;
	        //todo investigate queued commands
	    };
	    Game.prototype.createInitialPlayerUnits = function () {
	        //var cores = Array<IGameUnit>;
	        var cores = [];
	        for (var i = 0; i < this.startingNumberOfCores; i++) {
	            var core = new Core_1.default(this.scene, true);
	            core.mesh.position.y = Common_1.default.defaultY;
	            cores.push(core);
	        }
	        return cores;
	    };
	    Game.prototype.setUpDummyEnemys = function () {
	        var core = new Core_1.default(this.scene, false);
	        core.mesh.position = new Vector3(10, Common_1.default.defaultY, 10);
	        this.enemyUnits.push(core);
	        var core2 = new Core_1.default(this.scene, false);
	        core2.mesh.position = new Vector3(11, Common_1.default.defaultY, 11);
	        this.enemyUnits.push(core2);
	    };
	    return Game;
	})();
	//start up the game
	new Game();


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Common_1 = __webpack_require__(3);
	var Laser_1 = __webpack_require__(4);
	/**
	 *
	 * Controllable unit
	 */
	//todo team colours, friendlies
	var Core = (function () {
	    /**
	     *
	     * @param scene
	     * @param isOwn
	     * @param isSelected
	     */
	    function Core(scene, isOwn, isSelected) {
	        if (isSelected === void 0) { isSelected = false; }
	        this.isSelected = false; //selected units can receive new commands
	        this.hitPoints = 10;
	        this.baseSpeed = Common_1.default.MEDIUM_SPEED;
	        this.weapon = new Laser_1.default();
	        this.mass = 1;
	        this.mesh = BABYLON.Mesh.CreateSphere("sphere1", 8, Common_1.default.MEDIUM_UNIT_SIZE, scene);
	        // this.mesh.parentClass = this;
	        this.isSelected; //selected units receive commands
	        this.modifiers = []; //powerups,shields etc
	        this.isOwn = isOwn;
	        this.material = new BABYLON.StandardMaterial("green", scene);
	        if (isOwn) {
	            this.material.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.8);
	            this.material.specularColor = new BABYLON.Color3(0.4, 0.4, 0.8);
	        }
	        else {
	            this.material.diffuseColor = new BABYLON.Color3(0.8, 0.4, 0.4);
	            this.material.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
	        }
	        // this.material.emissiveColor = BABYLON.Color3.Green();
	        this.mesh.material = this.material;
	        this.mesh.actionManager = new BABYLON.ActionManager(scene);
	        //show bounding box for selected elements
	        this.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, this.select.bind(this)));
	        //show user where mouse is hovering over
	        this.mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, this.mesh.material, "diffuseColor", BABYLON.Color3.White()));
	        this.mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, this.mesh.material, "diffuseColor", this.material.diffuseColor));
	    }
	    Core.prototype.select = function (e) {
	        this.isSelected = true;
	        e.meshUnderPointer.showBoundingBox = true;
	    };
	    Core.prototype.deselect = function () {
	        this.isSelected = false;
	        this.mesh.showBoundingBox = false;
	    };
	    Core.prototype.currentSpeed = function () {
	        //todo speed modifiers
	        return this.baseSpeed;
	    };
	    Core.prototype.takeDamage = function (damage) {
	        this.hitPoints -= damage;
	        if (this.hitPoints < 1) {
	            this.explode();
	        }
	    };
	    /**
	     * Removes mesh
	     * //todo expode graphics + hitpoints
	     */
	    Core.prototype.explode = function () {
	        this.mesh.dispose();
	    };
	    return Core;
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Core;


/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * Stuff that's shared among a lot of things in this game
	 */
	var Common = (function () {
	    function Common() {
	    }
	    Common.defaultY = 1; // presently all the objects are on the same horizontal plane
	    Common.MEDIUM_UNIT_SIZE = 1;
	    Common.MEDIUM_SIZE_MAP = 80;
	    Common.MEDIUM_SIZE_MAP_SUBDIVISIONS = 40;
	    Common.MEDIUM_SPEED = 3;
	    Common.ANIMATIONS_FPS = 30; //this is distance units per second
	    return Common;
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Common;
	exports.KEYS = {
	    BACKSPACE: 8,
	    TAB: 9,
	    RETURN: 13,
	    ESC: 27,
	    SPACE: 32,
	    LEFT: 37,
	    UP: 38,
	    RIGHT: 39,
	    DOWN: 40,
	    DELETE: 46,
	    HOME: 36,
	    END: 35,
	    PAGEUP: 33,
	    PAGEDOWN: 34,
	    INSERT: 45,
	    ZERO: 48,
	    ONE: 49,
	    TWO: 50,
	    A: 65,
	    L: 76,
	    P: 80,
	    Q: 81,
	    TILDA: 192
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var WeaponModifier_1 = __webpack_require__(5);
	var Formations_1 = __webpack_require__(6);
	var Common_1 = __webpack_require__(3);
	/**
	 * Fires a laser from one game object to another
	 *
	 * For simplicity it fires and renders instantly(speed of light) and remains 1 second afterglow
	 *
	 * //todo add range dependant laser damage for lasers that diffuse through area like this one
	 */
	var Laser = (function () {
	    function Laser() {
	        this.initialDamage = 5;
	        this.weaponModifier = new WeaponModifier_1.default();
	    }
	    /**
	     * Fires laser from one unit to another
	     * @param from
	     * @param to
	     */
	    Laser.prototype.fire = function (from, to, scene) {
	        //todo apply damage to target
	        to.takeDamage(this.initialDamage);
	        var distance = Formations_1.default.Distance2D(from.mesh.position, to.mesh.position);
	        var mesh = BABYLON.Mesh.CreateCylinder("cylinder", distance, 0.02, 0.2, 36, 2, scene, true);
	        mesh.setPivotMatrix(BABYLON.Matrix.Translation(0, -distance / 2, 0));
	        mesh.position = from.mesh.position;
	        var v1 = from.mesh.position.subtract(to.mesh.position);
	        v1.normalize();
	        var v2 = new BABYLON.Vector3(0, 1, 0);
	        // Using cross we will have a vector perpendicular to both vectors
	        var axis = BABYLON.Vector3.Cross(v1, v2);
	        axis.normalize();
	        console.log(axis);
	        // Angle between vectors
	        var angle = BABYLON.Vector3.Dot(v1, v2);
	        console.log(angle);
	        // Then using axis rotation the result is obvious
	        mesh.rotationQuaternion = BABYLON.Quaternion.RotationAxis(axis, -Math.PI / 2 + angle);
	        var material = new BABYLON.StandardMaterial("green", scene);
	        material.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.8);
	        material.specularColor = new BABYLON.Color3(0.4, 0.4, 0.8);
	        material.emissiveColor = BABYLON.Color3.Green();
	        mesh.material = material;
	        var animationFadeOut = new BABYLON.Animation("animationCore", "position", Common_1.default.ANIMATIONS_FPS, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
	        /*    var keys = [];
	            keys.push({frame: 0, value: 1});
	        
	            keys.push({
	              frame: Common.ANIMATIONS_FPS * 2, //fade lasting n seconds
	              value: 0
	            });*/
	        // animationFadeOut.setKeys(keys);
	        //  scene.beginAnimation(material.alpha, 0, Common.ANIMATIONS_FPS * 21,true,1, ()=> mesh.dispose());
	        return;
	    };
	    return Laser;
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Laser;


/***/ },
/* 5 */
/***/ function(module, exports) {

	/**
	 * Modifies the stats of a weapon
	 */
	var WeaponModifier = (function () {
	    function WeaponModifier() {
	        this.DamageAddition = 0;
	        this.DamageMultiplier = 1;
	    }
	    return WeaponModifier;
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = WeaponModifier;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Common_1 = __webpack_require__(3);
	var Vector3 = BABYLON.Vector3;
	var Formations = (function () {
	    function Formations() {
	    }
	    /**
	     * returns array of vector3 on the edge of a circle equally spaced around a given point
	  
	     * @param amount
	     * @param center
	     * @param spacing
	     * @returns {Array<Vector3>}
	     */
	    Formations.circularGrouping = function (amount, center, spacing) {
	        if (spacing === void 0) { spacing = 1; }
	        if (amount < 1) {
	        }
	        var arr = [];
	        if (amount === 1) {
	            arr.push(center);
	            return arr;
	        }
	        for (var i = 0; i < amount; i++) {
	            var angleDeg = i * (360 / amount);
	            var angleRad = (angleDeg / 360) * 2 * Math.PI;
	            var customVector = new BABYLON.Vector3(-Math.cos(angleRad) * spacing, Common_1.default.defaultY * spacing, -Math.sin(angleRad) * spacing);
	            arr.push(center.add(customVector));
	        }
	        return arr;
	    };
	    /**
	     * Gets centroid (center of mass) of units
	     * @param units
	     * @returns {BABYLON.Vector3}
	       */
	    Formations.getCentroid = function (units) {
	        var totalMass = 0;
	        var totalX = 0;
	        var totalZ = 0;
	        units.forEach(function (unit) {
	            totalMass += unit.mass;
	            totalX += unit.mesh.position.x * unit.mass;
	            totalZ += unit.mesh.position.z * unit.mass;
	        });
	        return new Vector3(totalX / totalMass, Common_1.default.defaultY, totalZ / totalMass);
	    };
	    Formations.Distance2D = function (from, to) {
	        return Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.z - to.z, 2));
	    };
	    return Formations;
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Formations;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Common_1 = __webpack_require__(3);
	/**
	 *
	 * The ground (actually a grid in space) that the game sits upon
	 */
	var Ground = (function () {
	    function Ground(scene) {
	        //Creation of a plane with a texture
	        this.mesh = BABYLON.Mesh.CreatePlane("ground", Common_1.default.MEDIUM_SIZE_MAP, scene);
	        var matGround = new BABYLON.StandardMaterial("matGround", scene);
	        matGround.diffuseTexture = new BABYLON.Texture("lib/assets/img/background.png", scene);
	        matGround.diffuseTexture.uScale = Common_1.default.MEDIUM_SIZE_MAP_SUBDIVISIONS;
	        matGround.diffuseTexture.vScale = Common_1.default.MEDIUM_SIZE_MAP_SUBDIVISIONS;
	        matGround.specularColor = new BABYLON.Color3(0, 0, 0);
	        this.mesh.material = matGround;
	        this.mesh.rotation.x = Math.PI / 2;
	        this.mesh.position = new BABYLON.Vector3(0, 0, 0);
	    }
	    return Ground;
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Ground;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Common_1 = __webpack_require__(3);
	/**
	 * CenterOfMassMarker
	 *
	 * Shows center of mass of all units
	 */
	//todo team colours, friendlies
	var CenterOfMassMarker = (function () {
	    /**
	     *
	     * @param scene
	     * @param isOwn
	     */
	    function CenterOfMassMarker(scene, isOwn) {
	        this.mesh = BABYLON.Mesh.CreateBox("sphere1", { width: Common_1.default.MEDIUM_UNIT_SIZE, height: Common_1.default.MEDIUM_UNIT_SIZE }, scene);
	        this.isOwn = isOwn;
	        var material = new BABYLON.StandardMaterial("green", scene);
	        if (isOwn) {
	            material.diffuseColor = new BABYLON.Color3(1, 1, 1);
	            material.specularColor = new BABYLON.Color3(1, 1, 1);
	        }
	        else {
	            material.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
	            material.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
	        }
	        material.emissiveColor = BABYLON.Color3.Green();
	        this.mesh.material = material;
	    }
	    return CenterOfMassMarker;
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = CenterOfMassMarker;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(10);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(12)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/stylus-loader/index.js!./main.styl", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/stylus-loader/index.js!./main.styl");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(11)();
	// imports
	
	
	// module
	exports.push([module.id, ".players {\n  position: absolute;\n  left: calc(50% - 152px);\n  bottom: 16px;\n  width: 304px;\n  height: 42px;\n  z-index: 4;\n}\n.players .player {\n  background-color: #44a9f1;\n  float: left;\n  width: 64px;\n  height: 42px;\n  margin-right: 16px;\n}\n#info {\n  background-color: rgba(30,30,30,0.3);\n  color: rgba(255,255,255,0.5);\n  position: absolute;\n  right: 20px;\n  bottom: 20px;\n  width: 200px;\n  height: 140px;\n  z-index: 4;\n  padding: 10px;\n}\n#info h1 {\n  font-size: 13px;\n  text-align: center;\n}\n#info h2 {\n  font-size: 11px;\n}\n#info p {\n  font-size: 8px;\n}\n.players {\n  position: absolute;\n  left: calc(50% - 152px);\n  bottom: 16px;\n  width: 304px;\n  height: 42px;\n  z-index: 4;\n}\n.players .player {\n  background-color: #44a9f1;\n  float: left;\n  width: 64px;\n  height: 42px;\n  margin-right: 16px;\n}\nbody,\nhtml {\n  background-color: #000;\n  color: #fff;\n  width: 100%;\n  height: 100%;\n  margin: 0;\n  padding: 0;\n  overflow: hidden;\n}\n#glcanvas {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n}\n#guide {\n  background-color: rgba(30,30,30,0.3);\n  color: rgba(255,255,255,0.5);\n  position: absolute;\n  top: 20px;\n  left: 20px;\n  width: 200px;\n  height: 140px;\n  z-index: 4;\n  padding: 10px;\n}\n#guide h1 {\n  font-size: 13px;\n  text-align: center;\n}\n#guide h2 {\n  font-size: 13px;\n}\n#guide p {\n  font-size: 10px;\n}\nbody,\nhtml {\n  background-color: #000;\n  color: #fff;\n  width: 100%;\n  height: 100%;\n  margin: 0;\n  padding: 0;\n  overflow: hidden;\n}\n#glcanvas {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n}\n#canvas2D {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  z-index: 1;\n}\n", ""]);
	
	// exports


/***/ },
/* 11 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);
//# sourceMappingURL=density-wars.js.map