var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email:{
        type: String,
        trim: true,
        index: true,
        unique: true,
        required: true,
    },  
    password:{
        type: String,
        required: true,
        trim: true,
    },
    mobile:{
        type: String,
        trim:true,
    }
})

module.exports = mongoose.model("User",UserSchema)