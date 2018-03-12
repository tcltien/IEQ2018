var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var constants = require('./model/constants');
var db;

module.exports.connectDatabase = function(done) {
    if (db) return done();
    mongoClient.connect(constants.mongoUrl, (err, client) => {
        if (err) return done(err);
        db =  client.db(constants.dbName);
        done();
    });
};

module.exports.getDb = function() {
    return db;
}

module.exports.close = function(done) {
    if (db) {
      db.close(function(err, result) {  
        if (err) return err;
        console.log("Close connection")
      })
    }
}
