//needed requires to run server
import express from 'express';
import mongoose from 'mongoose';
import { ApolloServer } from "apollo-server-express";
import path from 'path';
import {fs} from 'fs';
import { authMiddleware } from './utils/auth.js';
import { typeDefs, resolvers } from './schemas/index.js';
import connection from './config/connection.js';

const PORT = process.env.PORT || 3001;
const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
};

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  connection().then(() => {
    try {
      app.listen(PORT, () => {
        console.log(`Server now running on port ${PORT}!`);
      })
    } catch (error) {
      console.log(`No connection ${error}`);
    }
  }).catch((error) => {
    console.log("cant get database");
  });

};

//start apollo server
startApolloServer(typeDefs, resolvers);
