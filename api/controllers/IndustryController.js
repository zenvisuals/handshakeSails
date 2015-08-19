/**
 * IndustryController
 *
 * @description :: Server-side logic for managing Industries
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req, res) {
		var query = req.query.industry ? Industry.find({title:{'startsWith': req.query.industry}}) : Industry.find();
		query.then(function(results){
			return res.json(results);
		})
	}
};
