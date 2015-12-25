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
	var Formations_ts_1 = __webpack_require__(4);
	var Common_1 = __webpack_require__(3);
	var Ground_1 = __webpack_require__(5);
	__webpack_require__(6);
	//todo I can't figure out a way to import with webpack so I load in index.html
	//import BABYLON from 'babylonjs'
	var Game = (function () {
	    function Game() {
	        var self = this;
	        this.numCores = 6;
	        // Load BABYLON 3D engine
	        this.canvas = document.getElementById("glcanvas");
	        this.engine = new BABYLON.Engine(this.canvas, true);
	        this.scene = new BABYLON.Scene(this.engine);
	        this.initScene();
	        this.cores = this.createInitialPlayerUnits();
	        Formations_ts_1.default.postionCircular(this.cores);
	        this.engine.runRenderLoop(function () {
	            self.scene.render();
	        });
	        window.addEventListener("resize", function () {
	            //todo some logic
	            self.engine.resize();
	        });
	        this.canvas.addEventListener("pointerdown", this.onPointerDown, false);
	        //this.canvas.addEventListener("pointerup", onPointerUp, false);
	        //this.canvas.addEventListener("pointermove", onPointerMove, false);
	        this.scene.onDispose = function () {
	            this.canvas.removeEventListener("pointerdown", this.onPointerDown);
	            // this.canvas.removeEventListener("pointerup", onPointerUp);
	            //   this.canvas.removeEventListener("pointermove", onPointerMove);
	        };
	    }
	    Game.prototype.onPointerDown = function (evt) {
	        if (evt.button !== 0) {
	            return;
	        }
	        // check if we are under a mesh
	        /*  var pickInfo = thisscene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh !== ground; });
	         if (pickInfo.hit) {
	         currentMesh = pickInfo.pickedMesh;
	         startingPoint = getGroundPosition(evt);
	    
	         if (startingPoint) { // we need to disconnect camera from canvas
	         setTimeout(function () {
	         camera.detachControl(canvas);
	         }, 0);
	         }
	         }*/
	    };
	    Game.prototype.initScene = function () {
	        // This creates and positions a free camera (non-mesh)
	        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene);
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
	    };
	    Game.prototype.createInitialPlayerUnits = function () {
	        //var cores = Array<IGameUnit>;
	        var cores = [];
	        for (var i = 0; i < this.numCores; i++) {
	            var core = new Core_1.default(this.scene);
	            core.mesh.position.y = Common_1.default.defaultY;
	            cores.push(core);
	        }
	        return cores;
	    };
	    //todo from mouse/keyboard
	    Game.prototype.addCommand = function () {
	        "use strict";
	        var selectedUnits = this.cores.filter(function (unit) {
	            return unit.isSelected;
	        });
	        //todo investigate queued commands
	    };
	    return Game;
	})();
	//start up the game
	new Game();


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Common_1 = __webpack_require__(3);
	/**
	 *
	 * User controllable unit
	 */
	//todo I don't like this
	var self;
	var Core = (function () {
	    function Core(scene, isSelected) {
	        if (isSelected === void 0) { isSelected = false; }
	        this.isSelected = false; //selected units can receive new commands
	        this.hitPoints = 10;
	        self = this; //for use ExecuteCodeAction callbacks
	        this.mesh = BABYLON.Mesh.CreateSphere("sphere1", 8, Common_1.default.MEDIUM_UNIT_SIZE, scene);
	        this.isSelected; //selected units receive commands
	        this.modifiers = []; //powerups,shields etc
	        this.material = new BABYLON.StandardMaterial("green", scene);
	        this.material.diffuseColor = new BABYLON.Color3(0.8, 0.4, 0.4);
	        this.material.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
	        // this.material.emissiveColor = BABYLON.Color3.Green();
	        this.mesh.material = this.material;
	        this.mesh.actionManager = new BABYLON.ActionManager(scene);
	        //show bounding box for selected elements
	        this.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, this.select));
	        //show user where mouse is hovering over
	        this.mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, this.mesh.material, "diffuseColor", BABYLON.Color3.White()));
	        this.mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, this.mesh.material, "diffuseColor", this.material.diffuseColor));
	    }
	    Core.prototype.select = function (e) {
	        self.isSelected = true;
	        e.meshUnderPointer.showBoundingBox = true;
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
	    Common.MEDIUM_SIZE_MAP = 40;
	    Common.MEDIUM_SIZE_MAP_SUBDIVISIONS = 10;
	    return Common;
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Common;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Common_1 = __webpack_require__(3);
	var Formations = (function () {
	    function Formations() {
	    }
	    /**
	     * positions an array of GameUnit's on the edge of a circle equally spaced
	     * @param gameUnits
	     */
	    Formations.postionCircular = function (gameUnits) {
	        "use strict";
	        for (var i = 0; i < gameUnits.length; i++) {
	            var angleDeg = i * (360 / gameUnits.length);
	            var angleRad = (angleDeg / 360) * 2 * Math.PI;
	            var customVector = new BABYLON.Vector3(-Math.cos(angleRad), Common_1.default.defaultY, -Math.sin(angleRad));
	            gameUnits[i].mesh.position = customVector;
	        }
	    };
	    return Formations;
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Formations;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Common_1 = __webpack_require__(3);
	/**
	 *
	 * The ground (actually a grid in space) that the game sits upon
	 */
	var Ground = (function () {
	    function Ground(scene) {
	        //Creation of a material with wireFrame
	        this.defaultMaterial = new BABYLON.StandardMaterial("wireframe", scene);
	        this.defaultMaterial.wireframe = true;
	        this.mesh = BABYLON.Mesh.CreateGround("ground1", Common_1.default.MEDIUM_SIZE_MAP, Common_1.default.MEDIUM_SIZE_MAP, Common_1.default.MEDIUM_SIZE_MAP_SUBDIVISIONS, scene);
	        this.defaultMaterial = new BABYLON.StandardMaterial("wireframe", scene);
	        this.defaultMaterial.wireframe = true;
	        this.mesh.material = this.defaultMaterial;
	    }
	    return Ground;
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Ground;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(7);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(9)(content, {});
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(8)();
	// imports
	
	
	// module
	exports.push([module.id, ".players {\n  position: absolute;\n  left: calc(50% - 152px);\n  bottom: 16px;\n  width: 304px;\n  height: 42px;\n  z-index: 4;\n}\n.players .player {\n  background-color: #44a9f1;\n  float: left;\n  width: 64px;\n  height: 42px;\n  margin-right: 16px;\n}\n#info {\n  background-color: rgba(30,30,30,0.3);\n  color: rgba(255,255,255,0.5);\n  position: absolute;\n  right: 20px;\n  bottom: 20px;\n  width: 200px;\n  height: 140px;\n  z-index: 4;\n  padding: 10px;\n}\n#info h1 {\n  font-size: 13px;\n  text-align: center;\n}\n#info h2 {\n  font-size: 11px;\n}\n#info p {\n  font-size: 8px;\n}\n.players {\n  position: absolute;\n  left: calc(50% - 152px);\n  bottom: 16px;\n  width: 304px;\n  height: 42px;\n  z-index: 4;\n}\n.players .player {\n  background-color: #44a9f1;\n  float: left;\n  width: 64px;\n  height: 42px;\n  margin-right: 16px;\n}\nbody,\nhtml {\n  background-color: #000;\n  color: #fff;\n  width: 100%;\n  height: 100%;\n  margin: 0;\n  padding: 0;\n  overflow: hidden;\n}\n#glcanvas {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n}\nbody,\nhtml {\n  background-color: #000;\n  color: #fff;\n  width: 100%;\n  height: 100%;\n  margin: 0;\n  padding: 0;\n  overflow: hidden;\n}\n#glcanvas {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n}\n", ""]);
	
	// exports


/***/ },
/* 8 */
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
/* 9 */
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