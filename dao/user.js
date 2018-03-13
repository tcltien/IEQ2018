'use strict'

var database = require('../db');
var mongodb = require('mongodb');
var constants = require('../model/constants');

module.exports.showAll = function(callback) {
    var db = database.getDb();
    db.collection(constants.userCollection).find().toArray(callback);
        
};
module.exports.save = function(user, type, callback) {
    var db = database.getDb();
    if (type === "register") {
        db.collection(constants.userCollection).insert(user, callback);
    } else {
        var query = { _id: new mongodb.ObjectID(user._id) };
        var newValues = { $set: {name: user.name, phone: user.phone } };
        db.collection(constants.userCollection).updateOne(query, newValues , callback);
    }
    
}

module.exports.delete = function(_id, callback) {
    var db = database.getDb();
    var query = { _id: new mongodb.ObjectID(_id) };    
    db.collection(constants.userCollection).deleteOne(query, callback);
}

module.exports.find = function(_id, callback) {
    var db = database.getDb();
    var query = { _id: new mongodb.ObjectID(_id) };    
    db.collection(constants.userCollection).find(query).toArray(callback);
}

