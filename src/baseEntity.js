var getId = require('./getId.js').getId;
var world = require('./world.js');


module.exports = function(constructor) {
  var worldDims;
  var maxSpeed = world.getMaxSpeed;
  var xClone = false;
  var yClone = false;
  var cornerClone = false;
  var pushEvents = [];
  var loaded = false;
  var objName = false;
  var moved = false;
  var newEffects = [];
  var effects = [];
  var makeClone = function(cloneType, corner) {
      var clone = constructor();
      clone[cloneType] = true;
      clone.cloned = function() {
        clone.pos.x = obj.pos.x;
        clone.pos.y = obj.pos.y;
        clone.pos.rot = obj.pos.rot;
        if (cloneType.includes('right')) clone.pos.x += worldDims.x;
        if (cloneType.includes('left')) clone.pos.x -= worldDims.x;
        if (cloneType.includes('up'))clone.pos.y -= worldDims.y;
        if (cloneType.includes('down'))clone.pos.y += worldDims.y;
      };
      clone.collide = function(collider) {
        obj.collide(collider);
      };
      if (cloneType.includes('right') || cloneType.includes('left')) {
        if (yClone) yClone.unload();
        yClone = clone;
      }
      if (cloneType.includes('up') || cloneType.includes('down')) {
        if (xClone) xClone.unload();
        xClone = clone;
      }
      if (corner) {
        if (cornerClone) cornerClone.unload();
        cornerClone = clone;
      }
      world.addItems(clone);
  };
  var manageClones = function() {
    var left, right, up, down;
    if (worldDims.x < (obj.pos.x + obj.radius / 2)) right = true;
    if (0 > (obj.pos.x - obj.radius / 2)) left = true;
    if (worldDims.y < (obj.pos.y + obj.radius / 2)) down = true;
    if (0 > (obj.pos.y - obj.radius / 2)) right = true;

    if (left && (!yClone || yClone.left)) makeClone('right');
    if (right && (!yClone || yClone.right)) makeClone('left');
    if (up && (!xClone || xClone.up)) makeClone('down');
    if (down && (!xClone || xClone.down)) makeClone('up');
    if (right && up && (!cornerClone || !cornerClone.downleft)) makeClone('downleft', true);
    if (right && down && (!cornerClone || !cornerClone.upleft)) makeClone('upleft', true);
    if (left && up && (!cornerClone || !cornerClone.downright)) makeClone('downright', true);
    if (left && down && (!cornerClone || !cornerClone.upright)) makeClone('upright', true);

    if (!left && !right) {
      if (yClone) yClone.unload();
      yClone = false;
      if (cornerClone) cornerClone.unload();
      cornerClone = false;
    }
    if (!up && !down) {
      if (xClone) xClone.unload();
      xClone = false;
      if (cornerClone) cornerClone.unload();
      cornerClone = false;
    }
  };
  var obj = {
    unload: function() {
      if (xClone) xClone.unload();
      if (yClone) yClone.unload();
      if (cornerClone) cornerClone.unload();
      world.deleteItem(obj.id);
    },
    id: getId(),
    AABB: {},
    radius: 0,
    addEffect: function(effect) {
      newEffects.push(effect);
    },
    step: function() {
      if (obj.cloned) {
        obj.cloned();
      } else {
        worldDims = world.getDims();
        effects = effects.concat(newEffects);
        newEffects = [];
        effects = effects.filter(function(item) { return item.call(obj); });
        obj.processMovementEvents();
        if (obj.pos.x < 0) obj.pos.x += worldDims.x;
        if (obj.pos.y < 0) obj.pos.y += worldDims.y;
        if (obj.pos.x > worldDims.x) obj.pos.x -= worldDims.x;
        if (obj.pos.y > worldDims.y) obj.pos.y -= worldDims.y;
        if (obj.pos.rot > Math.PI * 2) obj.pos.rot -= Math.PI * 2;
        if (obj.pos.rot < 0) obj.pos.rot += Math.PI * 2;
        manageClones();
      }
      obj.AABB = {
        x0: obj.pos.x - obj.radius,
        x1: obj.pos.x + obj.radius,
        y0: obj.pos.y - obj.radius,
        y1: obj.pos.y + obj.radius
      };
    },
    processMovementEvents: function() {
      obj.velocity = Math.sqrt(obj.pos.vec.x * obj.pos.vec.x + obj.pos.vec.y * obj.pos.vec.y);
      if (obj.velocity > maxSpeed) {
        obj.pos.vec.x = obj.pos.vec.x / (obj.velocity / maxSpeed);
        obj.pos.vec.y = obj.pos.vec.y / (obj.velocity / maxSpeed);
        obj.velocity = maxSpeed;
      }
      obj.pos.x += obj.pos.vec.x;
      obj.pos.y += obj.pos.vec.y;
      obj.pos.rot += obj.pos.vec.rot;
    },
    pos: {
      x: 0,
      y: 0,
      rot: 0,
      vec: {
        x: 0,
        y: 0,
        rot: 0
      }
    },
    push: function(vec) {
      if (vec.x) obj.pos.vec.x += vec.x;
      if (vec.y) obj.pos.vec.y += vec.y;
      if (vec.rot) obj.pos.vec.rot += vec.rot;
    },
    move: function(pos) {
      if (pos) {
        if (pos.x) obj.pos.x = pos.x;
        if (pos.y) obj.pos.y = pos.y;
        if (pos.rot) obj.pos.rot = pos.rot;
      }
    }
  };


  return obj;
};

