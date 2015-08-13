/**
* Designation.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    profiles: {
      collection: 'Profile',
      via: 'designation'
    },
    title: {
      type: 'string',
      required: true,
      unique: true
    }
  }
};
