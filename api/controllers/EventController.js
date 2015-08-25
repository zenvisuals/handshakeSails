var Promise = require('bluebird');
var meetup = require('../services/meetup/api');
var request = Promise.promisifyAll(require('request'));
var moment = require('moment');
/**
 * EventController
 *
 * @description :: Server-side logic for managing Events
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	events: function(req, res) {
		if(!req.session.passport) {
			return res.badRequest("You are not logged on");
		}
		var user = parseInt(req.session.passport.user);

		Passport.find({user:user})
		.then(function(passports){
			var promises = [];
			passports.forEach(function(passport){
				if(passport.provider == "meetup") {

						var getMeetupEvents = request.getAsync({
							url: meetup.events,
							qs: {
								access_token: passport.tokens.accessToken,
								member_id: "self",
								rsvp: "yes",
								status: "past"
							}, json: true
						}).then(function(response){
							if(response[0].statusCode >= 200 && response[0].statusCode < 300) {

								var results = _.map(response[0].body.results, function(result){

									return {
										id: result.id,
										venue: result.venue,
										name: result.name,
										time: moment(result.time).format("dddd, MMMM Do YYYY, h:mm:ss a"),
										url: result.event_url,
										platform: 'meetup'
									}
								});
								return results;
							} else {
								throw new Error("Something went wrong");
							}
						})

						promises.push(getMeetupEvents);
					}

				});

				return Promise.all(promises);
			}).then(function(results){
				var events = _.flatten(results, true);
				return res.view('events/events', {"events":events});
			})

	},
	attendees: function(req, res) {
		var platform = req.param('platform');
		var eventId = req.param('id');

		var _promise;

		if(!req.session.passport || !platform || !eventId) {
			return res.badRequest("You are either not logged on, or the URL is wrong");
		}
		var user = parseInt(req.session.passport.user);

		Passport.findOne({provider: platform,user:user})
		.then(function(passport) {
			if(platform == "meetup") {
				var _promise = request.getAsync({
					url: meetup.rsvps,
					qs: {
						access_token: passport.tokens.accessToken,
						event_id: eventId
					}, json: true
				}).then(function(response){
					if(response[0].statusCode >= 200 && response[0].statusCode < 300) {

						var results = _.map(response[0].body.results, function(result){
							var photoUrl = false;
							if(result.member_photo && result.member_photo.photo_link) {
								photoUrl = result.member_photo.photo_link;
							}
							return {
								id: result.member.id,
								name: result.member.name,
								guests: result.guests,
								photoUrl: photoUrl,
								platform: 'meetup'
							}
						});
						return results;
					} else {
						throw new Error("Something went wrong");
					}
				})
				return _promise;
			}

		}).then(function(results){
			return res.view('events/attendees', {"attendees":results});
		})


	}
};
