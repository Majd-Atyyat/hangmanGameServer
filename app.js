const express = require('express');
const bcrypt = require('bcrypt');
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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
