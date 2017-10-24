var baseEntity = require('./baseEntity.js');
var sprite = new Image();
sprite.src = './img/laser.png';

Bullet = function(options) {
  var obj = baseEntity(Bullet);
  obj.sprite = sprite;
  var startTime = Date.now();
  obj.radius = 5;
  if (options) obj.move(options.pos);
  if (options) obj.push(options.vec);
  obj.type = 'bullet';
  obj.collide = function(collider) {
    if (collider.type === 'asteroid') obj.unload();
  }
  obj.addEffect(function() {
    if (Date.now() - 1000 > startTime) obj.unload();
    return true;
  });

  return obj;
};

module.exports = Bullet;
