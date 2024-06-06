//needed requires to run server
import express from 'express';
import mongoose from 'mongoose';
import Grid from 'gridfs-stream';
import { GridFsStorage } from 'multer-gridfs-storage';
import multer from 'multer';
import graphqlUploadExpress from 'graphql-upload/Upload.mjs';
import { ApolloServer } from "apollo-server-express";
import path from 'path';
import { authMiddleware } from './utils/auth.js';
import { typeDefs, resolvers } from './schemas/index.js';
import db from './config/connection.js';

const PORT = process.env.PORT || 3001;
const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
  //context: ({ req }) => ({ req, gfs, upload }), // Add gfs and upload to context
  //uploads: false, // Disable default Apollo upload handling
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 })); // Middleware for handling file uploads

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
};

// Create storage engine for Multer to use GridFS
const storage = new GridFsStorage({
  url: 'mongodb://localhost:27017/pictureChat', // MongoDB connection URL
  file: (req, file) => {
    return {
      bucketName: 'uploads', // Collection name in MongoDB
      filename: `${Date.now()}-${file.originalname}`, // Unique filename
      metadata: { contentType: 'image/jpeg' }, // Metadata, specify JPEG format
    };
  },
});

const upload = multer({ storage }); // Initialize Multer with the GridFS storage

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  let gfs;

  //db.once("open", () => {
    app.listen(PORT, () => {
      //gfs = Grid(db.db, mongoose.mongo);
      //gfs.collection('uploads');
      console.log(`Server now running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`)
    });
 // });
};

//start apollo server
startApolloServer(typeDefs, resolvers);

// app.listen({ port: 4000 }, () => {
//   console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
// });

