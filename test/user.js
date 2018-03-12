'user strict'
var should = require('should')
  , DB = require('../db')

var user = require('../dao/user')
var User = require('../model/user');
var mongodb = require('mongodb');

describe('User DAO Tests', function() {

  before(function(done) {
    DB.connectDatabase(done);
  })

  it('get all user', function(done) {
    user.showAll(function(err, users) {
        should.not.exist(null)
        done()
    })
  })

  it('create', function(done) {
    var userObj  = new User(null, 'test', '00033', "", "" );
    user.save(userObj, "register", function(err, id) {
        should(id).not.eql("", id);
        done()
    })
  })

  it('remove', function(done){
      user.showAll(function(err, users){
          var allUsers = users.length;
          user.delete(users[0]._id, function(err){
            user.showAll(function(err, users){
                users.length.should.be.below(allUsers);
                done();
            });
          })
      })
  })

  it('findById', function(done) {
    user.find('5aa67ea362b1b222785482f1', function(err, data) {
        should(data).not.eql("", "Image source");
        done()
    })
  })
})