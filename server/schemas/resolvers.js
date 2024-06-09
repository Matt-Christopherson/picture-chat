import { User, Post } from '../models/index.js';
import { signToken } from '../utils/auth.js';
import { AuthenticationError } from 'apollo-server-express';
//import { GraphQLUpload } from 'apollo-server-express';

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

    deletePost: async (_, { postId }) => {
      return await Post.findByIdAndDelete(postId);
    },
    addReaction: async (_, { postId, reactionBody, username }) => {
      const post = await Post.findById(postId);
      if (post) {
        const reaction = {
          reactionBody,
          username,
          createdAt: new Date(),
        };
        post.reactions.push(reaction);
        await post.save();
        return post;
      }
      throw new Error('Post not found');
    },
    deleteReaction: async (_, { postId, reactionId }) => {
      const post = await Post.findById(postId);
      if (post) {
        post.reactions = post.reactions.filter(reaction => reaction._id.toString() !== reactionId);
        await post.save();
        return post;
      }
      throw new Error('Post not found');
      },

      addPost: async (_, { postImage, username }) => {
        const user = await User.findOne({ username });
        if (!user) {
          throw new Error('User not found');
        }
    
        const newPost = new Post({
          postImage,
          user: username,
          createdAt: new Date(),
        });
    
        await newPost.save();
        return newPost;
      },

  },

};

export default resolvers;
