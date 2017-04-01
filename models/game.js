var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

module.exports = mongoose.model('Game', new Schema({
  //gameHost: String,
  playerNumber: String,
  rounds:  String,
  category:[{
    ludicrousLaws: String,
    definitions: String,
    famousPeople: String,
    acronyms: String,
    movieHeadlines: String
  }],
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