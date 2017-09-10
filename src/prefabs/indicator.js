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

    let width = Math.max(this.activeSprite.width, this.inactiveSprite.width)
    let height = Math.max(this.activeSprite.height, this.inactiveSprite.height)

    let backBMD = this.game.add.bitmapData(width, height)
    backBMD.dirty = true

    let backgroundSprite = this.game.add.sprite(x, y, backBMD)
    backgroundSprite.anchor.setTo(0, 0)

    this.width = width
    this.height = height
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
