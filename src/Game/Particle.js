import {Sprite} from 'pixi.js';


class Particle extends Sprite {

  constructor(texture) {
    // Init the sprite with the given texture.
    super(texture);

    // Particle will destroy itself after this amount of time.
    this.lifetime = 0.7;
    // Particle will fade out over this amount of time prior to destroying itself.
    this.fadeTime = 0.3;
    // Particle decelerates by this amount
    this.friction = 700;
    // Velocity of the particle.
    this.vel = new PIXI.Point(0, 0);
    // How long the particle has been alive for.
    this.alive = 0;
  }

  update(dt) {
    dt = dt / 60;

    // Apply friction on x axis.
    if(this.vel.x > 0) {
      this.vel.x = Math.max(0, this.vel.x - this.friction * dt);
    } else if(this.vel.x < 0) {
      this.vel.x = Math.min(0, this.vel.x + this.friction * dt);
    }

    // Apply friction on y axis
    if(this.vel.y > 0) {
      this.vel.y = Math.max(0, this.vel.y - this.friction * dt);
    } else if(this.vel.y < 0) {
      this.vel.y = Math.min(0, this.vel.y + this.friction * dt);
    }

    // Update postion.
    this.x = this.x + (this.vel.x * dt);
    this.y = this.y + (this.vel.y * dt);

    // Track how long we've been alive for.
    this.alive += dt;

    // Fade the particle.
    this.alpha = Math.min(1, Math.max(0, ((this.lifetime - this.alive) / this.fadeTime)));


    // Check if we need to be destroyed.
    if(this.alive >= this.lifetime) {
      this.parent.removeChild(this);
      this.destroy();
    }
  }

}

export default Particle
