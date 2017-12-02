var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
        username : String,
        fullname : String,
        email : String,
        password: String
    },
    {
        timestamps : {createdAt : 'created', updatedAt : 'updated'}
    });

var User = mongoose.model('User', UserSchema);

module.exports = {
    'User' : User
}