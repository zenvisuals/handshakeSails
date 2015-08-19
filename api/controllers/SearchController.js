var Promise = require('bluebird');
var _ = require('underscore');
/**
 * SearchController
 *
 * @description :: Server-side logic for managing Searches
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	search: function(req, res) {

		if(!Object.keys(req.query).length) return res.badRequest("There is no query");

		var promiseStack = [];

		if(req.query.company) {
			promiseStack.push(Profile.find({company:req.query.company}).populateAll());
		}
		if(req.query.designation) {
			promiseStack.push(Profile.find({designation:req.query.designation}).populateAll());
		}
		if(req.query.industry) {
			promiseStack.push(Profile.find({industry:req.query.industry}).populateAll());
		}
		Promise.all(promiseStack).then(function(results){

			var profiles = _.chain(results).flatten(true).uniq().value();

			return res.view('search/search', {profiles:profiles});
		})
		//return res.ok();
	}
};
