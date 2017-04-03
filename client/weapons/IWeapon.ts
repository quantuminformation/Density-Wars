import { IGameUnit } from '../gameUnits/IGameUnit'
export interface IWeapon {
  initialDamage: number
  fire: (from: IGameUnit, to: IGameUnit, scene: BABYLON.Scene) => void
}
