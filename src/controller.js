var getId = require('./getId.js').getId;
var events = require('./events.js');
var dom = require('./dom.js');
var player;

var api = {
  connectPlayer: function(p) {
    player = p;
  },
  disconnectPlayer: function() {
    player = false;
  }
};

var keysPressed = [];

dom.attachEvent('startGame', 'click', events.emit.bind(null, 'startGame'));
dom.attachEvent('resumeGame', 'click', events.emit.bind(null, 'gamePlaying'));
dom.attachEvent('quitGame', 'click', events.emit.bind(null, 'gameOver'));
dom.attachEvent('closeStats', 'click', events.emit.bind(null, 'mainMenu'));

document.addEventListener('keydown', function(e) {
  e.preventDefault();
  if (e.key === 'Escape') events.emit('escapePress');
  if ((e.key.includes('Arrow') || e.key === ' ') && !keysPressed.includes(e.key)) keysPressed.push(e.key);
});

document.addEventListener('keyup', function(e) {
  keysPressed = keysPressed.filter(function(key) {
    return (key !== e.key);
  });
});

events.register('animate', function() {
  var shooting, thrusting, leftTurn, rightTurn;
  if (player) {
    keysPressed.forEach(function(key) {
      if (key === ' ') shooting = true;
      if (key === 'ArrowDown') thrusting = true;
      if (key === 'ArrowLeft') leftTurn = true;
      if (key === 'ArrowRight') rightTurn = true;
    });
    player.shooting = shooting;
    player.thrusting = thrusting;
    player.leftTurn = leftTurn;
    player.rightTurn = rightTurn;
  }
});

module.exports = api;
