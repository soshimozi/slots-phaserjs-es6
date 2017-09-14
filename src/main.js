import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/boot'
import SplashState from './states/splash'
import PlayState from './states/play'
import HelpState from './states/help'

import config from './config'

class Game extends Phaser.Game {
  preload () {
    phaser.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
  }
  constructor () {
    const docElement = document.getElementById('content')

    console.log('docElement: ', docElement.clientHeight)

    const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth
    const height = docElement.clientHeight === 0 ? config.gameHeight : docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight

    console.log('height: ', height, 'width: ', width)

    super(width, height, Phaser.WEBGL, 'content', null)

    this.state.add('Boot', BootState, false)
    this.state.add('Splash', SplashState, false)
    this.state.add('Play', PlayState, false)
    this.state.add('Help', HelpState, false)

    this.state.start('Boot')
  }
}

window.game = new Game()
