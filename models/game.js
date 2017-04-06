var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

module.exports = mongoose.model('Game', new Schema({
  //gameHost: String,
  playerNumber: String,
  rounds:  String,
  category: [String],
  gameName: String,
  winners: [String],
  questions: Number,
  gameEnd: Date,
  gameActive: {type: Boolean, default: false},
  gameFull: {type: Boolean, default: false},
  players:  [{ 
    content: { type: String },
    score: { type: String },
    date: { type: Date, default: Date.now }
  }]
}));