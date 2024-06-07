import { gql } from 'apollo-server-express';

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

   input AddPostInput {
    postImage: String!
    username: String!
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
    addPost(input: AddPostInput!): Post
    deletePost(postId: ID!): Post
    addReaction(postId: ID!, reactionBody: String!, username: String!): Post
    deleteReaction(postId: ID!, reactionId: ID!): Post
  }
`;

export default typeDefs;


// uploadImage(file: Upload!): String