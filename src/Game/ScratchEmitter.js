import {particles, Rectangle} from 'pixi.js';
import Particle from './Particle.js';

class ScratchEmitter {

  constructor(scene, mask) {

    // Flag to turn particle spawning on and off.
    this.enabled = true;

    // Bind update method to shared ticker.
    PIXI.ticker.shared.add(this.update.bind(this));

    // Add a particle container for the particle effect.
    this.container = new particles.ParticleContainer(200, {rotation: true, alpha: true});
    this.container.width = scene.width;
    this.container.height = scene.height;
    scene.addChild(this.container);

    // Get texture to use for particles.
    this.textures = [];
    let baseTexture = PIXI.utils.TextureCache.scratchParticles;

    // Split texture up into frames.
    for(let i = 0; i < 8; i++) {
      this.textures.push(new PIXI.Texture(baseTexture, new Rectangle(26 * i, 0, 26, 17)));
    }

    // Respond to paint events from the mask.
    mask.on('paint', this.onPaint.bind(this));

    // We need to track the percentage of the mask that has been painted.
    this.percent = 0;
  }

  onPaint(mask, data) {
    // Check we're enabled first.
    if(this.enabled) {
      // 1 particle per this many percent.
      const perParticle = 0.3;

      // Spawn particles as per the amount of the mask that has been painted.
      while(data.percent - this.percent > perParticle) {
        this.spawnParticle(data.prev.x, data.prev.y, data.pos.x, data.pos.y);
        this.percent += perParticle;
      }
    }
  }

  spawnParticle(x1, y1, x2, y2) {

      // Get a random texture for our new particle.
      const texture = this.textures[Math.floor(Math.random() * this.textures.length)];
      // Spawn a new particle.
      const p = new Particle(texture);
      this.container.addChild(p);

      // Position the particle randomly along the scratch path.
      const r = Math.random();
      p.x = x1 + (x2 - x1) * r;
      p.y = y1 + (y2 - y1) * r;

      // Randomize the rotation of the particle image.
      p.rotation = Math.random() * Math.PI * 2;

      // Calculate a random angle that is roughly perpendicular to direction of scratch movement.
      var angle = ((Math.PI * 2) - Math.atan2(x2 - x1, y2 - y1)) - (Math.PI / 8);
      angle += Math.random() * Math.PI / 4;
      // 1 in 2 chance to flip direction.
      angle += Math.floor(Math.random() * 2) == 0 ? 0 : Math.PI;

      // Now set the velocity at calculated angle at between 150 and 250 pixels per second.
      const speed = (Math.random() * 100) + 150;
      p.vel.x = Math.cos(angle) * speed;
      p.vel.y = Math.sin(angle) * speed;

  }

  update(dt) {
    // Update all particles in the container.
    for(var i in this.container.children) {
      this.container.children[i].update(dt);
    }
  }

}

export default ScratchEmitter
