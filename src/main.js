import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/boot'
import SplashState from './states/splash'
import PlayState from './states/play'

import config from './config'

class Game extends Phaser.Game {
  constructor () {
    const docElement = document.documentElement
    const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth
    const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight
    super(width, height, Phaser.WEBGL, 'content', null)

    this.state.add('Boot', BootState, false)
    this.state.add('Splash', SplashState, false)
    this.state.add('Play', PlayState, false)

    this.state.start('Boot')
  }
}

window.game = new Game()
