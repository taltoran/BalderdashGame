var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
/**
 * Our User model.
 *
 * This is how we create, edit, delete, and retrieve user accounts via MongoDB.
 */
var userSchema = new Schema({
    id: ObjectId,
    userName: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gamesWon: [{ type: String }],
    messages: [{ type: String }]
});

var questionSchema = new Schema({
    id: ObjectId,
    question: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    answer: { type: String, required: true }
});

var gamesSchema = new Schema({
    id: ObjectId,
    gameName: { type: String, required: true, unique: true },
    winningScore: { type: String, required: true }
});



//var user = mongoose.model('user', userSchema);
//exports.user = user;

module.exports = mongoose.model('user', userSchema);
module.exports = mongoose.model('questions', questionSchema);
module.exports = mongoose.model('games', gamesSchema);