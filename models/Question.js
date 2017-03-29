var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var questionSchema = new mongoose.Schema({
    id: ObjectId,
    question: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    answer: { type: String, required: true }
});

var Question = mongoose.model('questions', questionSchema);
module.exports = Question;