import Phaser from 'phaser'

import _ from 'lodash'
import PlaylineManager from '../prefabs/playline-manager';
import InfoBox from '../prefabs/info-box';
import InfoBar from '../prefabs/info-bar';
import ReelManager from '../prefabs/reel-manager';
import Announcement from '../prefabs/announcement';

import config from '../config';

export default class extends Phaser.State {
  init () {
    this.game.stage.disableVisibilityChange = true
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
  }

  preload () {
  }

  create () {
    this.autoSpin = false;
    this.readyToSpin = true;

    this.ticketCount = 100000;
    this.currentBetAmount = 1;
    this.maxBet = 15;
    this.totalWinningsText = '';

    let text = this.add.text(this.world.centerX, this.world.centerY - 48, 'Initializing Game ... Please Wait', {font: '16px Libre Franklin', fill: '#ffffff', align: 'center'});
    text.anchor.setTo(0.5, 0.5);

    window.setTimeout(() => { 
      this.buildUI() 
    }, 50);
  }


  buildUI () {

    this.backgroundMusic = this.game.add.audio('background',1,true);
    this.backgroundMusic.play();

    this.game.stage.backgroundColor = '#462209';

    this.game.add.sprite(0, 0, 'game_and_ui_atlas', 'screen.png');
    this.game.add.sprite(0, 0, 'game_and_ui_atlas', 'back.png');

    this.selectedPaylinesIndex = 0;

    this.configureLogo();

    this.reelManager = new ReelManager(this.game, 78, 110, config.weights);
    this.playlineManager = new PlaylineManager(this.game, 110, 110, 970, 50);

    this.addIdleAnimations();

    this.addActionButtons();
    this.addPaylineIcons();

    this.infoBox = new InfoBox(this.game, 5, 140, '', '32px Bangers', '#ffffff');
    this.infoBox.bind(this, 'currentBetAmount');

    this.infoBar = new InfoBar(this.game, 535, 720, '', '24px Bangers', '#ffffff');
    this.infoBar.bind(this, 'ticketCount');
    
    this.announcementContainer = new Announcement(this.game, 485, 590, 'YOU WON!', '24px Bangers', '#3399ff');
    this.announcementContainer.bind(this, 'totalWinningsText');

    this.doubleDownIcon = this.game.add.sprite(890, 700, 'game_and_ui_atlas', 'ui/x2.png');
    this.doubleDownIcon.visible = false;
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


    let fireeffect = this.game.add.sprite(150, 550, 'animation-textures-atlas', 'fire/fire_00.png');
    let firenames = []
    for (let i = 1; i < 11; i++) {
      firenames.push('fire/fire_0' + i + '.png')
    }

    fireeffect.animations.add('fire-static', firenames, 8, true, false)
    fireeffect.animations.play('fire-static')
    fireeffect.visible = true
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
    this.isDoubleDown = ~this.isDoubleDown;

    // TODO: show double down icon
    this.doubleDownIcon.visible = this.isDoubleDown;
  }

  incrementBet () {
    this.currentBetAmount = this.currentBetAmount + 1
    if (this.currentBetAmount > this.maxBet) {
      this.currentBetAmount = this.maxBet
    }
  }

  betMax () {
    this.currentBetAmount = this.maxBet;
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
    this.announcementContainer.hide();
    this.logoAnimation.visible = false

    this.reelManager.spin();

    this.spinning = true

    this.currentBet = {
      amount: config.paylineCounts[this.selectedPaylinesIndex] * this.currentBetAmount,
      double: this.isDoubleDown,
      payLinesIndex: this.selectedPaylinesIndex
    }

    this.ticketCount -= ((this.currentBet.amount) * (this.currentBet.double ? 2 : 1));
    this.playlineManager.clear();

    this.readyToShowResults = false;
    this.readyToSpin = false;
    this.reelManager.hideFrames();

    if (!this.autoSpin) {
      // TODO: Evaluate whether we want to reset the bet each spin?
      this.currentBetAmount = 1;
    }
  }

  updateReels() {
    
    // we are done, so let's stop spinning
    if (this.reelManager.isReady()) {

      this.spinning = false
      this.readyToShowResults = true

      this.currentPayline = 0
      this.lastUpdate = 0

      // there is always one payline so check that first
      let matchCount = this.checkPayLine(config.paylineCheckPatterns[this.currentPayline]);

      // if we have three or more
      if (matchCount > 1) {
        this.showWinResults(matchCount, config.paylineCheckPatterns[this.currentPayline]);
        this.lastUpdate = this.game.time.now
      }

      this.updateScore();
    }
  }

  showResults() {
    let winLines = this.getWinLines()

    if (winLines === 0 && this.autoSpin) {
      this.readyToShowResults = false;

      // if no winner and we are on auto spin
      // time to spin again
      window.setTimeout(() => {
        this.readyToSpin = true;
        this.spin();
      }, 1500);
    }

    // cycle through each result
    if (this.game.time.now - this.lastUpdate > 1500) {

      // we have more than one win line
      if (winLines > 1) {
        this.reelManager.hideFrames();
        this.playlineManager.displayPayLine(this.currentPayline, false);
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

  update () {
    if (this.spinning) {
      this.updateReels();
    } else if (this.readyToShowResults) {

      this.showResults();
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
    for (let reelIndex = 0; reelIndex < this.reelManager.getNumReels(); reelIndex++) {
      displayCells.push(this.reelManager.getDisplayedCells(reelIndex));
    }

    let betAmount = ((this.currentBet.amount / config.paylineCounts[this.currentBet.payLinesIndex]) * (this.isDoubleDown ? 2 : 1));

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
      this.totalWinningsText = totalWinnings.toString() + ' TICKETS'

      this.announcementContainer.show();
      this.logoAnimation.visible = true
    }

    this.ticketCount += Math.ceil(totalWinnings)
  }

  showWinResults (matchCount, indexes) {
    this.playlineManager.displayPayLine(this.currentPayline, true);
    this.reelManager.showMatches(matchCount, indexes);
  }

  checkPayLine (indexes) {
    let displayCells = []
    for (let reelIndex = 0; reelIndex < this.reelManager.getNumReels(); reelIndex++) {
      displayCells.push(this.reelManager.getDisplayedCells(reelIndex));
    }

    let lastCell = displayCells[0][indexes[0]]

    let matchCount = 0
    for (let i = 1; i < this.reelManager.getNumReels(); i++) {
      if (lastCell !== displayCells[i][indexes[i]]) {
        break
      }

      lastCell = displayCells[i][indexes[i]]
      matchCount++
    }

    return matchCount
  }
}
