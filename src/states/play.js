import Phaser from 'phaser'
import PIXI from 'pixi'

import Reel from '../prefabs/reel'
import _ from 'lodash'
import Indicator from '../prefabs/indicator'

import config from '../config';

const reelCellCount = 350
const visibleCells = 3
const reelCount = 5

export default class extends Phaser.State {
  init () {
    this.game.stage.disableVisibilityChange = true
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
  }

  preload () {}

  create () {
    let text = this.add.text(this.world.centerX, this.world.centerY - 48, 'Initializing Game ... Please Wait', {font: '16px Libre Franklin', fill: '#ffffff', align: 'center'})
    text.anchor.setTo(0.5, 0.5)

    // this.game.stage.backgroundColor = '#462209'

    this.autoSpin = false
    this.readyToSpin = true

    this.ticketCount = 100000
    this.currentBetAmount = 1;
    this.maxBet = 15;

    window.setTimeout(() => { 
      this.buildUI() 
    }, 50);
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
    console.log('config', config);

    this.game.stage.backgroundColor = '#462209'

    this.game.add.sprite(0, 0, 'game_and_ui_atlas', 'screen.png');
    this.game.add.sprite(0, 0, 'game_and_ui_atlas', 'back.png');

    // this.payoutTable = [
    //   [15, 45, 200], 
    //   [5, 20, 100], 
    //   [45, 200, 1200], 
    //   [15, 45, 200], 
    //   [10, 30, 150], 
    //   [5, 20, 100], 
    //   [10, 30, 150], 
    //   [45, 200, 1200]
    // ];

    // this.paylineCounts = [1, 3, 5, 7, 9]
    // this.paylineCheckPatterns = [ 
    //       [0, 0, 0, 0, 0], 
    //       [0, 0, 1, 0, 0], 
    //       [0, 1, 2, 1, 0], 
    //       [1, 0, 0, 0, 1], 
    //       [1, 1, 1, 1, 1], 
    //       [1, 2, 2, 2, 1], 
    //       [2, 1, 0, 1, 2], 
    //       [2, 2, 1, 2, 2], 
    //       [2, 2, 2, 2, 2] 
    //     ];

    // let randomWeights = {1: 0.75, 2: 2.0, 3: 0.08, 4: 0.75, 5: 0.85, 6: 2.0, 7: 0.85, 8: 0.08}

    this.frameColumnOffsets = [224, 384, 544, 704, 864]
    this.frameRowOffsets = [95, 246, 400]

    this.selectedPaylinesIndex = 0

    this.configureLogo();
    this.buildReels(config.weights)

    this.addWinEffects();

    this.addPaylines()
    this.addLineIndicators()
    this.addIdleAnimations();

    this.addActionButtons()
    this.addPaylineIcons()

    this.game.add.sprite(5, 140, 'game_and_ui_atlas', 'ui/tickets_per_line.png')
    this.ticketsPerLineText = this.game.add.text(65, 190, '', {font: '32px Bangers', fill: '#ffffff', align: 'center'})
    this.ticketsPerLineText.anchor.setTo(0.5, 0)
    this.ticketsPerLineText.text = this.currentBetAmount.toString()

    this.game.add.text(635, 695, 'NUMBER OF TICKETS', {font: '16px Libre Franklin', fill: '#ffffff', align: 'center', fontWeight: 'bold'}).anchor.setTo(0.5, 0)

    this.addInfoBar(535, 720)
    this.ticketCountText = this.game.add.text(635, 715, '', {font: '24px Bangers', fill: '#ffffff', align: 'center'})
    this.ticketCountText.text = this.ticketCount.toString()
    this.ticketCountText.anchor.setTo(0.5, 0)

    // TODO: Add animations for tablo
    this.tablo = this.game.add.sprite(485, 590, 'game_and_ui_atlas', 'ui/tablo.png')
    this.tablo.visible = false

    // TODO: Add Mega Win animations
    this.totalWinningsTextHeader = this.game.add.text(628, 610, 'YOU WON!', {font: '24px Bangers', fill: '#3399ff', align: 'center'})
    this.totalWinningsTextHeader.anchor.setTo(0.5, 0)
    this.totalWinningsTextHeader.visible = false

    this.totalWinningsText = this.game.add.text(628, 640, '11111 Tickets', {font: '24px Bangers', fill: '#3399ff', align: 'center'})
    this.totalWinningsText.anchor.setTo(0.5, 0)
    this.totalWinningsText.visible = false
  }

  addIdleAnimations() {
    let effect = this.game.add.sprite(1020, 270, 'animation-textures-atlas', 'pers/pers_idle/pers_idle_00.png')
    let names = []
    for (let i = 1; i < 34; i++) {
      names.push('pers/pers_idle/pers_idle_0' + i + '.png')
    }

    for (let i = 32; i >= 1; i--) {
      names.push('pers/pers_idle/pers_idle_0' + i + '.png')
    }

    effect.animations.add('pers-static', names, 8, true, false)
    effect.animations.play('pers-static')
    effect.visible = true
  }

  addWinEffects() {
    // create 5 frame sprites and win effects
    this.winFrames = []
    this.winEffects = []

    for (let frameIndex = 0; frameIndex < 5; frameIndex++) {
      let sprite = this.game.add.sprite(0, 0, 'game_and_ui_atlas', 'frame.png')
      sprite.visible = false

      this.winFrames.push(sprite)

      let effect = this.game.add.sprite(0, 0, 'animation-textures-atlas', 'win_effect/win_effect_87.png')
      //
      let names = []
      for (let i = 136; i >= 87; i--) {
        names.push('win_effect/win_effect_' + i + '.png')
      }

      effect.animations.add('win', names, 20, true, false)
      effect.blendMode = PIXI.blendModes.ADD

      effect.visible = false
      this.winEffects.push(effect)
    }

  }

  configureLogo() {
    let logo = this.game.add.sprite(this.game.world.centerX, -5, 'animation-textures-atlas', 'logo/logo_104.png')
    logo.anchor.setTo(0.5, 0)

    this.logoAnimation = this.game.add.sprite(this.game.world.centerX, -5, 'animation-textures-atlas', 'logo/logo_104.png')
    this.logoAnimation.anchor.setTo(0.5, 0)
    let logoAnimationNames = []
    for (let i = 1; i < 20; i++) {
      logoAnimationNames.push('logo/logo_' + (104 + i).toString() + '.png')
    }

    this.logoAnimation.animations.add('logo', logoAnimationNames, 10, true, false)
    this.logoAnimation.animations.play('logo')
  }

  buildReels (randomWeights) {
    this.reels = []
    for (let i = 1; i <= reelCount; i++) {
      let reel = new Reel(this.game, 78 + (i * 160), 110, reelCellCount, visibleCells, randomWeights, 'reel' + i)
      this.game.add.existing(reel)
      this.reels.push(reel)
    }
  }

  addLineIndicators () {
    this.lineIndicators = []

    for(let i=1; i<10; i++) {
      let leftIndicator = new Indicator(this.game, 110, 120 + (i * 50), 'game_and_ui_atlas', 'ui/'+i+'.png', 'ui/'+i+'_inactive.png')
      let rightIndicator = new Indicator(this.game, 1080, 120 + (i * 50), 'game_and_ui_atlas', 'ui/'+i+'.png', 'ui/'+i+'_inactive.png')
      this.game.add.existing(leftIndicator)
      this.game.add.existing(rightIndicator)
      this.lineIndicators.push({left: leftIndicator, right: rightIndicator})
  
    }

    // let leftIndicator = new Indicator(this.game, 110, 120, 'game_and_ui_atlas', 'ui/1_.png', 'ui/1_inactive.png')
    // let rightIndicator = new Indicator(this.game, 1080, 120, 'game_and_ui_atlas', 'ui/1_.png', 'ui/1_inactive.png')
    // this.game.add.existing(leftIndicator)
    // this.game.add.existing(rightIndicator)
    // this.lineIndicators.push({left: leftIndicator, right: rightIndicator})

    // leftIndicator = new Indicator(this.game, 110, 170, 'game_and_ui_atlas', 'ui/2.png', 'ui/2_inactive.png')
    // rightIndicator = new Indicator(this.game, 1080, 170, 'game_and_ui_atlas', 'ui/2.png', 'ui/2_inactive.png')
    // this.game.add.existing(rightIndicator)
    // this.game.add.existing(leftIndicator)
    // this.lineIndicators.push({left: leftIndicator, right: rightIndicator})

    // leftIndicator = new Indicator(this.game, 110, 220, 'game_and_ui_atlas', 'ui/3.png', 'ui/3_inactive.png')
    // rightIndicator = new Indicator(this.game, 1080, 220, 'game_and_ui_atlas', 'ui/3.png', 'ui/3_inactive.png')
    // this.game.add.existing(rightIndicator)
    // this.game.add.existing(leftIndicator)
    // this.lineIndicators.push({left: leftIndicator, right: rightIndicator})

    // leftIndicator = new Indicator(this.game, 110, 270, 'game_and_ui_atlas', 'ui/4.png', 'ui/4_inactive.png')
    // rightIndicator = new Indicator(this.game, 1080, 270, 'game_and_ui_atlas', 'ui/4.png', 'ui/4_inactive.png')
    // this.game.add.existing(rightIndicator)
    // this.game.add.existing(leftIndicator)
    // this.lineIndicators.push({left: leftIndicator, right: rightIndicator})

    // leftIndicator = new Indicator(this.game, 110, 320, 'game_and_ui_atlas', 'ui/5.png', 'ui/5_inactive.png')
    // rightIndicator = new Indicator(this.game, 1080, 320, 'game_and_ui_atlas', 'ui/5.png', 'ui/5_inactive.png')
    // this.game.add.existing(rightIndicator)
    // this.game.add.existing(leftIndicator)
    // this.lineIndicators.push({left: leftIndicator, right: rightIndicator})

    // leftIndicator = new Indicator(this.game, 110, 370, 'game_and_ui_atlas', 'ui/6.png', 'ui/6_inactive.png')
    // rightIndicator = new Indicator(this.game, 1080, 370, 'game_and_ui_atlas', 'ui/6.png', 'ui/6_inactive.png')
    // this.game.add.existing(rightIndicator)
    // this.game.add.existing(leftIndicator)
    // this.lineIndicators.push({left: leftIndicator, right: rightIndicator})

    // leftIndicator = new Indicator(this.game, 110, 420, 'game_and_ui_atlas', 'ui/7.png', 'ui/7_inactive.png')
    // rightIndicator = new Indicator(this.game, 1080, 420, 'game_and_ui_atlas', 'ui/7.png', 'ui/7_inactive.png')
    // this.game.add.existing(rightIndicator)
    // this.game.add.existing(leftIndicator)
    // this.lineIndicators.push({left: leftIndicator, right: rightIndicator})

    // leftIndicator = new Indicator(this.game, 110, 470, 'game_and_ui_atlas', 'ui/8.png', 'ui/8_inactive.png')
    // rightIndicator = new Indicator(this.game, 1080, 470, 'game_and_ui_atlas', 'ui/8.png', 'ui/8_inactive.png')
    // this.game.add.existing(rightIndicator)
    // this.game.add.existing(leftIndicator)
    // this.lineIndicators.push({left: leftIndicator, right: rightIndicator})

    // leftIndicator = new Indicator(this.game, 110, 520, 'game_and_ui_atlas', 'ui/9.png', 'ui/9_inactive.png')
    // rightIndicator = new Indicator(this.game, 1080, 520, 'game_and_ui_atlas', 'ui/9.png', 'ui/9_inactive.png')
    // this.game.add.existing(rightIndicator)
    // this.game.add.existing(leftIndicator)
    // this.lineIndicators.push({left: leftIndicator, right: rightIndicator})
  }

  addPaylines () {
    this.playlines = []
    let offsets = [20, 20, 20, -100, 20, 20, -270, -144, 20]

    for(let i =0; i < 9; i++) {
      let playline = this.game.add.sprite(148, 120 + (i*50) + offsets[i], 'game_and_ui_atlas', 'ui/winlines/'+(i+1)+'.png')
      playline.visible = false
      this.playlines.push(playline)
  
    }

    // let playline = this.game.add.sprite(148, 120 + 20, 'game_and_ui_atlas', 'ui/winlines/1.png')
    // playline.visible = false
    // this.playlines.push(playline)

    // playline = this.game.add.sprite(148, 170 + 20, 'game_and_ui_atlas', 'ui/winlines/2.png')
    // playline.visible = false
    // this.playlines.push(playline)

    // playline = this.game.add.sprite(148, 220 + 20, 'game_and_ui_atlas', 'ui/winlines/3.png')
    // playline.visible = false
    // this.playlines.push(playline)

    // playline = this.game.add.sprite(148, 270 - 100, 'game_and_ui_atlas', 'ui/winlines/4.png')
    // playline.visible = false
    // this.playlines.push(playline)

    // playline = this.game.add.sprite(148, 320 + 20, 'game_and_ui_atlas', 'ui/winlines/5.png')
    // playline.visible = false
    // this.playlines.push(playline)

    // playline = this.game.add.sprite(148, 370 + 20, 'game_and_ui_atlas', 'ui/winlines/6.png')
    // playline.visible = false
    // this.playlines.push(playline)

    // playline = this.game.add.sprite(148, 420 - 270, 'game_and_ui_atlas', 'ui/winlines/7.png')
    // playline.visible = false
    // this.playlines.push(playline)

    // playline = this.game.add.sprite(148, 470 - 144, 'game_and_ui_atlas', 'ui/winlines/8.png')
    // playline.visible = false
    // this.playlines.push(playline)

    // playline = this.game.add.sprite(148, 520 + 20, 'game_and_ui_atlas', 'ui/winlines/9.png')
    // playline.visible = false
    // this.playlines.push(playline)
  }

  addActionButtons () {
    this.game.add.button(1100, 680, 'game_and_ui_atlas', () => { if (this.readyToSpin) this.spin() }, this, 'ui/start_btn.png', 'ui/start_btn.png', 'ui/start_active_btn.png', 'ui/start_btn.png')
    this.game.add.button(200, 760, 'game_and_ui_atlas', () => { this.incrementLines() }, this, 'ui/lines.png', 'ui/lines.png', 'ui/lines_active.png', 'ui/lines.png')
    this.game.add.button(420, 760, 'game_and_ui_atlas', () => { this.incrementBet() }, this, 'ui/betone.png', 'ui/betone.png', 'ui/betone_active.png', 'ui/betone.png')
    this.game.add.button(640, 760, 'game_and_ui_atlas', () => { this.betMax() }, this, 'ui/betmax.png', 'ui/betmax.png', 'ui/betmax_active.png', 'ui/betmax.png')
    this.game.add.button(860, 760, 'game_and_ui_atlas', () => { this.doubleDown() }, this, 'ui/double.png', 'ui/double.png', 'ui/double_active.png', 'ui/double.png')
    this.game.add.button(-40, 680, 'game_and_ui_atlas', () => { this.autoSpin = !this.autoSpin; if (this.autoSpin && this.readyToSpin) this.spin() }, this, 'ui/auto_spin.png', 'ui/auto_spin.png', 'ui/auto_spin_active.png', 'ui/auto_spin.png')
    this.game.add.button(1180, 20, 'game_and_ui_atlas', () => { if (this.readyToSpin) this.game.state.start('Help') }, this, 'ui/info_btn.png', 'ui/info_btn.png', 'ui/info_btn.png', 'ui/info_btn.png')
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
      let count = config.paylineCounts[i]

      let inactivePaylineIcon = inactiveGroup.create(205 + (40 * i), 720, 'game_and_ui_atlas', 'ui/' + count + '_lines.png')
      let activePaylineIcon = activeGroup.create(205 + (40 * i), 710, 'game_and_ui_atlas', 'ui/' + count + '_lines_active.png')
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
  }

  spin () {
    this.tablo.visible = false
    this.totalWinningsTextHeader.visible = false
    this.totalWinningsText.visible = false
    this.logoAnimation.visible = false

    for (let i = 0; i < reelCount; i++) {
      this.reels[i].start()
    }

    this.spinning = true

    this.currentBet = {
      amount: config.paylineCounts[this.selectedPaylinesIndex] * this.currentBetAmount,
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

    if (!this.autoSpin) {
      this.currentBetAmount = 1
      this.ticketsPerLineText.text = this.currentBetAmount.toString()
    }
  }

  update () {
    if (this.spinning) {
      let reelsReady = _.map(this.reels, (r) => { return r.readyForScore ? 1 : 0 }).reduce((m, n) => { return m + n }, 0)
      if (reelsReady === reelCount) {
        this.spinning = false
        this.showResults = true

        this.currentPayline = 0
        this.lastUpdate = 0

        // there is always one payline so check that first
        let matchCount = this.checkPayLine(config.paylineCheckPatterns[this.currentPayline])

        // if we have three or more
        if (matchCount > 1) {
          this.showWinResults(matchCount, config.paylineCheckPatterns[this.currentPayline])
          this.lastUpdate = this.game.time.now
        }

        this.updateScore()

        // this.idlePerson.animations.stop()
      }
    } else if (this.showResults) {
      let winLines = this.getWinLines()

      if (winLines === 0 && this.autoSpin) {
        this.showResults = false;

        window.setTimeout(() => {
          this.readyToSpin = true;
          this.spin();
        }, 1500);

        //this.readyToSpin = true
        //this.spin()
      }

      if (this.game.time.now - this.lastUpdate > 1500) {

        // we have more than one win line
        if (winLines > 1) {
          this.hideFrames()
          this.displayPayLine(this.currentPayline, false)
        }

        this.currentPayline += 1

        if (this.currentPayline >= config.paylineCounts[this.currentBet.payLinesIndex]) {
          this.currentPayline = 0

          // we have cycled through once, so ready to spin now
          this.readyToSpin = true
        }

        let matchCount = this.checkPayLine(config.paylineCheckPatterns[this.currentPayline])

        // if we have 3 or more of the same
        if (matchCount > 1) {
          this.showWinResults(matchCount, config.paylineCheckPatterns[this.currentPayline])
          this.lastUpdate = this.game.time.now
        }
      }
    }
  }

  getWinLines () {
    let winLines = 0
    for (let i = 0; i < config.paylineCounts[this.currentBet.payLinesIndex]; i++) {
      let matchCount = this.checkPayLine(config.paylineCheckPatterns[i])

      // we have a winner
      if (matchCount > 1) {
        winLines += 1
      }
    }

    return winLines
  }

  updateScore () {
    let totalWinnings = 0

    let displayCells = []
    for (let reelIndex = 0; reelIndex < this.reels.length; reelIndex++) {
      displayCells.push(this.reels[reelIndex].getDisplayedCells())
    }

    let betAmount = (this.currentBet.amount / config.paylineCounts[this.currentBet.payLinesIndex])
    for (let i = 0; i < config.paylineCounts[this.currentBet.payLinesIndex]; i++) {
      let matchCount = this.checkPayLine(config.paylineCheckPatterns[i])

      // get first index of match
      let index = displayCells[0][config.paylineCheckPatterns[i][0]] - 1

      // three or more
      if (matchCount > 1) {
        totalWinnings += (config.payoutTable[index][matchCount - 2] * betAmount)
      }
    }

    if (totalWinnings > 0) {
      this.totalWinningsText.text = totalWinnings.toString() + ' TICKETS'
      this.tablo.visible = true
      this.totalWinningsTextHeader.visible = true
      this.totalWinningsText.visible = true

      this.logoAnimation.visible = true
    }

    this.ticketCount += Math.ceil(totalWinnings)
    this.ticketCountText.text = this.ticketCount.toString()
  }

  hideFrames () {
    for (let i = 0; i < 5; i++) {
      this.winFrames[i].visible = false
      this.winEffects[i].visible = false
    }
  }

  showWinResults (matchCount, indexes) {
    this.displayPayLine(this.currentPayline, true)

    for (let i = 0; i < (matchCount + 1); i++) {
      this.winFrames[i].visible = true
      this.winFrames[i].x = this.frameColumnOffsets[i]
      this.winFrames[i].y = this.frameRowOffsets[indexes[i]]

      this.winEffects[i].visible = true
      this.winEffects[i].animations.play('win')
      this.winEffects[i].x = this.frameColumnOffsets[i] + 20
      this.winEffects[i].y = this.frameRowOffsets[indexes[i]] + 20
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
