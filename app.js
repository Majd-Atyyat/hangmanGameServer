const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const auth = require("./auth");
const dbConnect = require('./db/dbConnect');
const axios = require("axios");

const User = require('./models/userModel');
const Game = require('./models/gameModel');
const gameRouter = require('./routes/game.js');
const wordRouter = require('./routes/word.js');


const app = express();
const port = 5000;

// Middleware
app.use(express.json());

// Database connection
dbConnect();

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

// Register endpoint
app.post('/register', async (request, response) => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(request.body.password, 10);

    // Create a new user instance and collect the data
    const user = new User({
      email: request.body.email,
      password: hashedPassword,
    });

    // Save the new user
    const result = await user.save();

    // Return success if the new user is added to the database successfully
    response.status(201).send({
      message: 'User Created Successfully',
      result,
    });
  } catch (error) {
    // Catch error if the new user wasn't added successfully to the database
    response.status(500).send({
      message: 'Error creating user',
      error,
    });
  }
});
// login endpoint
app.post("/login", (request, response) => {
  const { email, password } = request.body;

  // Check if email exists
  User.findOne({ email })
    .then((user) => {
      // If email does not exist, return an error
      if (!user) {
        return response.status(404).send({
          message: "Email not found",
        });
      }

      // Compare the provided password with the stored hashed password
      bcrypt.compare(password, user.password)
        .then((isMatch) => {
          // If passwords match, generate a JWT token and return success response
          if (isMatch) {
            const token = jwt.sign(
              {
                userId: user._id,
                userEmail: user.email,
              },
              "RANDOM-TOKEN",
              { expiresIn: "24h" }
            );

            response.status(200).send({
              message: "Login Successful",
              email: user.email,
              token,
            });
          } else {
            // If passwords do not match, return an error
            response.status(400).send({
              message: "Passwords do not match",
            });
          }
        })
        .catch((error) => {
          response.status(500).send({
            message: "Error comparing passwords",
            error,
          });
        });
    })
    .catch((error) => {
      response.status(500).send({
        message: "Error finding user",
        error,
      });
    });
});

// authentication endpoint
app.get("/auth-endpoint", auth, (request, response) => {
  response.json({ message: "You are authorized to access me" });
});



// Include the word router

app.use('/word', wordRouter);

// Include the game router

app.use('/game', gameRouter);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
