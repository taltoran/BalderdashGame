var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
var ObjectId = Schema.ObjectId;

module.exports = mongoose.model('Game', new Schema({
  //gameHost: String,
  id: ObjectId,
  playerNumber: String,
  rounds:  String,
  category: [String],
  gameName: String,
  winner: String,
  questions: Number,
  gameEnd: Date,
  players:  [{ 
    content: { type: String },
    score: { type: String },
    date: { type: Date, default: Date.now }
  }]
}));