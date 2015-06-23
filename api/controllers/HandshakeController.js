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
		connectionModel.destroy(Handshake, req, res);
	},
	acceptHandshake: function(req, res) {
		console.log(req.body);
		res.ok();
	}
};
