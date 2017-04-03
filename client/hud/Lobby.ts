import RemotePlayer from '../RemotePlayer'

/**
 * Displays the Players info
 */
export default class Lobby {

  element: HTMLElement
  remoteUsers: Array<RemotePlayer> = []// other players in the game, start with just 1 for now for simplicity

  constructor () {
    this.element = document.getElementById('lobby')

    //stub
    this.remoteUsers.push(new RemotePlayer('Nikos'))
    this.remoteUsers.push(new RemotePlayer('Apo'))
    this.render()
  }

  /**
   * Renders the UI
   */
  render () {
    this.element.innerHTML =

      this.remoteUsers.map((player: RemotePlayer) => {
        return '<player>${player.name}</player>'
      }).join()
  }
}
