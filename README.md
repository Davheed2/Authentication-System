# Project Name
Authentication System with JWT, passport.js, and MongoDB

## Description
This project is an authentication system built using JWT(JSON Web Tokens), Passport.js, and MongoDB as database . It provides secure user authentication and authorization functionalities for your web application.

## Features
<li> User registration with email and password
<li> User login with JWT-based authntication
<li> User profile management
<li> Protected routes for authorized users
<li> MongoDB for storing user data
<li> Express.js for the backend server

## Installation
1. Clone the repository:

``````
git clone https://github.com/Davheed2/authentication-sytem.git
``````

2. Install dependencies:

``````
cd authentication-sytem
npm install
``````

3. Configure the environment variables:
<li> Create a .env file in the root directory.
<li> Add the following variables:

``````
PORT=5000 # Change as needed
ACCESS_SECRET=your_access_secret
REFRESH_SECRET=your_refresh_secret
``````

4. Start the server:

``````
npm start
``````

## Usage
1. Register a new user by making a POST request to /signup with a JSON body containing email and password. You will be given an access and refresh token which will be stored in the httpOnly secure cookie.
2. Authenticate and log in a user by making a POST request to /login with valid credentials. You will be given an access and refresh token which will be stored in the httpOnly secure cookie.
3. Access protected routes by including the JWT token in the Authorization header of your requests.
4. Manage user profiles and data through the appropriate endpoints.

## API Endpoints
<li> POST /signup: Register a new user.
<li> POST /login: Authenticate and log in a user.
<li> GET /logout: De-authenticate a logged in user.
<li> GET /protected: View the protected route.
<li> POST /refresh-token: Get a new access token from valid refresh token.
<li> PUT /profile: Update the user's profile data (protected route).
<li> DELETE /profile: Delete the user's profile data (protected route).

## Dependencies
<li> Express.js: Web application framework.
<li> Passport.js: Authentication middleware.
<li> MongoDB: Database for user data storage.
<li> JWT(jsonwebtoken): Library for JWT generation and verification.

## Contributing
Contributions are welcome! Please follow the <a href="">Contributing Guidelines</a> to get started.

## License
This project is licensed under the <a href="">MIT Licence.</a>

## Contact
<li> Author: David Uchenna
<li> Email: uchennadavid2404@gmail.com
<li> Github: @Davheed2

###
Feel free to reach out if you have any questions or issues related to this project.