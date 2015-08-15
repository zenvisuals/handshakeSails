/**
 * DesignationController
 *
 * @description :: Server-side logic for managing Designations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req, res) {
		var query = req.query.company ? Designation.find({title:{'startsWith': req.query.company}}) : Designation.find();
		query.then(function(results){
			return res.json(_.pluck(results, 'title'));
		})
	}
};
