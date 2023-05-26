const express = require('express');
const router = express.Router();
const Game = require('../models/gameModel');
const axios = require('axios');
const jwt = require("jsonwebtoken");

// Authentication middleware
const auth = (req, res, next) => {
  try {
    // Get the token from the authorization header
    const token = req.headers.authorization.split(" ")[1];

    // Verify the token
    const decodedToken = jwt.verify(token, "RANDOM-TOKEN");

    // Extract the userId from the decoded token
    const userId = decodedToken.userId;

    // Attach the userId to the request object
    req.userId = userId;

    // Logging statement
    console.log("Authenticated user with userId:", userId);

    // Proceed to the next middleware
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Create a new game
router.post('/game', auth, async (req, res) => {
    try {
      const { length } = req.body;
      const userId = req.userId;
  
      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${req.headers.authorization.split(" ")[1]}`, // Add the token to the request header
        },
      };
  
      
     
    // Call the word API to generate a random word
    const response = await axios.get(`http://localhost:5000/word?length=${length}`, axiosConfig);

    if (!response.data || !response.data.word) {
      return res.status(500).json({ error: 'Failed to generate a word.' });
    }

    const word = response.data.word;

   // Create a new game document
   const game = new Game({
    length,
    word,
    guesses: [],
    correctGuesses: [],
    incorrectGuesses: [],
    remainingGuesses: 6,
    status: 'in progress',
    userId,
  });

     // Save the game to the database
    await game.save();

    res.status(201).json(game);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create a new game.' });
  }
});
// Get game details
router.get('/game/:id', async (req, res) => {
  try {
    const gameId = req.params.id;

    // Find the game by its ID
    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ error: 'Game not found.' });
    }

    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch game details.' });
  }
});

// Update game with a guess
router.put('/game/:id/guess', async (req, res) => {
  try {
    const gameId = req.params.id;
    const { guess } = req.body;


    // Find the game by its ID
    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ error: 'Game not found.' });
    }

    // Check if the game is already over
    if (game.status !== 'in progress') {
      return res.status(400).json({ error: 'Game is already over.' });
    }

    // Update the game based on the guess
    game.guesses.push(guess);

    if (game.word.includes(guess)) {
      game.correctGuesses.push(guess);
    } else {
      game.incorrectGuesses.push(guess);
      game.remainingGuesses -= 1;
    }

    // Check if the game is won or lost
    if (game.correctGuesses.length === game.word.length) {
      game.status = 'won';
    } else if (game.remainingGuesses === 0) {
      game.status = 'lost';
    }

    // Save the updated game to the database
    await game.save();

    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update game.' });
  }
});

module.exports = router;
