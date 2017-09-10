/**
 * Created by Monkey on 9/10/2017.
 */
import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor (game, x, y, key, active, inactive, isActive) {
    super(game)

    this.activeSprite = game.add.sprite(x, y, key, active)
    this.inactiveSprite = game.add.sprite(x, y, key, inactive)

    this.isActive = isActive
  }

  setActive (val) {
    this.isActive = val
  }

  update () {
    if (this.isActive) {
      this.inactiveSprite.visible = false
      this.activeSprite.visible = true
    } else {
      this.inactiveSprite.visible = true
      this.activeSprite.visible = false
    }
  }
}
