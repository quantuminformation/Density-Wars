import { IGameUnit } from '../gameUnits/IGameUnit'
import { Order } from './Order'
export class Group {
  units: Array<IGameUnit>
  order: Order

  constructor (units: Array<IGameUnit>) {
    this.units = units
  }

}
