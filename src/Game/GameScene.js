import {Container, Sprite} from 'pixi.js';
import PaintableMask from './PaintableMask.js';
import ScratchEmitter from './ScratchEmitter.js';

class GameScene extends Container{

  constructor(settings) {
    super();

    // Game over flag.
    this.gameOver = false;

    // Add background.
    this.bg = new Sprite(PIXI.utils.TextureCache.background);
    this.addChild(this.bg);

    // Add the scratch cover.
    this.cover = new Sprite(PIXI.utils.TextureCache.cover);
    this.cover.x = 188;
    this.cover.y = 56;
    this.addChild(this.cover);

    // Create mask object.
    this.scratchMask = new PaintableMask(this.cover.width, this.cover.height);
    this.scratchMask.x = 188;
    this.scratchMask.y = 56;
    this.addChild(this.scratchMask);
    this.cover.mask = this.scratchMask;

    // Add a scratch particle emitter for effects.
    this.emitter = new ScratchEmitter(this, this.scratchMask);

    // Track when the
    this.scratchMask.on('paint', this.onMaskPaint.bind(this));

  }

  onMaskPaint(mask, data) {
    if(!this.gameOver && data.percent > 68) {
      // Flag that the game is complete.
      this.gameOver = true;

      // Disable effects emitter.
      this.emitter.enabled = false;

      // TODO: This is where we could start triggering end game logic.

      PIXI.ticker.shared.add((dt) => {
        // Fade out over 0.8 seconds.
        if(mask.alpha > 0){
          mask.alpha -= (dt / 60) / 0.8;
        }
      })
    }
  }

}

export default GameScene
