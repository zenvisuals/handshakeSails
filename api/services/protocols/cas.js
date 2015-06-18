module.exports = function(req, identifier, next) {
  var query = {
    identifier: identifier,
    protocol: 'cas'
  };

  passport.connect(req, query, {username: identifier}, next);
}
