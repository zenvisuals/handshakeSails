var _ = require('underscore');
/**
* Handshake.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    initiator: {
      type: 'integer',
      required: true
    },
    receiver: {
      type: 'integer',
      required: true
    },
  },

  initiateHandshake: function(id, userIds, cb) {
    if(!id) return cb("No id specified");
    if(!userIds) return cb("No users specified");

    var thisId = id;
    var userIds = _.filter(userIds, function(num){
      return num !== id;
    });

    Handshake.find({
      or: [
        {initiator: thisId},
        {receiver: thisId}
      ]
    })
    .then(function(handshakes){
      var toCreate = [];

      if(!handshakes) {
        //if there are no existing handshakes, create all
        toCreate = userIds;
        return toCreate;
      }
      //get existing handshake intitiator
      var initiators = _.pluck(handshakes, 'initiator');
      //get existing handshake receivers
      var receivers = _.pluck(handshakes, 'receiver');
      //filter out users without the handshakes for creation
      var toCreate = _.difference(userIds, receivers, initiators);

      return toCreate;
    }).then(function(receiverIds){

      var handshakeData = _.map(receiverIds, function(receiverId){
        return {
          initiator: thisId,
          receiver: receiverId
        };
      });

      return Handshake.create(handshakeData);
    }).then(function(newHandshakes){
      return cb(null, newHandshakes);
    }).catch(function(err){
      return cb(err);
    })

  }
};
