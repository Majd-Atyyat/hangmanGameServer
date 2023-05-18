const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const dbConnect = require('./db/dbConnect');

const User = require('./db/userModel');

const app = express();
const port = 5000;

// Middleware
app.use(express.json());

// Database connection
dbConnect();

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
    // check if email exists
    User.findOne({ email: request.body.email })
  
      // if email exists
      .then((user) => {
        // compare the password entered and the hashed password found
        bcrypt
          .compare(request.body.password, user.password)
  
          // if the passwords match
          .then((passwordCheck) => {
  
            // check if password matches
            if(!passwordCheck) {
              return response.status(400).send({
                message: "Passwords does not match",
                error,
              });
            }
  
            //   create JWT token
            const token = jwt.sign(
              {
                userId: user._id,
                userEmail: user.email,
              },
              "RANDOM-TOKEN",
              { expiresIn: "24h" }
            );
  
            //   return success response
            response.status(200).send({
              message: "Login Successful",
              email: user.email,
              token,
            });
          })
          // catch error if password does not match
          .catch((error) => {
            response.status(400).send({
              message: "Passwords does not match",
              error,
            });
          });
      })
      // catch error if email does not exist
      .catch((e) => {
        response.status(404).send({
          message: "Email not found",
          e,
        });
      });
  });
  

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
