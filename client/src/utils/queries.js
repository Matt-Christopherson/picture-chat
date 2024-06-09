import { gql } from '@apollo/client';
// Queries
export const GET_USERS = gql`
  query users {
    users {
      _id
      username
      email
    }
  }
`;

export const GET_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
    }
  }
`;

export const GET_POSTS_BY_USER = gql`
  query post($username: String!) {
    post(username: $username) {
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

export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
    }
  }
`;

export const GET_POSTS = gql`
  query getPosts {
    posts {
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
