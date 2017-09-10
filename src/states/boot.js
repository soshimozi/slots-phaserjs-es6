import Phaser from 'phaser'
import WebFont from 'webfontloader'

import LoaderBg from '../assets/images/loader-bg.png'
import LoaderBar from '../assets/images/loader-bar.png'

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#000000'
    this.fontsReady = false
    this.fontsLoaded = this.fontsLoaded.bind(this)
  }

  preload () {
    WebFont.load({
      google: {
        families: ['Bangers', 'Libre Franklin']
      },
      active: this.fontsLoaded
    })

    let text = this.add.text(this.world.centerX, this.world.centerY, 'Loading fonts ...', {font: '16px Arial', fill: '#ffffff', align: 'center'})
    text.anchor.setTo(0.5, 0.5)

    this.load.image('loaderBg', LoaderBg)
    this.load.image('loaderBar', LoaderBar)
  }

  render () {
    if (this.fontsReady) {
      this.state.start('Splash')
    }
  }

  fontsLoaded () {
    this.fontsReady = true
  }
}
