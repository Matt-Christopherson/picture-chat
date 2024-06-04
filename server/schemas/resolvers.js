const { User, Post } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');
const { GraphQLUpload } = require('apollo-server-express');

const resolvers = {
  //Upload: GraphQLUpload, // Define the Upload scalar

  Query: {
    users: async () => {
      return User.find(); // Fetch all users
    },
    user: async (parent, { username }) => {
      return User.findOne({ username }); // Fetch a single user by username
    },
    post: async (parent, { username }) => {
      return Post.find({ user: username }); // Fetch posts by username
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findById(context.user._id); // Fetch the currently logged-in user
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user }; // Register a new user
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user }; // Log in a user
    },
    // uploadImage: async (parent, { file }, { gfs }) => {
    //   const { createReadStream, filename, mimetype, encoding } = await file;
    //   const stream = createReadStream();

    //   // Upload to GridFS
    //   const { id } = await new Promise((resolve, reject) => {
    //     const writeStream = gfs.createWriteStream({
    //       filename,
    //       contentType: mimetype, // MIME type of the file
    //     });

    //     stream.pipe(writeStream)
    //       .on('finish', () => resolve({ id: writeStream.id })) // Resolve when the upload finishes
    //       .on('error', reject); // Reject on error
    //   });

    //   return `File uploaded successfully: ${id}`; // Return the ID of the uploaded file
    // },
  },
};

module.exports = resolvers;
