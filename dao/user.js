'use strict'

var database = require('../db');
var mongodb = require('mongodb');

module.exports.showAll = function(callback) {
    var db = database.getDb();
    db.collection('users').find().toArray(callback);
        
};
module.exports.save = function(user, type, callback) {
    var db = database.getDb();
    if (type === "register") {
        db.collection('users').insert(user, callback);
    } else {
        var query = { _id: new mongodb.ObjectID(user._id) };
        var newValues = { $set: {name: user.name, phone: user.phone } };
        db.collection('users').updateOne(query, newValues , callback);
    }
    
}

module.exports.delete = function(_id, callback) {
    var db = database.getDb();
    var query = { _id: new mongodb.ObjectID(_id) };    
    db.collection('users').deleteOne(query, callback);
}

module.exports.find = function(_id, callback) {
    var db = database.getDb();
    var query = { _id: new mongodb.ObjectID(_id) };    
    db.collection('users').find(query).toArray(callback);
}

