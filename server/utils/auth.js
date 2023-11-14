const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');

// Set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // Added this authentication error to handle unauthorized access
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  }),

  // Authentication middleware function
  authMiddleware: function ({ req, res, next }) {
    // Allows the token to be sent via req.query, req.body, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // Check if the token is included in the Authorization header
    if (req.headers.authorization) {
      // Extract the token from the "Bearer <tokenvalue>" format
      token = token.split(' ').pop().trim();
    }

    // If no token is provided, you can handle it based on your requirements
    if (!token) {
      // You can either return an error response or continue without authentication
      // For simplicity, returning the original request object without modification
      return req;
    }

    // Verify the token and extract user data
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch (error) {
      console.log('Invalid token');
      // Handle invalid tokens based on your requirements
      // You might want to send an error response or take other actions
    }

    // Continue to the next middleware or resolver
    return req;
  },

  // Function to sign a JWT token
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    // Sign the token with the payload, secret, and expiration
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
