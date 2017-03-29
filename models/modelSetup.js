var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
/**
 * Our User model.
 *
 * This is how we create, edit, delete, and retrieve user accounts via MongoDB.
 */
// The User model
module.exports.User = mongoose.model('User', new Schema({
  id:           ObjectId,
  fname:        { type: String, required: '{PATH} is required.' },
  lname:        { type: String, required: '{PATH} is required.' },
  email:        { type: String, required: '{PATH} is required.', unique: true },
  username:     { type: String, required: '{PATH} is required.', unique: true },
  password:     { type: String, required: '{PATH} is required.' },
  data:         Object,
}));


var userSchema = new Schema({
    id:           ObjectId,
    fname:        { type: String, required: '{PATH} is required.' },
    lname:        { type: String, required: '{PATH} is required.' },
    email:        { type: String, required: '{PATH} is required.', unique: true },
    username:     { type: String, required: '{PATH} is required.', unique: true },
    password:     { type: String, required: '{PATH} is required.' },
    gamesWon:     { type: String },
    data:         Object,
});

var questionSchema = new Schema({
    id:         ObjectId,
    question:   { type: String, required: true, unique: true },
    category:   { type: String, required: true },
    answer:     { type: String, required: true }
});

var gamesSchema = new Schema({
    id:             ObjectId,
    gameName:       { type: String, required: true, unique: true },
    winningScore:   { type: String, required: true }
});



//var user = mongoose.model('user', userSchema);
//exports.user = user;

module.exports = mongoose.model('user', userSchema);
module.exports = mongoose.model('questions', questionSchema);