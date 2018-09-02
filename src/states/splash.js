import Phaser from 'phaser'
import AnimationTexturePng from '../assets/textures/animation_textures.png'
import AnimationTexttureJson from '../assets/textures/animation_textures.json'

import BonusGameTexturePng from '../assets/textures/bonusgame_textures.png'
import BonusGameTextureJson from '../assets/textures/bonusgame_textures.json'

import GameAndUITexturePng from '../assets/textures/game_and_ui.png'
import GameAndUITextureJson from '../assets/textures/game_and_ui.json'

import RiskGameTexturePng from '../assets/textures/risk_game.png'
import RiskGameTextureJson from '../assets/textures/risk_game.json'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.stage.backgroundColor = '#000000'

    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')

    this.loaderBg.anchor.setTo(0.5, 0.5)
    this.loaderBar.anchor.setTo(0.5, 0.5)

    this.load.setPreloadSprite(this.loaderBar)

    this.load.atlasJSONHash('bonusgame_textures_atlas', BonusGameTexturePng, BonusGameTextureJson)
    this.load.atlasJSONHash('game_and_ui_atlas', GameAndUITexturePng, GameAndUITextureJson)
    this.load.atlasJSONHash('risk_game_atlas', RiskGameTexturePng, RiskGameTextureJson)
    this.load.atlasJSONHash('animation-textures-atlas', AnimationTexturePng, AnimationTexttureJson)

    this.game.load.script('BlurY', 'https://cdn.rawgit.com/photonstorm/phaser-ce/master/filters/BlurY.js')

    let text = this.add.text(this.world.centerX, this.world.centerY - 24, 'Loading Textures ...', {font: '16px Libre Franklin', fill: '#ffffff', align: 'center'})
    text.anchor.setTo(0.5, 0.5)
  }

  create () {
    this.state.start('Play')
  }
}
