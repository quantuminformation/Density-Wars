import {IGameUnit} from "./gameUnits/IGameUnit";

/**
 * Data for a competing player
 */
export default class RemotePlayer  {

  name:string;
  isUser:boolean; //if true player is current in control user
  units:Array<IGameUnit>;

}







