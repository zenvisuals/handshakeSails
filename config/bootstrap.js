var data = require('./bootstrapData');
/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {
  sails.services.passport.loadStrategies();
  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  // var storeUsers = [];
  //

  Device.create(data.devices).exec(console.log);


  User.create(data.users).then(function(newUsers){
    Passport.create(data.passports).exec(function(){});
    Handshake.initiate(1, [1,2,3,4], function(err,savedUser){
      Handshake.initiate(2, [1,2,3,4], function(err, savedUser){
        Handshake.initiate(3, [1,2,3,4], function(err, savedUser){
          Handshake.initiate(4, [1,2,3,4], function(){})
        })
      });

    });
    var companies = Company.create(data.companies);
    var designations = Designation.create(data.designations);
    var industries = Industry.create(data.industries);
    return [companies, designations, industries];
  }).spread(function(companies, designations, industries){
    Profile.create(data.profiles).exec(function(){
      Profile.find().populateAll().exec(console.log);
    });
  })

  var threads = [
    {threadParticipants: [1,2]},
    {threadParticipants: [1,3]}
  ];

  Thread.create(threads).then(function(){
    Thread.findOne({
      or: [
        {threadParticipants: {'contains': [1,2]}},
        {threadParticipants: {'contains': [2,1]}}
      ]
    }).populate('messages').exec(function(err, thread){
      console.log(thread);
      thread.messages.add({
        sendingUser: 1,
        content: "Hello there"
      })
      thread.save(console.log);
    });
  })
  console.log('Hosting on: ' + sails.getBaseurl());

  cb();
};
