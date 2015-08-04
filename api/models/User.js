var _ = require('underscore');
/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    username: {
      type: 'string',
      unique: true
    },
    email: {
      type: 'email',
      unique: true
    },
    profile: {
      model: 'Profile',
    },
    handshakes: {
      type: 'array',
    },

    //association
    passports: {
      collection: 'Passport',
      via: 'user'
    },
    threads: {
      type: 'array'
    },
    messages: {
      collection: 'Message',
      via: 'sendingUser'
    },

    //Device
    device: {
      model: 'Device'
    }
  },

  beforeCreate: function(values, cb) {
    values.handshakes = new Array();
    cb();
  }
};
