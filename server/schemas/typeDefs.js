const typeDefs = `
  type User {
    _id: ID
    username: String
    password: String
    email: String
    post: [Post]!
  }

  type Post {
    _id: ID
    postImg: String
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

  }
`;
    // addThought(thoughtText: String!): Thought
    // addComment(thoughtId: ID!, commentText: String!): Thought
    // removeThought(thoughtId: ID!): Thought
    // removeComment(thoughtId: ID!, commentId: ID!): Thought
module.exports = typeDefs;