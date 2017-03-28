var mongoose = require('mongoose');
var schema = mongoose.Schema;
var ObjectId = schema.ObjectId;

// The User model
module.exports.User = mongoose.model('User', new schema({
  id:           ObjectId,
  fname:        { type: String, required: '{PATH} is required.' },
  lname:        { type: String, required: '{PATH} is required.' },
  email:        { type: String, required: '{PATH} is required.', unique: true },
  username:     { type: String, required: '{PATH} is required.', unique: true },
  password:     { type: String, required: '{PATH} is required.' },
  gameswon:     { type: Number },
  data:         Object,
}))

module.exports.Question = mongoose.model('Question', new schema({
    id:         ObjectId,
    question:   { type: String, required: true, unique: true },
    category:   { type: String, required: true },
    answer:     { type: String, required: true }
}))