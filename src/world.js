var events = require('./events.js');
var get = require('./get.js');

var xs = [];
var world = [];
var worldDims;
var newItems = [];
var maxSpeed = 5;

var api = {
  getItems: function() {
    return world;
  },
  getXs:function() {
    return xs;
  },
  getDims: function() {
    return worldDims;
  },
  setDims: function(dims) {
    worldDims = dims;
  },
  unload: function() {
    world = [];
    newItems = [];
  },
  deleteItem: function(id) {
    world = world.filter(function(item) { if (item.id !== id) return true; });
    events.emit('entityCount');
  },
  step: function() {
    world = world.concat(newItems);
    newItems = [];
    xs = [];
    world.forEach(function(item) { 
      item.step.call(item); 
      xs.push({val: item.AABB.x0, type: 'b', obj: item});
      xs.push({val: item.AABB.x1, type: 'e', obj: item});
    });
    xs.sort(function(a, b) {
      return (a.val - b.val);
    });
  },
  addItems: function(items) {
    if (!items.length) items = [items];
    newItems = newItems.concat(items);
    return items;
  },
  getItemsByType: function(type) {
    return world.filter(function(item) {
      if (item.type === type) return true;
    });
  },
  getMaxSpeed: function() {
    return maxSpeed;
  },
  setMaxSpeed: function(speed) {
    maxSpeed = speed;
  },
  addEffect: function(fn) {
    newEffects.push(fn);
  }
};

module.exports = api;
