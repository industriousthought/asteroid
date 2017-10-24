var getId = require('./getId.js').getId;
var world = require('./world.js');
var worldDims = {x: 1000, y: 1000};
world.setDims(worldDims);
var collision = require('./collision.js');
var renderer = require('./renderer.js');
var events = require('./events.js');
var dom = require('./dom.js');
var controller = require('./controller.js');
var Player = require('./player.js');
var Asteroid = require('./asteroid.js');
var stats;
var resetStats = function() {
  stats = {
    shotsFired: 0,
    hits: 0,
    startTime: Date.now(),
    distanceTraveled: 0
  };
}

var stars = [];
for (var i = 0; i < 50; i++) {
  stars.push({x: Math.random() * worldDims.x + 1, y: Math.random() * worldDims.y + 1, z: Math.random * 5 + 1});
}

var currentLevel = 0;
var animationId;
var state = 'mainMenu';
var states = {
  mainMenu: function() {
    dom.display('mainMenu');
  },
  gameOver: function() {
    controller.disconnectPlayer();
    events.unregister(animationId);
    dom.display('scoreView');
  },
  gamePaused: function() {
    controller.disconnectPlayer();
    events.unregister(animationId);
    dom.display('pausedView');
  },
  gamePlaying: function() {
    dom.display('gamePlayingView');
    animationId = getId();
    world.step();
    controller.connectPlayer(world.getItemsByType('player')[0]);
    events.register('animate', function() {
      world.step();
      collision(world);
      renderer(world, dom.getItemById('gameView'));
    }, animationId);

  }
};

var startLevel = function() {
  var player;
  if (state === 'mainMenu') {
    currentLevel = 0;
    world.unload();
    player = world.addItems(Player({pos: {x: worldDims.x / 2, y: worldDims.y / 2, rot: 0}}))[0];
    resetStats();
  }
  if (!player) player = world.getItemsByType('player')[0];
  var asteroid;
  for (var i = 0; i < currentLevel + 3; i++) {
    asteroid = Asteroid();
    asteroid.setRandomPos(worldDims, player.pos);
    world.addItems(asteroid);
  }
  if (state !== 'gamePlaying') updateState('gamePlaying');
  currentLevel++;
};

var updateState = function(newState) {
    state = newState;
    states[state].apply(null, [].slice.call(arguments, 1));
};

for (var s in states) {
  events.register(s, updateState.bind(null, s));
}
events.register('asteroidDestroyed', function() {
  if (world.getItemsByType('asteroid').length === 0) startLevel();
});
events.register('escapePress', function() {
  if (state === 'gamePlaying') updateState('gamePaused');
  if (state === 'gamePaused') updateState('gamePlaying');
  if (state === 'gameOver') updateState('mainMenu');
});
events.register('startGame', startLevel);

dom.onload(function() {
  updateState(state);
});

