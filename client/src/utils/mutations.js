import { gql } from '@apollo/client';

// Mutations
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const DELETE_POST = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId) {
      _id
      postImage
      user
      createdAt
    }
  }
`;

export const ADD_REACTION = gql`
  mutation addReaction($postId: ID!, $reactionBody: String!, $username: String!) {
    addReaction(postId: $postId, reactionBody: $reactionBody, username: $username) {
      _id
      postImage
      user
      createdAt
      reactions {
        _id
        reactionBody
        username
        createdAt
      }
    }
  }
`;

export const DELETE_REACTION = gql`
  mutation deleteReaction($postId: ID!, $reactionId: ID!) {
    deleteReaction(postId: $postId, reactionId: $reactionId) {
      _id
      postImage
      user
      createdAt
      reactions {
        _id
        reactionBody
        username
        createdAt
      }
    }
  }
`;

export const ADD_POST = gql`
  mutation addPost($postImage: String!, $username: String!) {
    addPost(postImage: $postImage, username: $username) {
      postId
      postImage
      user
      createdAt
      reactions {
        reactionId
        reactionBody
        username
        createdAt
      }
    }
  }
`;

