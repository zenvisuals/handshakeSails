var validator = require('validator');
var crypto = require('crypto');

exports.register = function(req, res, next) {
  var email = req.param('email'),
      username = req.param('username'),
      password = req.param('password');

  if(!email) {
    req.flash('error', 'Error.Passport.Email.Missing');
    return next(new Error('No email was entered.'));
  }

  if(!username) {
    req.flash('error', 'Error.Passport.Username.Missing');
    return next(new Error('No username was entered.'));
  }

  if(!password) {
    req.flash('error', 'Error.Passport.Password.Missing');
    return next(new Error('No password was entered.'));
  }

  User.create({
    username: username,
    email: email
  }).exec(function(err, user){
    if(err) {
      if(err.code === 'E_VALIDATION') {
        if(err.invalidAttributes.email) {
          req.flash('error', 'Error.Passport.Email.Exists');
        } else {
          req.flash('error', 'Error.Passport.User.Exists');
        }
      }
      return next(err);
    }

    var token = crypto.randomBytes(48).toString('base64');

    Passport.create({
      protocol: 'local',
      password: password,
      user: user.id,
      accessToken: token
    }).exec(function(err,passport){
      if(err) {
        if(err.code === 'E_VALIDATION') {
          req.flash('error', 'Error.Passport.Password.Invalid');
        }
        return user.destroy(function(destroyErr){
          next(destroyErr || err);
        });
      }

      next(null, user);
    });
  });
};

exports.connect = function(req, res, next) {
  var user = req.user,
      password = req.param('password');

  Passport.findOne({
    protocol: 'local',
    user: user.id
  }).exec(function(err, passport){
    if(err) return next(err);

    if(!passport) {
      Passport.create({
        protocol: 'local',
        password: password,
        user: user.id
      }, function(err, passport){
        next(err, user);
      })
    } else {
      next(null, user);
    }
  });
};

exports.login = function(req, identifier, password, next) {
  var isEmail = validator.isEmail(identifier),
      query = {};

  if(isEmail) {
    query.email = identifier;
  } else {
    query.username = identifier;
  }

  User.findOne(query).exec(function (err, user){
    if(err) return next(err);

    if(!user) {
      if(isEmail) {
        req.flash('error', 'Error.Passport.Email.NotFound');
      } else {
        req.flash('error', 'Error.Passport.Username.NotFound');
      }

      return next(null, false);
    }

    Passport.findOne({
      protocol: 'local',
      user: user.id
    }).exec(function(err, passport) {
      if(passport) {
        passport.validatePassword(password, function(err, res){
          if(err) return next(err);

          if(!res) {
            req.flash('error', 'Error.Passport.Password.Wrong');
            return next(null, false);
          } else {
            return next(null, user);
          }
        });
      } else {
        req.flash('error', 'Error.Passport.Password.NotSet');
        return next(null, false);
      }
    });
  });
}
