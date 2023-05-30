
# Node.js Mongoose Project

This project is built with Node.js and uses Mongoose as the MongoDB object modeling tool. It provides API endpoints for user registration, authentication, game creation, and word generation.

## Installation

1. Clone the repository:

git clone https://github.com/your/repository.git

2. Install the dependencies:

cd project-directory
npm install

3. Start the server:
npm start


The server will start running on `http://localhost:5000`.

## API Endpoints

### User Registration

- `POST /register`
https://hangman-serve-pwc-majd.onrender.com/register

Register a new user with email and password.

### User Login

- `POST /login`
https://hangman-serve-pwc-majd.onrender.com/login

Authenticate the user with email and password and return a JWT token.

### Authentication Endpoint

- `GET /auth-endpoint`
https://hangman-serve-pwc-majd.onrender.com/auth-endpoint
A protected endpoint that requires a valid JWT token to access.

### Game

- `POST /game`
https://hangman-serve-pwc-majd.onrender.com/game
Create a new game by providing the length of the word. Requires authentication.

- `GET /game/:id`
https://hangman-serve-pwc-majd.onrender.com/game/:id
Get the details of a game by its ID.

- `PUT /game/:id/guess`

Update a game with a guess. Requires authentication.

### Word

- `GET /word`
https://hangman-serve-pwc-majd.onrender.com/word
Generate a random word.  you should specify the length of the word as a query parameter.

## Guessing Endpoint

- `PUT /game/:id/guess`
http://hangman-serve-pwc-majd.onrender.com/game/:id/guess
Update a game with a guess. Requires authentication.

Example Request Body:
```json
{
 "guess": "a"
}

## Dependencies

- [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js.
- [Bcrypt](https://www.npmjs.com/package/bcrypt) - Library for hashing passwords.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - Implementation of JSON Web Tokens (JWT) for Node.js.
- [Mongoose](https://mongoosejs.com/) - Elegant MongoDB object modeling for Node.js.
- [Axios](https://axios-http.com/) - Promise-based HTTP client for Node.js.


