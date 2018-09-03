import Phaser from 'phaser';
import {watch} from '../utils/watcher';

export default class extends Phaser.Sprite {
  constructor (game, x, y, header, font, color) {
    super(game);

    this.tablo = this.game.add.sprite(x, y, 'animation-textures-atlas', 'tablo/tablo_01.png');
    this.tablo.visible = false;

    // TODO: Add Mega Win animations
    this.textHeader = this.game.add.text(x, y+20, header, {font: font, fill: color, boundsAlignH: 'center', boundsAlignV: 'middle'})
    this.textHeader.anchor.setTo(0, 0);
    this.textHeader.visible = false;

    this.textHeader.setTextBounds(0, 0, 286, 38);

    this.textBlock = this.game.add.text(x, y+48, '', {font: font, fill: color, boundsAlignH: 'center', boundsAlignV: 'middle', align: 'center'})
    this.textBlock.anchor.setTo(0, 0);
    this.textBlock.setTextBounds(0, 0, 286, 38);
    this.textBlock.visible = false;

    this.addAnimations();
  }

  addAnimations() {
    let names = [];

    names.push('tablo/tablo_01.png');
    names.push('tablo/tablo_02.png');

    this.tablo.animations.add('announcement', names, 4, true, false);
    this.tablo.animations.play('announcement');
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

  hide() {
    this.tablo.visible = false
    this.textHeader.visible = false
    this.textBlock.visible = false      
  }

  show() {
      this.textHeader.visible = true;
      this.textBlock.visible = true;
      this.tablo.visible = true;
  }
}