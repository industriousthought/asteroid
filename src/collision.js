var prune = function(a, b) {
  return (
      (a.AABB.y0 > b.AABB.y0 && a.AABB.y0 < b.AABB.y1) || 
      (a.AABB.y1 > b.AABB.y0 && a.AABB.y1 < b.AABB.y1) ||
      (b.AABB.y0 > a.AABB.y0 && b.AABB.y0 < a.AABB.y1) || 
      (b.AABB.y1 > a.AABB.y0 && b.AABB.y1 < a.AABB.y1) 
      );
};

var circleDetect = function(a, b) {
  var x, y, dis, radius, delta, theta, aDelta, bDelta;
  x = a.pos.x - b.pos.x;
  y = a.pos.y - b.pos.y;
  dis = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  radius = parseInt(a.radius) + parseInt(b.radius);

  if (dis < radius) {
    delta = (radius - dis);
    theta = Math.atan2(y, x);
    a.collide(b);
    b.collide(a);
  }
};

var collision = function(world) {
  var sweeping = [];
  var possibleXs = [];
  world.getXs().forEach(function(x) {
    if (x.type === 'b') {
      sweeping.forEach(function(swept) {
        possibleXs.push([x.obj, swept]);
      });
      sweeping.push(x.obj);
    }
    if (x.type === 'e') {
      sweeping = sweeping.filter(function(swept) {
        if (swept.id !== x.obj.id) return true;
      });
    }
  });

  possibleXs = possibleXs.filter(function(pair) {
    return prune(pair[0], pair[1]);
  });

  possibleXs.forEach(function(pair) {
    circleDetect(pair[0], pair[1]);
  });

};

module.exports = collision;

