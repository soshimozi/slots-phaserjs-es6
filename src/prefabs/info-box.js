
import Phaser from 'phaser';
import {watch} from '../utils/watcher';

export default class extends Phaser.Sprite {
  constructor (game, x, y, text, font, color) {
    super(game);

    this.game.add.sprite(x, y, 'game_and_ui_atlas', 'ui/tickets_per_line.png')
    
    this.textBlock = this.game.add.text(x + 50, y + 50, '', {font: font, fill: color, boundsAlignH: 'center', boundsAlignV: 'middle'});
    this.textBlock.anchor.setTo(0.5, 0);
    this.textBlock.text = text;

    this.textBlock.setTextBounds(0, 0, 44, 44);

  }

  bind(obj, property) {
    this.setText(obj[property].toString());

    watch(obj, property, (propertyName, oldValue, newValue) => {
      this.setText(newValue.toString());
    });      
  }

  setText(text) {
    this.textBlock.text = text;
  }  
}