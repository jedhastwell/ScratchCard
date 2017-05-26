import {ticker, Sprite, Texture, CanvasRenderTarget} from 'pixi.js';

class PaintableMask extends Sprite {

  constructor(width, height) {

    // Create a canvas that we can draw to.
    let renderTarget = new CanvasRenderTarget(width, height);
    // Create a new texture based on the content of our canvas.
    let texture = Texture.from(renderTarget.canvas);

    // Init Sprite base with the new texture.
    super(texture);

    // NOTE: Using raw canvas drawing because PIXI's Graphics object
    // doesn't seem to want to connect lines over multiple update frames
    // and seems to slow down after drawing many lines. Also don't think it
    // supports round lineCap endings.

    // Easy handle to the canvas render context.
    this.context = renderTarget.context;
    // Fill with white.
    this.context.fillStyle = '#FFFFFF';
    this.context.fillRect(0, 0, width, height);
    // Set properties.
    this.context.lineWidth = 20;
    this.context.lineCap   = 'round';

    // Make sure we can receive interaction events.
    this.interactive = true;

    // Bind to interaction events.
		this.on('mousedown', this.onDown.bind(this));
		this.on('mousemove', this.onMove.bind(this));
		this.on('mouseup', this.onUp.bind(this));
    this.on('mouseupoutside', this.onUp.bind(this));
		this.on('touchstart', this.onDown.bind(this));
		this.on('touchmove', this.onMove.bind(this));
		this.on('touchend', this.onUp.bind(this));
    this.on('touchendoutside', this.onUp.bind(this));

    // Will need to store previous mouse position.
    this.prevPos = null;

    // Init drawing flag.
    this.drawing = false;
  }

  onDown(e){
    // Store as previous mouse position.
    this.prevPos = e.data.global;
    // Set flag to say we're drawing.
    this.drawing = true;
    // Get local mouse/touch position.
    var pos = e.data.getLocalPosition(this);
    // Start a new path at the mouse/touch position.
    this.context.beginPath();
    this.context.moveTo(pos.x, pos.y);
    // Move slightly and apply stroke to trigger a draw to provide
    // feedback to the user in case they don't start dragging.
    this.context.lineTo(pos.x, pos.y + 0.5);
    this.context.stroke();
    // Make sure PIXI will update the texture.
    this.texture.update();

    this.emit('mycoolevent', 'data', 'moredata');
  }

  onUp(e){
    // No longer drawing. Update flag.
    this.drawing = false;
  }

  onMove(e) {
    // Make sure we are dragging.
    if(this.drawing) {
      // Get local mouse/touch position.
      var pos = e.data.getLocalPosition(this);
      // Connect line to new mouse/touch position.
      this.context.lineTo(pos.x, pos.y);
      this.context.stroke();
      // Make sure PIXI will update the texture.
      this.texture.update();

      // Calculate percentage drawn and check if we're done.
      let percent = this.calcPercentComplete();

      // Emit event with relevent data.
      this.emit('paint', this, {
        prev: this.prevPos,
        pos: e.data.global,
        percent: percent
      });

      // Store new move as previous mouse position.
      this.prevPos = e.data.global;
    }
  }

  calcPercentComplete(x=0, y=0 , width=this.texture.width, height=this.texture.height) {
    // Get pixel data.
		let data = this.context.getImageData(x, y, width, height).data;
    // Counter for filled pixels.
		let count = 0;
    // Loop through pixels.
		for(let i = 0, len = data.length; i < len; i += 4) {
      // Count filled pixels.
      if(data[i] < 255) {
        count++;
      }
    }
    // Return percentage value.
		return (100 * count / (width * height));
	}

}

export default PaintableMask
