/**
 * LinkController
 *
 * @description :: Server-side logic for managing Links
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	links: function(req, res) {
		if(!req.session.passport) {
			return res.badRequest("You are not logged on");
		}
		var user = parseInt(req.session.passport.user);

		User.findOne({id:user}).populate('passports')
		.then(function(user){
			return res.view('links/links', {"links":user.passports});
		});
	}
};
