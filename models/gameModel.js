const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  length: {
    type: Number,
    required: true,
    min: 3,
    max: 7,
  },
  word: {
    type: String,
    required: true,
  },
  guesses: {
    type: [String],
    default: [],
  },
  correctGuesses: {
    type: [String],
    default: [],
  },
  incorrectGuesses: {
    type: [String],
    default: [],
  },
  remainingGuesses: {
    type: Number,
    required: true,
    default: 6,
  },
  status: {
    type: String,
    required: true,
    enum: ['in progress', 'won', 'lost'],
    default: 'in progress',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
