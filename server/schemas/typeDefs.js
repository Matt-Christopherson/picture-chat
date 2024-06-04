const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Upload // Scalar type for file uploads

  type User {
    _id: ID
    username: String
    password: String
    email: String
    post: [Post]!
  }

  type Post {
    _id: ID
    img: String // URL or ID of the uploaded image
    createdAt: String
    user: String
    reactions: [Reactions]!
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(username: String!): User
    post(username: String): [Post]
    me: User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    uploadImage(file: Upload!): String // Mutation for uploading an image
  }
`;

module.exports = typeDefs;


 // addThought(thoughtText: String!): Thought
    // addComment(thoughtId: ID!, commentText: String!): Thought
    // removeThought(thoughtId: ID!): Thought
    // removeComment(thoughtId: ID!, commentId: ID!): Thought