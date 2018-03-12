var express = require('express');
var router = express.Router();

var userController = require('../controllers/userController');

/* POST register user. */
router.post('/register', userController.register);
router.get('/showAll', userController.showAll);
router.post('/update', userController.update);
router.get('/delete', userController.delete);

module.exports = router;
