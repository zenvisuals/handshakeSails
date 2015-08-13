/**
* Profile.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true
    },
    pictureUrl: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    user: {
      model: 'User',
    },
    designation: {
      model: 'Designation',
    },
    industry: {
      model: 'Industry',
    },
    company: {
      model: 'Company',
    },
  },

  afterCreate: function(value, cb){
    User.update({id:value.user},{profile:value.user}, cb);
  }

};
