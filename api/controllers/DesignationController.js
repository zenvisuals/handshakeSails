/**
 * DesignationController
 *
 * @description :: Server-side logic for managing Designations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req, res) {
		var query = req.query.designation ? Designation.find({title:{'startsWith': req.query.designation}}) : Designation.find();
		query.then(function(results){
			return res.json(results);
		})
	}
};
