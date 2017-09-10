import Phaser from 'phaser'
import Reel from '../prefabs/reel'
import _ from 'lodash'

const reelCellCount = 50
const visibleCells = 3
const reelCount = 5

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    this.game.stage.backgroundColor = '#ffffff'

    this.game.add.sprite(0, 80, 'game_and_ui_atlas', 'screen.png')
    this.game.add.sprite(0, 80, 'game_and_ui_atlas', 'back.png')

    let logo = this.game.add.sprite(this.game.world.centerX, 0, 'game_and_ui_atlas', 'ui/logo_small.png')
    logo.anchor.setTo(0.5, 0)

    this.reels = []

    for (let i = 1; i <= reelCount; i++) {
      let reel = new Reel(this.game, 105 + (i * 152), 190, reelCellCount, visibleCells, 'reel' + i)
      this.game.add.existing(reel)
      this.reels.push(reel)
    }

    this.game.add.button(1100, 640, 'game_and_ui_atlas', () => { this.spin() }, this, 'ui/start_btn.png', 'ui/start_btn.png', 'ui/start_active_btn.png', 'ui/start_btn.png')

    this.playlines = []
    let playline = this.game.add.sprite(148, 210, 'game_and_ui_atlas', 'ui/winlines/1.png')
    // playline.visible = false
    this.playlines.push(playline)

    playline = this.game.add.sprite(148, 260, 'game_and_ui_atlas', 'ui/winlines/2.png')
    // playline.visible = false
    this.playlines.push(playline)

    playline = this.game.add.sprite(148, 310, 'game_and_ui_atlas', 'ui/winlines/3.png')
    // playline.visible = false
    this.playlines.push(playline)

    playline = this.game.add.sprite(148, 245, 'game_and_ui_atlas', 'ui/winlines/4.png')
    // playline.visible = false
    this.playlines.push(playline)

    playline = this.game.add.sprite(148, 415, 'game_and_ui_atlas', 'ui/winlines/5.png')
    // playline.visible = false
    this.playlines.push(playline)

    playline = this.game.add.sprite(148, 465, 'game_and_ui_atlas', 'ui/winlines/6.png')
    // playline.visible = false
    this.playlines.push(playline)

    playline = this.game.add.sprite(148, 230, 'game_and_ui_atlas', 'ui/winlines/7.png')
    // playline.visible = false
    this.playlines.push(playline)

    playline = this.game.add.sprite(148, 405, 'game_and_ui_atlas', 'ui/winlines/8.png')
    // playline.visible = false
    this.playlines.push(playline)

    playline = this.game.add.sprite(148, 620, 'game_and_ui_atlas', 'ui/winlines/9.png')
    // playline.visible = false
    this.playlines.push(playline)

    this.game.add.sprite(110, 190, 'game_and_ui_atlas', 'ui/1_inactive.png')
    this.game.add.sprite(1080, 190, 'game_and_ui_atlas', 'ui/1_inactive.png')

    this.game.add.sprite(110, 240, 'game_and_ui_atlas', 'ui/2_inactive.png')
    this.game.add.sprite(1080, 240, 'game_and_ui_atlas', 'ui/2_inactive.png')

    this.game.add.sprite(110, 290, 'game_and_ui_atlas', 'ui/3_inactive.png')
    this.game.add.sprite(1080, 290, 'game_and_ui_atlas', 'ui/3_inactive.png')

    this.game.add.sprite(110, 345, 'game_and_ui_atlas', 'ui/4_inactive.png')
    this.game.add.sprite(1080, 345, 'game_and_ui_atlas', 'ui/4_inactive.png')

    this.game.add.sprite(110, 395, 'game_and_ui_atlas', 'ui/5_inactive.png')
    this.game.add.sprite(1080, 395, 'game_and_ui_atlas', 'ui/5_inactive.png')

    this.game.add.sprite(110, 445, 'game_and_ui_atlas', 'ui/6_inactive.png')
    this.game.add.sprite(1080, 445, 'game_and_ui_atlas', 'ui/6_inactive.png')

    this.game.add.sprite(110, 500, 'game_and_ui_atlas', 'ui/7_inactive.png')
    this.game.add.sprite(1080, 500, 'game_and_ui_atlas', 'ui/7_inactive.png')

    this.game.add.sprite(110, 550, 'game_and_ui_atlas', 'ui/8_inactive.png')
    this.game.add.sprite(1080, 550, 'game_and_ui_atlas', 'ui/8_inactive.png')

    this.game.add.sprite(110, 600, 'game_and_ui_atlas', 'ui/9_inactive.png')
    this.game.add.sprite(1080, 600, 'game_and_ui_atlas', 'ui/9_inactive.png')
  }

  spin () {
    for (let i = 0; i < reelCount; i++) {
      this.reels[i].start()
    }

    this.spinning = true
  }

  update () {
    if (this.spinning) {
      let reelsReady = _.map(this.reels, (r) => { return r.readyForScore ? 1 : 0 }).reduce((m, n) => { return m + n }, 0)
      if (reelsReady === reelCount) {
        this.spinning = false

        console.log('check scores here')

        for (let i = 0; i < this.reels.length; i++) {
          console.log('key: ', this.reels[i].key)
          console.log('cells: ', this.reels[i].getDisplayedCells())
        }
      }
    }
  }
}
