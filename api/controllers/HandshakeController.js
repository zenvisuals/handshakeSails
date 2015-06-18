var _ = require("underscore");
/**
 * HandshakeController
 *
 * @description :: Server-side logic for managing Handshakes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	findOne: function(req, res){
		var id = req.param('id');

		Handshake.find({
      or: [
        {initiator: id},
        {receiver: id}
      ]
    })
		.then(function(handshakes){

			var receiverIds = _.chain(handshakes).pluck('receiver').filter(function(num){
				return num != id;
			}).value();

			var initiatorIds = _.chain(handshakes).pluck('initiator').filter(function(num){
				return num != id;
			}).value();

			return [Profile.find({user: receiverIds}),Profile.find({user: initiatorIds})];
		}).spread(function(receiverProfiles, initiatorProfiles){

			var receiverProfiles = receiverProfiles ? receiverProfiles:[];
			var initiatorProfiles = initiatorProfiles ? initiatorProfiles:[];

			return res.view({
				userId: id,
				receivers: receiverProfiles,
				initiators: initiatorProfiles
			})

		}).catch(function(e){
			return res.serverError(e);
		})
	},
	find: function(req, res) {
		return res.redirect('/');
	},
	destroy: function(req, res) {
		var receiver = req.body.receiver ? parseInt(req.body.receiver) : "no input";
		var initiator = req.body.initiator ? parseInt(req.body.initiator) : "no input";

		if(isNaN(receiver) || isNaN(initiator)) return res.badRequest();

		Handshake.destroy({
			receiver: receiver,
			initiator: initiator
		}).then(function(destroyedHandshake){
			return res.send(200);
		}).catch(function(e){
			return res.serverError(e);
		})
	}
};
