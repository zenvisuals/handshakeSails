var bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

/**
* Passport.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

function hashPassword(passport, next) {
  if(passport.password) {
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
      if(err) return next(err);

      bcrypt.hash(passport.password, salt, function(err, hash){
        if(err) return next(err);
        passport.password = hash;
        next(null, passport);
      })
    })
  } else {
    next(null, passport);
  }
}

module.exports = {

  attributes: {
    protocol: {
      type: 'string',
      enum: ['local','oauth','oauth2','openid','bearer','cas'],
      required: true
    },
    password: {
      type: 'string',
      minLength: 8
    },
    accessToken: {
      type: 'string'
    },
    provider: {
      type: 'string'
    },
    identifier: {
      type: 'string'
    },
    tokens: {
      type: 'json'
    },
    //assocation
    user: {
      model: 'User',
      required: true
    },
    //custom methods
    validatePassword: function(password, next) {
      bcrypt.compare(password, this.password, next);
    },
    //override toJSON
    toJSON: function() {
      return {};
    }
  },

  beforeCreate: function(passport, next) {
    hashPassword(passport, next);
  },

  beforeUpdate: function(passport, next) {
    hashPassword(passport, next);
  }
};
