var _ = require("underscore");
var connectionModel = require('../services/inherits/connectionModel');
/**
 * HandshakeController
 *
 * @description :: Server-side logic for managing Handshakes
 * @help        ::jecSee http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	findOne: function(req, res){
		var id = req.param('id');

		connectionModel.gatherProfiles(Handshake, req, res)
		.spread(function(receiverProfiles, initiatorProfiles){

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
		connectionModel.destroy(Handshake, req, res)
		.then(function(destroyedConnection){
			return res.send(200);
		}).catch(function(e){
			return res.serverError(e);
		});
	},
	acceptHandshake: function(req, res) {
		connectionModel.destroy(Handshake, req, res)
		.then(function(destroyedConnection){
			console.log(destroyedConnection[0]);
			console.log(destroyedConnection[0].initiator);
			console.log(destroyedConnection[0].receiver);
			Contact.initiate(destroyedConnection[0].initiator, [destroyedConnection[0].receiver], function(err, savedContact){
				if(err) return res.serverError(err);
				return res.send(200);
			});
		}).catch(function(e){
			//should put rollback function here
			return res.serverError(e);
		});
	}
};
