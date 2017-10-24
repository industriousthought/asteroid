
module.exports = function(world, canvas) {
  var ctx = canvas.getContext('2d');
  canvas.width = canvas.width;
  world.getItems().forEach(function(entity) {
    ctx.save();
    ctx.translate(entity.pos.x, entity.pos.y);
    ctx.rotate(entity.pos.rot + Math.PI / 2);
    ctx.translate(- entity.pos.x, - entity.pos.y);
    ctx.drawImage(entity.sprite, entity.pos.x - entity.radius, entity.pos.y - entity.radius, entity.radius * 2, entity.radius * 2);
    ctx.restore();
  });
};
