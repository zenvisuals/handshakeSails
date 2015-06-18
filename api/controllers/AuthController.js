/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	login: function(req, res) {
		var strategies = sails.config.passport,
				providers = {};

		Object.keys(strategies).forEach(function (key){
			if(key === 'local') {
				return;
			}

			providers[key] = {
				name: strategies[key].name,
				slug: key
			};
		});
		//render
		res.view({
			providers: providers,
			errors: req.flash('error')
		});
	},

	logout: function(req, res) {
		req.logout();

		req.session.authenticated = false;

		res.redirect('/');
	},

	register: function(req, res){
		res.view({
			errors: req.flash('error')
		});
	},

	provider: function(req, res) {
		passport.endpoint(req, res);
	},

	callback: function(req, res) {
		function tryAgain(err) {

			var flashError = req.flash('error')[0];

			if(err && !flashError) {
				req.flash('error', 'Error.Passport.Generic');
			} else if (flashError) {
				req.flash('error', flashError);
			}
			req.flash('form', req.body);

			var action = req.param('action');

			switch(action) {
				case 'register':
					res.redirect('/register');
					break;

				case 'disconnect':
					res.redirect('back');
					break;

				default:
					res.redirect('/login');
			}
		}

		passport.callback(req, res, function(err, user, challenges, statues) {
			if(err || !user) {
				return tryAgain(challenges);
			}

			req.login(user, function(err) {
				if(err) return tryAgain(err);

				req.session.authenticated = true;

				res.redirect('/');
			});
		});
	},

	disconnect: function(req, res) {
		passport.disconnect(req, res);
	}
};
