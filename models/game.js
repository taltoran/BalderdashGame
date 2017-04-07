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
  gameEnd: {type: Date, default: Date.now},
  gameActive: {type: Boolean, default: false},
  gameFull: {type: Boolean, default: false},
  players:  [String]
}));