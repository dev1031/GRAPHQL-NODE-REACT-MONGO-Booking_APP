const  mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email : {
        type : String ,
        required : true
    },
    password:{
        type: String,
        required : true
    },
    createdEvents: [
        {
            type : Schema.Types.ObjectId,
            ref : 'Event'
        }
    ]
})

const User = mongoose.model('User' , userSchema);

module.exports = User