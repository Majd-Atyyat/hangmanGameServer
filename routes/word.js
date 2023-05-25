const express = require('express');
const axios = require('axios');
const router = express.Router();


router.get('/word', async (req, res) => {
    try {
      const { length } = req.query;
  
      // Generate a random word from the Datamuse API
      const response = await axios.get(`https://api.datamuse.com/words?sp=${'?'.repeat(length)}&max=100`);
  
      if (!response.data || response.data.length === 0) {
        return res.status(500).json({ error: 'Failed to generate a word.' });
      }
  
      // Choose a random word from the API response
      const words = response.data.map(entry => entry.word);
      const word = words[Math.floor(Math.random() * words.length)];
  
      res.json({ word });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate a word.' });
    }
  });
  

module.exports = router;
