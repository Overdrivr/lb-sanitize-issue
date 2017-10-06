module.exports = function(Note) {
  Note.observe('after save', function(ctx, next) {
    console.log('after save %o', ctx.instance);
    next();
  });
};
