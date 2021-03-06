import Phaser from 'phaser';

const cellWidth = 144;
const cellHeight = 154;
const halfCellHeight = 77;

function weightedRand (spec) {
  let table = [];
  for (let i in spec) {
    // The constant 10 below should be computed based on the
    // weights in the spec for a correct and optimal table size.
    // E.g. the spec {0:0.999, 1:0.001} will break this impl.
    for (let j = 0; j < spec[i] * 1000; j++) {
      table.push(i);
    }
  }
  return function () {
    return table[Math.floor(Math.random() * table.length)];
  }
}
export default class extends Phaser.Sprite {
  constructor (game, x, y, cellCount, visibleCells, weights, key) {
    super(game);

    this.key = key;

    let indexes = this.buildIndexes(cellCount, visibleCells, weights);

    this.anchor.setTo(0, 0);

    let backBMD = this.game.add.bitmapData(cellWidth, cellHeight * length);
    backBMD.dirty = true;

    let backgroundSprite = this.game.add.sprite(x, y, backBMD);
    backgroundSprite.anchor.setTo(0, 0);

    let mask = game.add.graphics(0, 0);
    mask.moveTo(x, y);

    // Shapes drawn to the Graphics object must be filled.
    mask.beginFill(0xffffff);
    mask.drawRect(x, y, cellWidth, cellHeight * visibleCells);

    this.buildReel(x, y, indexes);

    this.blurY = this.game.add.filter('BlurY');
    this.blurY.blur = 0;

    this.reelGroup.mask = mask;
    this.reelGroup.filters = [this.blurY];

    this.maxReelSpeed = 30;

    this.reelSpeed = 0;
    this.reelFriction = 0;

    this.reelStopped = true;
    this.spinningUp = false;

    this.maxY = -cellHeight * (indexes.length - visibleCells);
    this.reelHeight = indexes.length - visibleCells;

    backgroundSprite.mask = mask;

    this.indexes = indexes;
    this.readyForScore = false;

    this.reelGroup.y = this.maxY + cellHeight;
  }


  getDisplayedCells () {
    let offset = Math.abs(this.reelGroup.y);
    let index = Math.floor(offset / cellHeight);
    let values = [];

    for (let i = index; i < index + 3; i++) {
      values.push(this.indexes[i]);
    }
    return values;
  }

  start () {
    this.spinningUp = true;
    this.reelFriction = 0.0;

    this.readyForScore = false;
    this.reelStopped = true;

    let tween = this.game.add.tween(this.reelGroup)
    let destinationY = this.reelGroup.y - halfCellHeight;
    tween.to({ y: destinationY }, 500, Phaser.Easing.Exponential.InOut, false).start();
    tween.onComplete.addOnce(() => { 
      this.reelStopped = false; 
      this.startTime = this.game.time.now;
      this.blurY.blur = 1;
    }, this);
  }  

  stop () {
    this.reelFriction = 0.25;
  }

  update () {
    if (!this.reelStopped) {
      this.blurY.blur = this.reelSpeed; // * 0.2
      if (this.spinningUp) {
        let dt = this.game.time.now - this.startTime;
        dt = dt / 1000.0;
        this.reelSpeed += (dt * dt)*16; //(x^2/2);

        if (this.reelSpeed >= this.maxReelSpeed) {
          this.reelSpeed = this.maxReelSpeed;

          let randomTime = this.game.rnd.integerInRange(300, 1500);
          this.game.time.events.add(randomTime, this.stop, this);
          this.spinningUp = false;
        }
      } else {
        this.reelSpeed -= this.reelFriction
        if (this.reelSpeed <= 0) {
          this.blurY.blur = 0;
          this.reelStopped = true;
          this.reelSpeed = 0;

          let offset = Math.abs(this.reelGroup.y);

          let remainder = offset % cellHeight;

          // get closest y
          let closestY = Math.ceil(offset / cellHeight);
          closestY -= 1;

          if (remainder > halfCellHeight) { closestY -= 1; }

          if (closestY > this.reelHeight) { closestY = 0; }

          let tween = this.game.add.tween(this.reelGroup);
          let destinationY = -(closestY * cellHeight);
          tween.to({ y: destinationY }, 350, Phaser.Easing.Bounce.Out, false).start();
          tween.onComplete.addOnce(() => { this.readyForScore = true }, this);
        }
      }

      if (!this.reelStopped) {

        this.reelGroup.y += this.reelSpeed;
        if(this.reelGroup.y > 0) {
          this.reelGroup.y = this.maxY + this.reelGroup.y;
        }
      }
    }
  }

  buildReel (x, y, indexes) {
    this.reelGroup = this.game.add.group();

    // add sprites
    for (let i = 0; i < indexes.length; i++) {
      let spriteIndex = indexes[i];

      let reelSprite = this.reelGroup.create(x, y + (i * cellHeight), 'game_and_ui_atlas', 'icon_' + spriteIndex + '.png');
      reelSprite.anchor.setTo(0, 0);
    }
  }

  buildIndexes (count, visibleCells, weights) {
    let indexes = [];
    let last = -1;

    let rand = weightedRand(weights);

    for (let i = 0; i < count - visibleCells; i++) {
      let next = rand();

      while (next === last) {
        next = rand();
      }

      indexes.push(next);
      last = next;
    }

    for (let index = 0; index < visibleCells; index++) {
      indexes.push(indexes[index]);
    }

    return indexes;
  }
}
