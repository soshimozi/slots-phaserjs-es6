import Phaser from 'phaser'
import Reel from '../prefabs/reel'
import _ from 'lodash'
import Indicator from '../prefabs/indicator'

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

    this.buildUI()
    this.selectedPaylines = 0

    this.paylineCounts = [1, 3, 5, 7, 9]
  }

  buildUI () {
    this.addActionButtons()
    this.addPaylines()
    this.addLineIndicators()
    this.addPaylineIcons()
  }

  addLineIndicators () {
    this.lineIndicators = []

    let leftIndicator = new Indicator(this.game, 110, 190, 'game_and_ui_atlas', 'ui/1_.png', 'ui/1_inactive.png')
    let rightIndicator = new Indicator(this.game, 1080, 190, 'game_and_ui_atlas', 'ui/1_.png', 'ui/1_inactive.png')
    this.game.add.existing(leftIndicator)
    this.game.add.existing(rightIndicator)
    this.lineIndicators.push({left: leftIndicator, right: rightIndicator})

    leftIndicator = new Indicator(this.game, 110, 240, 'game_and_ui_atlas', 'ui/2.png', 'ui/2_inactive.png')
    rightIndicator = new Indicator(this.game, 1080, 240, 'game_and_ui_atlas', 'ui/2.png', 'ui/2_inactive.png')
    this.game.add.existing(rightIndicator)
    this.game.add.existing(leftIndicator)
    this.lineIndicators.push({left: leftIndicator, right: rightIndicator})

    leftIndicator = new Indicator(this.game, 110, 290, 'game_and_ui_atlas', 'ui/3.png', 'ui/3_inactive.png')
    rightIndicator = new Indicator(this.game, 1080, 290, 'game_and_ui_atlas', 'ui/3.png', 'ui/3_inactive.png')
    this.game.add.existing(rightIndicator)
    this.game.add.existing(leftIndicator)
    this.lineIndicators.push({left: leftIndicator, right: rightIndicator})

    leftIndicator = new Indicator(this.game, 110, 345, 'game_and_ui_atlas', 'ui/4.png', 'ui/4_inactive.png')
    rightIndicator = new Indicator(this.game, 1080, 345, 'game_and_ui_atlas', 'ui/4.png', 'ui/4_inactive.png')
    this.game.add.existing(rightIndicator)
    this.game.add.existing(leftIndicator)
    this.lineIndicators.push({left: leftIndicator, right: rightIndicator})

    leftIndicator = new Indicator(this.game, 110, 395, 'game_and_ui_atlas', 'ui/5.png', 'ui/5_inactive.png')
    rightIndicator = new Indicator(this.game, 1080, 395, 'game_and_ui_atlas', 'ui/5.png', 'ui/5_inactive.png')
    this.game.add.existing(rightIndicator)
    this.game.add.existing(leftIndicator)
    this.lineIndicators.push({left: leftIndicator, right: rightIndicator})

    leftIndicator = new Indicator(this.game, 110, 445, 'game_and_ui_atlas', 'ui/6.png', 'ui/6_inactive.png')
    rightIndicator = new Indicator(this.game, 1080, 445, 'game_and_ui_atlas', 'ui/6.png', 'ui/6_inactive.png')
    this.game.add.existing(rightIndicator)
    this.game.add.existing(leftIndicator)
    this.lineIndicators.push({left: leftIndicator, right: rightIndicator})

    leftIndicator = new Indicator(this.game, 110, 500, 'game_and_ui_atlas', 'ui/7.png', 'ui/7_inactive.png')
    rightIndicator = new Indicator(this.game, 1080, 500, 'game_and_ui_atlas', 'ui/7.png', 'ui/7_inactive.png')
    this.game.add.existing(rightIndicator)
    this.game.add.existing(leftIndicator)
    this.lineIndicators.push({left: leftIndicator, right: rightIndicator})

    leftIndicator = new Indicator(this.game, 110, 550, 'game_and_ui_atlas', 'ui/8.png', 'ui/8_inactive.png')
    rightIndicator = new Indicator(this.game, 1080, 550, 'game_and_ui_atlas', 'ui/8.png', 'ui/8_inactive.png')
    this.game.add.existing(rightIndicator)
    this.game.add.existing(leftIndicator)
    this.lineIndicators.push({left: leftIndicator, right: rightIndicator})

    leftIndicator = new Indicator(this.game, 110, 600, 'game_and_ui_atlas', 'ui/4.png', 'ui/9_inactive.png')
    rightIndicator = new Indicator(this.game, 1080, 600, 'game_and_ui_atlas', 'ui/4.png', 'ui/9_inactive.png')
    this.game.add.existing(rightIndicator)
    this.game.add.existing(leftIndicator)
    this.lineIndicators.push({left: leftIndicator, right: rightIndicator})
  }

  addPaylines () {
    this.playlines = []
    let playline = this.game.add.sprite(148, 210, 'game_and_ui_atlas', 'ui/winlines/1.png')
    playline.visible = false
    this.playlines.push(playline)

    playline = this.game.add.sprite(148, 260, 'game_and_ui_atlas', 'ui/winlines/2.png')
    playline.visible = false
    this.playlines.push(playline)

    playline = this.game.add.sprite(148, 310, 'game_and_ui_atlas', 'ui/winlines/3.png')
    playline.visible = false
    this.playlines.push(playline)

    playline = this.game.add.sprite(148, 245, 'game_and_ui_atlas', 'ui/winlines/4.png')
    playline.visible = false
    this.playlines.push(playline)

    playline = this.game.add.sprite(148, 415, 'game_and_ui_atlas', 'ui/winlines/5.png')
    playline.visible = false
    this.playlines.push(playline)

    playline = this.game.add.sprite(148, 465, 'game_and_ui_atlas', 'ui/winlines/6.png')
    playline.visible = false
    this.playlines.push(playline)

    playline = this.game.add.sprite(148, 230, 'game_and_ui_atlas', 'ui/winlines/7.png')
    playline.visible = false
    this.playlines.push(playline)

    playline = this.game.add.sprite(148, 405, 'game_and_ui_atlas', 'ui/winlines/8.png')
    playline.visible = false
    this.playlines.push(playline)

    playline = this.game.add.sprite(148, 620, 'game_and_ui_atlas', 'ui/winlines/9.png')
    playline.visible = false
    this.playlines.push(playline)
  }

  addActionButtons () {
    this.game.add.button(1100, 640, 'game_and_ui_atlas', () => { this.spin() }, this, 'ui/start_btn.png', 'ui/start_btn.png', 'ui/start_active_btn.png', 'ui/start_btn.png')
    this.game.add.button(200, 720, 'game_and_ui_atlas', () => { this.incrementLines() }, this, 'ui/lines.png', 'ui/lines.png', 'ui/lines_active.png', 'ui/lines.png')
    this.game.add.button(420, 720, 'game_and_ui_atlas', () => { this.incrementBet() }, this, 'ui/betone.png', 'ui/betone.png', 'ui/betone_active.png', 'ui/betone.png')
    this.game.add.button(640, 720, 'game_and_ui_atlas', () => { this.betMax() }, this, 'ui/betmax.png', 'ui/betmax.png', 'ui/betmax_active.png', 'ui/betmax.png')
    this.game.add.button(860, 720, 'game_and_ui_atlas', () => { this.doubleDown() }, this, 'ui/double.png', 'ui/double.png', 'ui/double_active.png', 'ui/double.png')
  }

  doubleDown () {}
  incrementBet () {}
  betMax () {}

  addPaylineIcons () {
    this.paylineIcons = []

    // let paylineIcon = new Indicator(this.game, 0, 0, 'game_and_ui_atlas', 'ui/1_lines_active.png', 'ui/1_lines.png')
    // this.game.add.existing(paylineIcon)
    // this.paylineIcons.push(paylineIcon)

    // paylineIcon.setActive(true)

    // paylineIcon.inputEnabled = true
    // paylineIcon.events.onInputDown.add((what) => { console.log('you clicked me: ', what); what.isActive = !what.isActive })
    let inactiveGroup = this.game.add.group()
    let activeGroup = this.game.add.group()

    let inactivePaylineIcon = inactiveGroup.create(205, 680, 'game_and_ui_atlas', 'ui/1_lines.png')
    let activePaylineIcon = activeGroup.create(205, 670, 'game_and_ui_atlas', 'ui/1_lines_active.png')
    inactivePaylineIcon.visible = false

    this.paylineIcons.push({activeIcon: activePaylineIcon, inactiveIcon: inactivePaylineIcon})

    inactivePaylineIcon = inactiveGroup.create(245, 680, 'game_and_ui_atlas', 'ui/3_lines.png')
    activePaylineIcon = activeGroup.create(245, 670, 'game_and_ui_atlas', 'ui/3_lines_active.png')
    activePaylineIcon.visible = false

    this.paylineIcons.push({activeIcon: activePaylineIcon, inactiveIcon: inactivePaylineIcon})

    inactivePaylineIcon = inactiveGroup.create(285, 680, 'game_and_ui_atlas', 'ui/5_lines.png')
    activePaylineIcon = activeGroup.create(285, 670, 'game_and_ui_atlas', 'ui/5_lines_active.png')
    activePaylineIcon.visible = false

    this.paylineIcons.push({activeIcon: activePaylineIcon, inactiveIcon: inactivePaylineIcon})

    inactivePaylineIcon = inactiveGroup.create(325, 680, 'game_and_ui_atlas', 'ui/7_lines.png')
    activePaylineIcon = activeGroup.create(325, 670, 'game_and_ui_atlas', 'ui/7_lines_active.png')
    activePaylineIcon.visible = false

    this.paylineIcons.push({activeIcon: activePaylineIcon, inactiveIcon: inactivePaylineIcon})

    inactivePaylineIcon = inactiveGroup.create(365, 680, 'game_and_ui_atlas', 'ui/9_lines.png')
    activePaylineIcon = activeGroup.create(365, 670, 'game_and_ui_atlas', 'ui/9_lines_active.png')
    activePaylineIcon.visible = false

    this.paylineIcons.push({activeIcon: activePaylineIcon, inactiveIcon: inactivePaylineIcon})

  }

  incrementLines () {
    // turn off current indicator
    this.paylineIcons[this.selectedPaylines].inactiveIcon.visible = true
    this.paylineIcons[this.selectedPaylines].activeIcon.visible = false

    // turn on next indicator
    this.selectedPaylines = this.selectedPaylines + 1
    if (this.selectedPaylines >= this.paylineIcons.length) {
      this.selectedPaylines = 0
    }

    this.paylineIcons[this.selectedPaylines].inactiveIcon.visible = false
    this.paylineIcons[this.selectedPaylines].activeIcon.visible = true
    this.paylineIcons[this.selectedPaylines].activeIcon.zIndex = 100
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

        for (let i = 0; i < this.reels.length; i++) {
          console.log('key: ', this.reels[i].key)
          console.log('cells: ', this.reels[i].getDisplayedCells())
        }
      }
    }
  }

  checkPaylines () {

  }
}
