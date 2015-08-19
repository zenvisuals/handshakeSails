var _ = require('underscore');
/**
 * CompanyController
 *
 * @description :: Server-side logic for managing Companies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req, res) {
		var query = req.query.company ? Company.find({title:{'startsWith': req.query.company}}) : Company.find();
		query.then(function(results){
			return res.json(results);
		})
	}
};
