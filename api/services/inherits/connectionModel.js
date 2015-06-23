var _ = require('underscore');

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
  initiate: function(model, id, userIds, cb) {
    var model = model;
    if(!id) return cb("No id specified");
    if(!userIds) return cb("No users specified");

    var thisId = id;
    var userIds = _.filter(userIds, function(num){
      return num !== id;
    });
    model.find({
      or: [
        {initiator: thisId},
        {receiver: thisId}
      ]
    })
    .then(function(connections){
      var toCreate = [];

      if(!connections) {
        //if there are no existing handshakes, create all
        toCreate = userIds;
        return toCreate;
      }
      //get existing handshake intitiator
      var initiators = _.pluck(connections, 'initiator');
      //get existing handshake receivers
      var receivers = _.pluck(connections, 'receiver');
      //filter out users without the handshakes for creation
      var toCreate = _.difference(userIds, receivers, initiators);

      return toCreate;
    }).then(function(receiverIds){

      var connectionData = _.map(receiverIds, function(receiverId){
        return {
          initiator: thisId,
          receiver: receiverId
        };
      });

      return model.create(connectionData);
    }).then(function(newConnections){
      return cb(null, newConnections);
    }).catch(function(err){
      return cb(err);
    })

  },
  destroy: function(model, req, res) {
    var model = model;

    var receiver = req.body.receiver ? parseInt(req.body.receiver) : "no input";
		var initiator = req.body.initiator ? parseInt(req.body.initiator) : "no input";

		if(isNaN(receiver) || isNaN(initiator)) return res.badRequest();

		return model.destroy({
			receiver: receiver,
			initiator: initiator
		});
  },
  gatherProfiles: function(model, req, res) {
    var model = model;
    var id = req.param('id');

    return model.find({
      or: [
        {initiator: id},
        {receiver: id}
      ]
    })
		.then(function(connections){

			var receiverIds = _.chain(connections).pluck('receiver').filter(function(num){
				return num != id;
			}).value();

			var initiatorIds = _.chain(connections).pluck('initiator').filter(function(num){
				return num != id;
			}).value();

			return [Profile.find({user: receiverIds}),Profile.find({user: initiatorIds})];
		})
  }
}
