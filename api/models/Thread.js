/**
* Thread.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    messages: {
      collection: 'Message',
      via: 'thread'
    },
    threadParticipants: {
      type: 'array',
      unique: true,
      required: true,
    }
  }
};
