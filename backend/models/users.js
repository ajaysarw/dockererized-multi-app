
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    username: {
        type:String,
        require: [true, "User must have username"],
        unique:true
    },
    password: {
        type:String,
        require: [true, "User must have password"]
    }
});


module.exports.UserModel =  mongoose.model("User", schema);