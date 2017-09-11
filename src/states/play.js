import Phaser from 'phaser'
import Reel from '../prefabs/reel'
import _ from 'lodash'
import Indicator from '../prefabs/indicator'

const reelCellCount = 350
const visibleCells = 3
const reelCount = 5

export default class extends Phaser.State {
  init () {
    this.game.stage.disableVisibilityChange = true
  }

  preload () {}

  create () {
    this.game.stage.backgroundColor = '#462209'

    this.game.add.sprite(0, 80, 'game_and_ui_atlas', 'screen.png')
    this.game.add.sprite(0, 80, 'game_and_ui_atlas', 'back.png')

    let logo = this.game.add.sprite(this.game.world.centerX, 0, 'game_and_ui_atlas', 'ui/logo_small.png')
    logo.anchor.setTo(0.5, 0)

    this.reels = []
    let randomWeights = {1: 0.5, 2: 1.0, 3: 0.083, 4: 0.5, 5: 0.67, 6: 1.0, 7: 0.67, 8: 0.083}
    // let weights = [2, 6, 7, 5, 4, 1, 3, 8]
    for (let i = 1; i <= reelCount; i++) {
      let reel = new Reel(this.game, 88 + (i * 160), 190, reelCellCount, visibleCells, randomWeights, 'reel' + i)
      this.game.add.existing(reel)
      this.reels.push(reel)
    }

    // create 5 frame sprites
    this.winFrames = []
    for (let frameIndex = 0; frameIndex < 5; frameIndex++) {
      let sprite = this.game.add.sprite(0, 0, 'game_and_ui_atlas', 'frame.png')
      sprite.visible = false

      this.winFrames.push(sprite)
    }

    this.frameColumnOffsets = [234, 394, 554, 714, 874]
    this.frameRowOffsets = [174, 326, 480]

    this.selectedPaylinesIndex = 0

    this.ticketCount = 100000
    this.paylineCounts = [1, 3, 5, 7, 9]
    this.paylineCheckPatterns = [ [0, 0, 0, 0, 0], [0, 0, 1, 0, 0], [0, 1, 2, 1, 0], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1], [1, 2, 2, 2, 1], [2, 1, 0, 1, 2], [2, 2, 1, 2, 2], [2, 2, 2, 2, 2] ]

    this.buildUI()

    this.game.add.sprite(5, 220, 'game_and_ui_atlas', 'ui/tickets_per_line.png')

    this.currentBetAmount = 1
    this.ticketsPerLineText = this.game.add.text(65, 270, '', {font: '32px Bangers', fill: '#ffffff', align: 'center'})
    this.ticketsPerLineText.anchor.setTo(0.5, 0)

    this.ticketsPerLineText.text = this.currentBetAmount.toString()
    this.maxBet = 15

    this.game.add.text(635, 775, 'NUMBER OF TICKETS', {font: '16px Libre Franklin', fill: '#ffffff', align: 'center', fontWeight: 'bold'}).anchor.setTo(0.5, 0)

    this.addInfoBar(535, 800)
    this.ticketCountText = this.game.add.text(635, 795, '', {font: '24px Bangers', fill: '#ffffff', align: 'center'})
    this.ticketCountText.text = this.ticketCount.toString()
    this.ticketCountText.anchor.setTo(0.5, 0)

    this.autoSpin = false
    this.readyToSpin = true
  }

  addInfoBar (x, y) {
    let barGroup = this.game.add.group()
    barGroup.x = x
    barGroup.y = y

    barGroup.create(0, 0, 'game_and_ui_atlas', 'ui/b1.png')
    barGroup.create(20, 0, 'game_and_ui_atlas', 'ui/b2.png')
    let end = barGroup.create(200, 0, 'game_and_ui_atlas', 'ui/b1.png')
    end.scale.x *= -1

    return barGroup
  }

  buildUI () {
    this.addPaylines()
    this.addLineIndicators()
    this.game.add.sprite(1020, 350, 'game_and_ui_atlas', 'pers_static.png')
    this.addActionButtons()
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

    leftIndicator = new Indicator(this.game, 110, 600, 'game_and_ui_atlas', 'ui/9.png', 'ui/9_inactive.png')
    rightIndicator = new Indicator(this.game, 1080, 600, 'game_and_ui_atlas', 'ui/9.png', 'ui/9_inactive.png')
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
    this.game.add.button(1100, 760, 'game_and_ui_atlas', () => { if (this.readyToSpin) this.spin() }, this, 'ui/start_btn.png', 'ui/start_btn.png', 'ui/start_active_btn.png', 'ui/start_btn.png')
    this.game.add.button(200, 840, 'game_and_ui_atlas', () => { this.incrementLines() }, this, 'ui/lines.png', 'ui/lines.png', 'ui/lines_active.png', 'ui/lines.png')
    this.game.add.button(420, 840, 'game_and_ui_atlas', () => { this.incrementBet() }, this, 'ui/betone.png', 'ui/betone.png', 'ui/betone_active.png', 'ui/betone.png')
    this.game.add.button(640, 840, 'game_and_ui_atlas', () => { this.betMax() }, this, 'ui/betmax.png', 'ui/betmax.png', 'ui/betmax_active.png', 'ui/betmax.png')
    this.game.add.button(860, 840, 'game_and_ui_atlas', () => { this.doubleDown() }, this, 'ui/double.png', 'ui/double.png', 'ui/double_active.png', 'ui/double.png')
    this.game.add.button(-40, 760, 'game_and_ui_atlas', () => { this.autoSpin = !this.autoSpin; if (this.autoSpin && this.readyToSpin) this.spin() }, this, 'ui/auto_spin.png', 'ui/auto_spin.png', 'ui/auto_spin_active.png', 'ui/auto_spin.png')
  }

  doubleDown () {
    this.isDoubleDown = true

    // show double down icon
  }
  incrementBet () {
    this.currentBetAmount = this.currentBetAmount + 1
    if (this.currentBetAmount > this.maxBet) {
      this.currentBetAmount = this.maxBet
    }

    this.ticketsPerLineText.text = this.currentBetAmount.toString()
  }
  betMax () {
    this.currentBetAmount = this.maxBet
    this.ticketsPerLineText.text = this.currentBetAmount.toString()
  }

  addPaylineIcons () {
    this.paylineIcons = []

    let inactiveGroup = this.game.add.group()
    let activeGroup = this.game.add.group()

    for (let i = 0; i < 5; i++) {
      let count = this.paylineCounts[i]

      let inactivePaylineIcon = inactiveGroup.create(205 + (40 * i), 800, 'game_and_ui_atlas', 'ui/' + count + '_lines.png')
      let activePaylineIcon = activeGroup.create(205 + (40 * i), 790, 'game_and_ui_atlas', 'ui/' + count + '_lines_active.png')
      activePaylineIcon.visible = false

      this.paylineIcons.push({activeIcon: activePaylineIcon, inactiveIcon: inactivePaylineIcon})
    }

    this.paylineIcons[0].inactiveIcon.visible = false
    this.paylineIcons[0].activeIcon.visible = true
  }

  incrementLines () {
    // turn off current indicator
    this.paylineIcons[this.selectedPaylinesIndex].inactiveIcon.visible = true
    this.paylineIcons[this.selectedPaylinesIndex].activeIcon.visible = false

    // turn on next indicator
    this.selectedPaylinesIndex = this.selectedPaylinesIndex + 1
    if (this.selectedPaylinesIndex >= this.paylineIcons.length) {
      this.selectedPaylinesIndex = 0
    }

    this.paylineIcons[this.selectedPaylinesIndex].inactiveIcon.visible = false
    this.paylineIcons[this.selectedPaylinesIndex].activeIcon.visible = true
    // this.paylineIcons[this.selectedPaylinesIndex].activeIcon.zIndex = 100
  }

  spin () {
    for (let i = 0; i < reelCount; i++) {
      this.reels[i].start()
    }

    this.spinning = true

    this.currentBet = {
      amount: this.paylineCounts[this.selectedPaylinesIndex] * this.currentBetAmount,
      double: this.isDoubleDown,
      payLinesIndex: this.selectedPaylinesIndex
    }

    this.ticketCount -= this.currentBet.amount
    this.ticketCountText.text = this.ticketCount.toString()

    for (let lineIndex = 0; lineIndex < this.lineIndicators.length; lineIndex++) {
      this.lineIndicators[lineIndex].left.setActive(false)
      this.lineIndicators[lineIndex].right.setActive(false)

      this.playlines[lineIndex].visible = false
    }

    this.showResults = false
    this.readyToSpin = false
    this.hideFrames()
  }

  update () {
    if (this.spinning) {
      let reelsReady = _.map(this.reels, (r) => { return r.readyForScore ? 1 : 0 }).reduce((m, n) => { return m + n }, 0)
      if (reelsReady === reelCount) {
        // this.spinning = false

        this.spinning = false
        this.showResults = true

        this.currentPayline = 0
        this.lastUpdate = 0

        // there is always one payline so check that first
        let matchCount = this.checkPayLine(this.paylineCheckPatterns[this.currentPayline])

        if (matchCount > 0) {
          this.showWinResults(matchCount, this.paylineCheckPatterns[this.currentPayline])
          this.lastUpdate = this.game.time.now

          console.log('gametime: ', this.game.time)
          console.log('lastUpdate: ', this.lastUpdate)
        }

        // this.checkPaylines()
      }
    } else if (this.showResults) {
      // if only one match just ignore the update
      let winLines = 0
      for (let i = 0; i < this.paylineCounts[this.currentBet.payLinesIndex]; i++) {
        let matchCount = this.checkPayLine(this.paylineCheckPatterns[i])
        if (matchCount > 0) {
          winLines += 1
        }
      }

      if (this.game.time.now - this.lastUpdate > 3000) {
        if (winLines > 1) {
          this.hideFrames()
          // this.lineIndicators[this.currentPayline].left.setActive(false)
          // this.lineIndicators[this.currentPayline].right.setActive(false)
          //
          // this.playlines[this.currentPayline].visible = false
          //
          this.displayPayLine(this.currentPayline, false)
        }

        this.currentPayline += 1

        if (this.currentPayline >= this.paylineCounts[this.currentBet.payLinesIndex]) {
          this.currentPayline = 0

          // we have cycled through once, so ready to spin now
          this.readyToSpin = true
        }

        let matchCount = this.checkPayLine(this.paylineCheckPatterns[this.currentPayline])

        // if we have matches show the display for 3 seconds
        // otherwise we will update immediately
        if (matchCount > 0) {
          this.showWinResults(matchCount, this.paylineCheckPatterns[this.currentPayline])

          this.lastUpdate = this.game.time.now
        }
      }
    }
  }

  hideFrames () {
    for (let i = 0; i < 5; i++) {
      this.winFrames[i].visible = false
    }
  }

  showWinResults (matchCount, indexes) {
    this.displayPayLine(this.currentPayline, true)

    // show match count frames (based on the indexes)
    // this.frameColumnOffsets = [234, 394, 554, 714, 874]
    // this.frameRowOffsets = [174, 326, 480]
    // this.winFrames

    for (let i = 0; i < (matchCount + 1); i++) {
      this.winFrames[i].visible = true
      this.winFrames[i].x = this.frameColumnOffsets[i]
      this.winFrames[i].y = this.frameRowOffsets[indexes[i]]
    }
  }

  displayPayLine (index, state) {
    // also activate payline
    this.lineIndicators[index].left.setActive(state)
    this.lineIndicators[index].right.setActive(state)
    this.playlines[index].visible = state
  }

  checkPayLine (indexes) {
    let displayCells = []
    for (let reelIndex = 0; reelIndex < this.reels.length; reelIndex++) {
      displayCells.push(this.reels[reelIndex].getDisplayedCells())
    }

    let lastCell = displayCells[0][indexes[0]]

    let matchCount = 0
    for (let i = 1; i < this.reels.length; i++) {
      if (lastCell !== displayCells[i][indexes[i]]) {
        break
      }

      lastCell = displayCells[i][indexes[i]]
      matchCount++
    }

    return matchCount
  }
}
