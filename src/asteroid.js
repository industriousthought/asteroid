var events = require('./events.js');
var baseEntity = require('./baseEntity.js');
var world = require('./world.js');
var sprite = new Image();
sprite.src = './img/a02.png';

var Asteroid = function(options) {
  var obj = baseEntity(Asteroid);
  obj.sprite = sprite;
  if (options) obj.move(options.pos);
  if (options) obj.push(options.vec);
  obj.type = 'asteroid';
  var size = (!options) ? 3 : options.size || 3;
  obj.radius = size * 15;
  obj.setRandomPos = function(worldDims, pos) {
    obj.move({x: worldDims.x * Math.random(), y: worldDims.y * Math.random(), rot: Math.random() * Math.PI * 2});
    if (Math.abs(obj.pos.x - pos.x) < 250 && Math.abs(obj.pos.x - pos.x) < 250) {
      obj.setRandomPos(worldDims, pos);
    } else {
      obj.push({x: Math.random() * 2, y: Math.random() * 2, rot: Math.random() / 5});
    }
  };

  obj.collide = function(collider) {
    var i;
    if (collider.type === 'bullet' || collider.type === 'player') {
      obj.unload();
      if (size > 1) {
        for (i = 1; i <= size; i++) {
          world.addItems(Asteroid({
            pos: obj.pos, 
            vec: {
              x: obj.pos.vec.x + (Math.random() * 4) - 2, 
              y: obj.pos.vec.y + (Math.random() * 4) - 2, 
              rot: Math.random() * Math.PI * 2
            }, 
            size: size - 1
          }));
        }
      } else {
        events.emit('asteroidDestroyed');
      }
    }
  };

  return obj;
};

module.exports = Asteroid;
