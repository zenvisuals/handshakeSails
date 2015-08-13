var connectionModel = require('../services/inherits/connectionModel');
/**
* Contact.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var attributes = connectionModel.attributes;

module.exports = {

  attributes: connectionModel.attributes,

  initiate: function(id, userIds, cb) {
    connectionModel.initiate(Contact, id, userIds, cb);
  },
};
