var connectionModel = require('../services/inherits/connectionModel');
/**
* Handshake.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: connectionModel.attributes,

  initiate: function(id, userIds, cb) {
    connectionModel.initiate(Handshake, id, userIds, cb);
  },
};
