var events = require('./events.js');
var world = require('./world.js');
var baseEntity = require('./baseEntity.js');
var Bullet = require('./bullet.js');
var sprite = new Image();
sprite.src = './img/spaceship_sprite.png';

var Player = function(options) {
  var obj = baseEntity(Player);
  obj.sprite = sprite;
  var lastShot = Date.now();
  if (options) obj.move(options.pos);
  obj.type = 'player';
  obj.radius = 40;
  obj.collide = function(collider) {
    if (collider.type === 'asteroid') {
      events.emit('gameOver');
    }
  };

  obj.addEffect(function() {
    var now = Date.now();
    if (obj.shooting && now - 200 > lastShot) {
      lastShot = now;
      world.addItems(Bullet({pos: {x: obj.pos.x, y: obj.pos.y, rot: obj.pos.rot}, vec: {x: Math.cos(obj.pos.rot) * 10, y: Math.sin(obj.pos.rot) * 10}}));
    }
    if (obj.leftTurn) obj.move({rot: obj.pos.rot + 0.1});
    if (obj.rightTurn) obj.move({rot: obj.pos.rot - 0.1});
    if (obj.thrusting) obj.push({x: Math.cos(obj.pos.rot) * 0.5, y: Math.sin(obj.pos.rot) * 0.5});

    return true;
  });

  return obj;
};

module.exports = Player;
