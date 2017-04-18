import { IWeapon } from '../weapons/IWeapon'
export interface IGameUnit {
  isSelected: boolean // set on when a user clicks on it or draws a selction around it
  mesh: BABYLON.Mesh // mesh that represents this game unit.
  click: (e: MouseEvent) => void
  hitPoints: number // The default amount of damage this unit can take
  deselect: () => void
  select: () => void
  mass: number
  weapon: IWeapon
  takeDamage: (amount) => void
  explode: () => void
  groupID
}
