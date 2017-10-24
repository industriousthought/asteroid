document.oncontextmenu = function() { return false; }
var events = require('./events.js');
var getId = require('./getId.js').getId;
var effects = require('./effects.js');
var world = require('./world.js');
var objs = {};
var loadEvents = [];
var loaded = false;
var worldDims = world.getDims();
var resetCanvas = function(canvas) {
  var canvasWidth = canvas.getAttribute('width');
  var canvasHeight = canvas.getAttribute('height');
  var screenWidth = window.innerWidth;
  var screenHeight = window.innerHeight;
  if (canvasWidth / canvasHeight > screenWidth / screenHeight) {
    canvas.style.width = screenWidth + 'px';
    canvas.style.height = screenWidth * (canvasHeight / canvasWidth) + 'px';
    canvas.style.top = (screenHeight - (screenWidth * (canvasHeight / canvasWidth))) / 2 + 'px';
    canvas.style.left = '0px'; 
  } else {
    canvas.style.height = screenHeight + 'px';
    canvas.style.width = screenHeight * (canvasWidth / canvasHeight) + 'px';
    canvas.style.left = (screenWidth - (screenHeight * (canvasWidth / canvasHeight))) / 2 + 'px';
    canvas.style.top = '0px'; 
  }
  events.emit('resetCanvas');
};

var api = {
  setCanvas: function(id) {
    objs[id].setAttribute('width', worldDims.x);
    objs[id].setAttribute('height', worldDims.y);
    resetCanvas(objs[id]);
    api.attachEvent('window', 'resize', resetCanvas.bind(null, objs[id]));
  },
  attachEvent: function(id, type, func) {
    api.onload(function() { 
      objs[id].addEventListener(type, func); 
    });
  },
  getItemsByClass: function(c) {
    return [].slice.call(document.getElementsByClassName(c)).map(function(item) {
      return item.id;
    });
  },
  getItemById: function(id) {
    return objs[id];
  },
  onload: function(ev) {
    if (loaded) return ev();
    loadEvents.push(ev);
  },
  display: function(id) {
    [].slice.call(document.getElementsByClassName('slides')).
      filter(function(obj) {
        if (obj.id !== id) return true;
        return false;
      }).
      forEach(function(obj) { 
        effects.fadeOut(obj); 
      });
    effects.fadeIn(objs[id]);
  },
  msg: function(msg) {
    api.getObjById('message').innerText = msg;
    effects.fadeIn(api.getObjById('message'));
  },
  closeMsg: function() {
    effects.fadeOut(api.getObjById('message'));
  }
};

window.onload = function() { 
  [].slice.call(document.getElementsByClassName('domobj')).forEach(function(obj, index, array) { 
    objs[obj.id] = obj; 
  });
  objs['window'] = window;
  loaded = true; 
  loadEvents.forEach(function(ev) { ev(); }); 
  [].slice.call(document.getElementsByTagName('canvas')).forEach(function(obj) {
    api.setCanvas(obj.id);
  });
};

module.exports = api;
