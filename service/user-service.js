var User = require ('../model/user').User;

var UserService = {};

UserService.findUser = function(username, next){
    User.findOne({username : username}, function(err, user){
        return next(err, user);
    });
}

UserService.addUser = function(data, next){
    this.findUser(data.username, function(err, user){
        if(err){
            console.log('Encountered error when searching if the user is in the db already');
            return next(err, null);
        }

        if(user){
            console.log('Username ' + user.username + ' exists already.');
            return next(null, null);
        }
        else{
            /*Add user to db*/

            var newUser = new User({
                username: data.username,
                fullname: data.fullname,
                email: data.email,
                password: data.password
            });

            newUser.save(function(err, user){
                return next(err, user);
            })
        }
    })
}

UserService.checkUser = function(data, next){
    this.findUser(data.username, function(err, user){
        if(err){
            console.log('Encountered error when searching if the user is in the db already');
            return next(err, null);
        }

        if(user){
            console.log('User with merchantId ' + user.username + ' exists already.');
            return next(null, null);
        }
        else{
            /*Add user to db*/

            var newUser = new User({
                username: data.username,
                fullname: data.fullname,
                email: data.email,
                password: data.password
            });

            newUser.save(function(err, user){
                return next(err, user);
            })
        }
    })
}

UserService.allUsers = function(next){
    User.find(function(err, users){
        return next(err, users);
    });
}

UserService.updateUser = function(userdata, next){

    User.update({"merchantId" : userdata.merchantId}, {$set : {"url" : userdata.url}}, function(err, user){
        return next(err, user);
    })
}

UserService.countAll = function(next){
    User.count(function(err,asset){
        return next(err,asset);
    })
}

UserService.deleteUser = function (id, next) {

    User.remove({"_id" : id}, function (err) {
        return next(err);
    });
}

// UserService.updateSecretKey = function(merchantId, next){

//     User.update({"merchantId" : merchantId}, {$set : {"secretKey" : randomstring.generate()}}, function(err, user){
//         return next(err, user);
//     })
// }

module.exports = UserService;