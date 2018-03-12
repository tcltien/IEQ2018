'use strict'

var fs = require('fs');
var User = require('../model/user');
var userDAO = require("../dao/user");
var constants = require('../model/constants');


module.exports.showAll = function(req, res) {
    userDAO.showAll(function(err, data){
        if (err) throw err;
        var result = {
            success: 'true',
            users: data
        }
        res.json(result);
    });
}

module.exports.register = function(req, res) {
    var img = req.body.imageCaptureSource;
    var data = img.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer(data, 'base64');
    var fileName = req.body.name + '-' + req.body.phone + '-' + req.body.dateTime +'.png' ;   
    var newUser  = new User(null, req.body.name, req.body.phone, fileName, req.body.dateTime);

    // saving user to database
    userDAO.save(newUser, "register", function(err, data){
        if (err) res.send("error");
        var result = {
            success: 'true',
            users: data
        }
        //save image to file 
        fs.writeFile(constants.imageDir + fileName ,buf, (err) => {
            if (err) throw err;
            console.log('The image filename ' + fileName + ' has been saved!');
        });
        res.json(result);
    })  
};

module.exports.update = function(req, res) {
    var newUser  = new User(req.body._id, req.body.name, req.body.phone, '', '');
    userDAO.save(newUser, "update", function(err, data){
        if (err) res.send("error");
        var result = {
            success: 'true'
        }
        res.json(result);
    })
};

module.exports.delete = function(req, res) {
    userDAO.find(req.query._id, function(err, data){
        userDAO.delete(req.query._id, function(err, result){
            if (err) res.send("error");
            if (fs.existsSync('./public/images/' + data[0].imageSource)) {
                fs.unlinkSync('./public/images/' + data[0].imageSource)
                var result = {
                    success: 'true'
                }
                res.json(result);
            } else {
                res.send("error");
            }
           
        })
    })

    
}