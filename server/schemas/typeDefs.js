const { gql } = require('apollo-server-express');

//   scalar Upload
const typeDefs = gql`

  type User {
    _id: ID
    username: String
    password: String
    email: String
    post: [Post]!
  }

  type Post {
    _id: ID
    img: String
    createdAt: String
    user: String
    reactions: [Reactions]!
  }

  type Reactions {
    reactionBody: String
    username: String
    createdAt: String
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

  }
`;

module.exports = typeDefs;


// uploadImage(file: Upload!): String