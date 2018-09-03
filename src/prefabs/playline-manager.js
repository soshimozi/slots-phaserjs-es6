import Indicator from './line-indicator';

const NumPlayLines = 9;

export default class extends Phaser.Sprite {
    constructor (game, x, y, w, h) {
      super(game);

      this.playlines = [];
      let offsets = [20, 20, 20, -100, 20, 20, -270, -144, 20];
  
      for(let i =0; i < NumPlayLines; i++) {
        let playline = this.game.add.sprite(x + 38, y + (i*h) + offsets[i], 'game_and_ui_atlas', 'ui/winlines/'+(i+1)+'.png');
        playline.visible = false;
        this.playlines.push(playline);
      }   

      this.lineIndicators = []
      for(let i=0; i < NumPlayLines; i++) {
        let leftIndicator = new Indicator(this.game, x, y + (i*h), 'game_and_ui_atlas', 'ui/'+(i+1)+'.png', 'ui/'+(i+1)+'_inactive.png');
        let rightIndicator = new Indicator(this.game, x + w /*1080*/, y + (i*h), 'game_and_ui_atlas', 'ui/'+(i+1)+'.png', 'ui/'+(i+1)+'_inactive.png');

        this.game.add.existing(leftIndicator);
        this.game.add.existing(rightIndicator);

        this.lineIndicators.push({left: leftIndicator, right: rightIndicator});
      }        

   
    }

    clear() {
        for (let lineIndex = 0; lineIndex < this.lineIndicators.length; lineIndex++) {
            this.lineIndicators[lineIndex].left.setActive(false);
            this.lineIndicators[lineIndex].right.setActive(false);
      
            this.playlines[lineIndex].visible = false;
          }        
    }

    displayPayLine (index, state) {
      this.lineIndicators[index].left.setActive(state);
      this.lineIndicators[index].right.setActive(state);
      this.playlines[index].visible = state;      
    }
}