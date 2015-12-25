/// <reference path="../../babylonjs.d.ts" />

export interface IGameUnit {
  isSelected:boolean; //set on when a user clicks on it or draws a selction around it
  mesh: BABYLON.Mesh; //mesh that represents this game unit.
  click: (e:MouseEvent)=>void;
  hitPoints:number; // The default amount of damage this unit can take
  deselect: ()=>void
}
