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
  var users = [
    {username: 'Chee', email: 'chee@zv.sg', password: 'pass1234'},
    {username: 'Zhi', email: 'zhi@zv.sg', password: 'pass1234'},
    {username: 'Qu', email: 'qu@zv.sg', password: 'pass1234'},
    {username: 'Lu', email: 'lu@zv.sg', password: 'pass1234'},
    {username: 'Ah', email: 'ah@zv.sg', password: 'pass1234'}
  ];

  var profiles = [
    {name: "Cheese", designation: "Baker", industry: "Food and Beverage", user: 1},
    {name: "Orange", designation: "Farmer", industry: "Food and Beverage", user: 2},
    {name: "Apple", designation: "Picker", industry: "Food and Beverage", user: 3},
    {name: "Pineapple", designation:"Poker", industry: "Food and Beverage", user: 4},
    {name: "Ang", designation: "CEO", industry: "Startup", user: 5},
  ];

  var passports = [
    {protocol: 'local', password: 'pass1234', user: 1},
    {protocol: 'local', password: 'pass1234', user: 2},
    {protocol: 'local', password: 'pass1234', user: 3},
    {protocol: 'local', password: 'pass1234', user: 4},
    {protocol: 'local', password: 'pass1234', user: 5},
  ]


  User.create(users).then(function(newUsers){
    Passport.create(passports).exec(function(){});
    Handshake.initiate(1, [1,2,3,4], function(err,savedUser){
      Handshake.initiate(2, [1,2,3,4], function(err, savedUser){
        Handshake.initiate(3, [1,2,3,4], function(err, savedUser){
          Handshake.initiate(4, [1,2,3,4], function(){})
        })
      });
      Profile.create(profiles).exec(function(){});
    })
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
