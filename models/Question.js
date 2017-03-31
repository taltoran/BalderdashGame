var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var questionSchema = new mongoose.Schema({
    id: ObjectId,
    question: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    answer: { type: String, required: true }
});

var categorySchema = new mongoose.Schema({
  categories:[{
  ludicrousLaws: String,
  definitions: String,
  famousPeople: String,
  acronyms: String,
  movieHeadlines: String}]
})

var Category = mongoose.model('categories', categorySchema);
var Question = mongoose.model('questions', questionSchema);
module.exports = Question;
module.exports = Category;