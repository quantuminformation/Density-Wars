
/**
 * Stuff that's shared among a lot of things in this game
 */
export default class Common{
  static defaultY:number = 1; // presently all the objects are on the same horizontal plane

  static MEDIUM_UNIT_SIZE:number = 1;

  static MEDIUM_SIZE_MAP:number = 80;

  static MEDIUM_SIZE_MAP_SUBDIVISIONS:number = 40;

  static MEDIUM_SPEED = 3;
  static ANIMATIONS_FPS = 30; //this is distance units per second
}

export var KEYS = {
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
}


export var MOUSE = {
  LEFT:1
}
