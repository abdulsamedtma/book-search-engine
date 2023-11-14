const { User } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    // Resolver for fetching user information (me)
    me: async (parent, args, context) => {
      if (context.user) {
        // If the user is authenticated, fetch and return user data (excluding sensitive information)
        const userData = await User.findOne({ _id: context.user._id }).select(
          "-__v -password"
        );
        return userData;
      }
      // Throw an authentication error if the user is not logged in
      throw new AuthenticationError("Not logged in");
    },
  },

  Mutation: {
    // Resolver for adding a new user
    addUser: async (parent, args) => {
      // Create a new user based on the provided arguments
      const user = await User.create(args);
      // Generate a JWT token for the new user
      const token = signToken(user);
      // Return the generated token and user data
      return { token, user };
    },

    // Resolver for user login
    login: async (parent, { email, password }) => {
      // Find a user with the provided email
      const user = await User.findOne({ email });

      // Throw an authentication error if the user is not found
      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      // Check if the provided password is correct
      const correctPw = await user.isCorrectPassword(password);
      
      // Throw an authentication error if the password is incorrect
      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      // Generate a JWT token for the authenticated user
      const token = signToken(user);
      
      // Return the generated token and user data
      return { token, user };
    },

    // Resolver for saving a book to a user's list
    saveBook: async (parent, { input }, context) => {
      console.log("Received Book Data:", input);
      
      // Check if the user is logged in
      if (context.user) {
        // Update the user's data by pushing the new book to the savedBooks array
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: input } },
          { new: true }
        );
        
        console.log("Updated user data:", input);
        
        // Return the updated user data
        return updatedUser;
      }

      // Throw an authentication error if the user is not logged in
      throw new AuthenticationError("You need to be logged in!");
    },

    // Resolver for removing a book from a user's list
    removeBook: async (parent, { bookId }, context) => {
      // Check if the user is logged in
      if (context.user) {
        // Update the user's data by pulling the book with the given bookId from the savedBooks array
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        );
        
        // Return the updated user data
        return updatedUser;
      }

      // Throw an authentication error if the user is not logged in
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
