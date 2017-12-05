var express = require('express');
var UserService = require('../service/user-service');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {

    UserService.allUsers(function (err, users) {
        if (err) {
            return res.json({
                'responseCode': '03',
                'responseMessage': 'Error fetching users'
            });
        }


        if (users) {
            return res.json({
                'responseCode': '00',
                'responseMessage': 'Successfully fetched users',
                'users': users
            });
        }

        return res.json({
            'responseCode': '02',
            'responseMessage': 'No users in db'
        });
    });
});

router.get('/count', function (req, res, next) {

    UserService.countAll(function (err, result) {
        if (err) {
            return res.json({
                'responseCode': '03',
                'responseMessage': 'Error fetching assets total'
            });
        }


        if (result) {
            return res.json({
                'responseCode': '00',
                'responseMessage': 'Successfully fetched assets total',
                'total': result
            });
        }

        return res.json({
            'responseCode': '02',
            'responseMessage': 'No assets in db'
        });
    });
});

//Find One
router.post('/authenticate', function (req, res, next) {
    var data = req.body;
    console.log(data.username);
    UserService.findUser(data.username, function (err, user) {
        if (err) throw err;
        if (!user) {
            res.json({
                responseCode: "02",
                responseMessage: 'Authentication failed. User not found.',
            });
        } else if (user) {
            // check if username matches
            if (user.password != req.body.password) {
                res.json({
                    responseCode: "03",
                    responseMessage: 'Authentication failed. Password not found.',
                });
            } else {
                // if user is found and password is right
                // return the information including token as JSON
                res.json({
                    responseCode: "00",
                    responseMessage: "Authentication Successful",
                    user: user
                });
            }

        }

    })
});

/* POST adds an new user. */
router.post('/', function (req, res, next) {
    var user = req.body;
    console.log(user.username);
    UserService.addUser(user, function (err, users) {
        if (err) {
            return res.json({
                'responseCode': '03',
                'responseMessage': 'Error adding user'
            });
        }

        if (users) {
            return res.json({
                'responseCode': '00',
                'responseMessage': 'Successfully added user'
            });
        }

        return res.json({
            'responseCode': '02',
            'responseMessage': 'User exists already'
        });
    });
})


/* POST updates a user's record. */
router.post('/update', function (req, res, next) {
    var user = req.body;
    console.log(user.merchantId);
    UserService.updateUser(user, function (err, users) {
        if (err) {
            return res.json({
                'responseCode': '03',
                'responseMessage': 'Error adding user'
            });
        }

        if (users) {
            return res.json({
                'responseCode': '00',
                'responseMessage': 'Successfully added user'
            });
        }

        return res.json({
            'responseCode': '02',
            'responseMessage': 'User exists already'
        });
    });
})


/* POST updates a user's record. */
router.post('/secretkey', function (req, res, next) {

    var user = req.body;
    UserService.updateSecretKey(user.merchantId, function (err, users) {
        if (err) {
            return res.json({
                'responseCode': '03',
                'responseMessage': 'Error updating user'
            });
        }

        if (users) {
            console.log(users);
            return res.json({
                'responseCode': '00',
                'responseMessage': 'Successfully updated user'
            });
        }

        return res.json({
            'responseCode': '02',
            'responseMessage': 'Could not update user record'
        });
    });
})


/* POST deletes a user's record. */
router.delete('/:id', function (req, res, next) {
    var id = req.params.id;
    console.log(id);
    UserService.deleteUser(id, function (err) {
        if (err) {
            return res.json({
                'responseCode': '03',
                'responseMessage': 'Error deleting user'
            });
        }

        return res.json({
            'responseCode': '00',
            'responseMessage': 'Successfully deleted user'
        });
    });
})

module.exports = router;
