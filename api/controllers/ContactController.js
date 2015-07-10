var _ = require('underscore');
var connectionModel = require('../services/inherits/connectionModel');
/**
 * ContactController
 *
 * @description :: Server-side logic for managing Contacts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	findOne: function(req, res){
		var id = req.param('id');

		connectionModel.gatherProfiles(Contact, req, res)
		.spread(function(receiverProfiles, initiatorProfiles){

			var receiverProfiles = receiverProfiles ? receiverProfiles:[];
			var initiatorProfiles = initiatorProfiles ? initiatorProfiles:[];

			var receiverProfilesMapped = _.map(receiverProfiles, function(receiverProfile){
				var newReceiverProfile = receiverProfile;
				newReceiverProfile.initiator = id;
				return newReceiverProfile;
			});

			var initiatorProfilesMapped = _.map(initiatorProfiles, function(initiatorProfile){
				var newInitiatorProfile = initiatorProfile;
				newInitiatorProfile.receiver = id;
				return newInitiatorProfile;
			});

			var contactProfiles = _.union(receiverProfilesMapped, initiatorProfilesMapped);

			return res.view({
				userId: id,
				profiles: contactProfiles
			});

		}).catch(function(e){
			return res.serverError(e);
		})
	},
	find: function(req, res) {
		return res.redirect('/');
	},
};
