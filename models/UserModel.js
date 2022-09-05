const mongoose = require('mongoose');

const findOrCreate = require("mongoose-findorcreate");
const UserSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: false
    },
    lastname: {
        type: String,
        required: false
    },
    email: {
        type: String,
        
    },
    password: {
        type: String,
        
    },
    profile:{
        _json: {
            sub: {type:String},
            name: {type:String},
            given_name:{type:String},
            family_name: {type:String},
            picture: {type:String},
            email: {type:String}
            
          }
    }

});
UserSchema.plugin(findOrCreate),
module.exports = mongoose.model('UserModel', UserSchema, 'Users');