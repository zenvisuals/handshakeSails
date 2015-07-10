/**
 * ThreadController
 *
 * @description :: Server-side logic for managing Threads
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req, res) {
		var id1 = parseInt(req.query.id1);
		var id2 = parseInt(req.query.id2);
		if(!id1 || !id2) return res.badRequest("User Ids not specified");
		Profile.findOne({user: id2}).then(function(receiver){
			var populateThread = Thread.findOrCreate({
				or: [
					{threadParticipants: {'contains': [id1,id2]}},
					{threadParticipants: {'contains': [id2,id1]}}
				]
			}
				, {threadParticipants: [id1, id2]}).populate('messages');
			var receiverProfile = receiver;
			var currentUser = Profile.findOne({user:id1});

			return [populateThread, receiverProfile, currentUser];
		}).spread(function(thread, receiver, user){

			var messages = [];

			if(!thread.messages) throw new Error('Messages not found');
			if(thread.messages.length > 0) {
				messages = thread.messages;
			}
			return res.view({
				messages: messages,
				receiver: receiver,
				user: user
			});
		}).catch(function(err){
			return res.badRequest(err);
		})
	},
	create: function(req, res) {
		var id1 = parseInt(req.body.id1);
		var id2 = parseInt(req.body.id2);
		var message = req.body.message;
		if(!id1 || !id2) return res.badRequest("User Ids not specified");
		Thread.findOrCreate({
			or: [
				{threadParticipants: {'contains': [id1,id2]}},
				{threadParticipants: {'contains': [id2,id1]}}
			]
		}
			, {threadParticipants: [id1, id2]}).populate('messages')
			.then(function(thread){
				thread.messages.add({
					sendingUser: id1,
					content: message
				});
				return thread.save();
			}).then(function(savedThread){
				return res.ok();
			}).catch(function(err){
				return res.badRequest(err);
			})
	}
};
