import {IGameUnit} from "./gameUnits/IGameUnit";


/**
 * This represents users (or game players) in the game. The current user playing has a user type and remote players also have
 * their own user instance.
 */
export default class User {
  units:Array<IGameUnit>;

  constructor() {

  }
}

