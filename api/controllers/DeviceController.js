/**
 * DeviceController
 *
 * @description :: Server-side logic for managing Devices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	initiateHandshake: function(req, res) {
		if(req.body && req.body.deviceId && req.body.tagId) {
			var deviceId = req.body.deviceId;
			var tagId = req.body.tagId;

			console.log(1, deviceId, 2, tagId);
			return res.ok();
		} else {
			return res.badRequest();
		}
	}
};
