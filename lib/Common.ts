/**
 * Stuff that's shared among a lot of things in this game
 */
export default class Common {
  static defaultY:number = 1; // presently all the objects are on the same horizontal plane

  static MEDIUM_UNIT_SIZE:number = 1;

  static MEDIUM_SIZE_MAP:number = 80;

  static MEDIUM_SIZE_MAP_SUBDIVISIONS:number = 40;

  static MEDIUM_SPEED = 3;
  static ANIMATIONS_FPS = 30; //this is distance units per second

  static MOUSE:MOUSE;
  static KEYS:KEYS;

}


class KEYS {
  BACKSPACE:number = 8;
  TAB:number = 9;
  RETURN:number = 13;
  ESC:number = 27;
  SPACE:number = 32;
  LEFT:number = 37;
  UP:number = 38;
  RIGHT:number = 39;
  DOWN:number = 40;
  DELETE:number = 46;
  HOME:number = 36;
  END:number = 35;
  PAGEUP:number = 33;
  PAGEDOWN:number = 34;
  INSERT:number = 45;
  ZERO:number = 48;
  ONE:number = 49;
  TWO:number = 50;
  A:number = 65;
  L:number = 76;
  P:number = 80;
  Q:number = 81;
  TILDA:number = 192
}


class MOUSE {
  LEFT:number = 1;
}
