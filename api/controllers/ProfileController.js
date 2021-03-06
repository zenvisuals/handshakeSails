var linkedin = require('../services/linkedin/api');
var request = require('request');
/**
 * ProfileController
 *
 * @description :: Server-side logic for managing Profiles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	viewLinkedin: function(req, res) {
		console.log(req.passport);
		var id = req.param('id');
		var provider = 'linkedin';
		Passport.findOne({provider: provider, user: id})
		.then(function(passport) {
			if(!passport) throw new Error('No passport found');
			request.get({url:linkedin.basicProfile + passport.tokens.accessToken,json:true}, function(e, r, data) {
				if(e) return res.badRequest(e);
				if(r.statusCode >= 300) return res.badRequest("Something went wrong");
				return res.view('profile/viewLinkedin', {"profile":data});
			})
		}).catch(function(e) {
			return res.serverError(e);
		});
		//res.send(200);
	}
};
