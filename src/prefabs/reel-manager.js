import Reel from './reel';
import PIXI from 'pixi'

const NumReels = 5;

const reelCellCount = 350
const visibleCells = 3


export default class extends Phaser.Sprite {
    constructor (game, x, y, randomWeights) {
      super(game);

      this.frameColumnOffsets = [224, 384, 544, 704, 864];
      this.frameRowOffsets = [95, 246, 400];
  
      this.buildReels(x, y, randomWeights);
      this.addWinEffects();
    }

    buildReels(x, y, randomWeights) {
        this.reels = [];
        for (let i = 1; i <= NumReels; i++) {
          let reel = new Reel(this.game, x + (i * 160), y, reelCellCount, visibleCells, randomWeights, 'reel' + i)
          this.game.add.existing(reel);
          this.reels.push(reel);
        }        
    }

    addWinEffects() {
        // create 5 frame sprites and win effects
        this.winFrames = []
        this.winEffects = []
    
        for (let frameIndex = 0; frameIndex < NumReels; frameIndex++) {
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
    
    spin() {
        for (let i = 0; i < NumReels; i++) {
            this.reels[i].start()
        }        
    }

    showMatches(matchCount, indexes) {

        if(matchCount >= NumReels) {
          throw new "Argument out of range";
        }
    
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
    
    hideFrames () {
        for (let i = 0; i < NumReels; i++) {
            this.winFrames[i].visible = false
            this.winEffects[i].visible = false
        }
    }    

    isReady() {
        let reelsReady = _.map(this.reels, (r) => { return r.readyForScore ? 1 : 0 }).reduce((m, n) => { return m + n }, 0);
        return reelsReady === NumReels; 
    }

    getDisplayedCells(index) {
        return this.reels[index].getDisplayedCells();        
    }

    getNumReels() {
        return NumReels;
    }
}