import Phaser from 'phaser';
import {watch} from '../utils/watcher';

export default class extends Phaser.Sprite {
  constructor (game, x, y, text, font, color) {
    super(game);

    let barGroup = this.game.add.group();
    barGroup.x = x;
    barGroup.y = y;

    barGroup.create(0, 0, 'game_and_ui_atlas', 'ui/b1.png');
    barGroup.create(28, 0, 'game_and_ui_atlas', 'ui/b2.png');
    let end = barGroup.create(233, 0, 'game_and_ui_atlas', 'ui/b1.png');
    end.scale.x *= -1;

    this.textBlock = this.game.add.text(x + 28, y, '', {font: font, fill: color, boundsAlignH: 'center', boundsAlignV: 'middle'});
    this.textBlock.text = text;
    this.textBlock.anchor.setTo(0.5, 0);

    this.textBlock.setTextBounds(0, 0, 247, 28);
  }

  bind(obj, property) {
    // set initial value
    this.setText(obj[property].toString());

    watch(obj, property, (propertyName, oldValue, newValue) => {
      this.setText(newValue.toString());
    });
  }

  setText(text) {
    this.textBlock.text = text;
  }
}
