var PIXI = require('pixi.js');
import GameScene from './Game/GameScene.js';
// Import configuration settings from json file.
import config from './config.json';


// Use convenience method to setup a PIXI application.
const app = new PIXI.Application(config.app);

// Add the view to the page.
document.body.appendChild(app.view);


// Access the shared loader.
const loader = PIXI.loader;

// Add assets to load.
for(var key in config.assets) {
  loader.add(key, config.assets[key]);
}

loader.load(() => {
  console.log('done loading');
  // Set the game running with a new instance of our game scene.
  app.stage = new GameScene();
});
