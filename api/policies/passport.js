module.exports = function(req, res, next) {
  //init passport
  passport.initialize()(req, res, function(){
    //use built in session
    passport.session()(req, res, function(){
      res.locals.user = req.user;
      next();
    });
  });
};
