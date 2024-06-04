//needed requires to run server
const express = require('express');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');
//const { graphqlUploadExpress } = require('graphql-upload');
const { ApolloServer } = require("apollo-server-express");
const path = require('path');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
};

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/"));
});

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`Server now running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`)
    });
  });
};

//start apollo server
startApolloServer(typeDefs, resolvers);

// const express = require('express');
// const { ApolloServer } = require('apollo-server-express');
// const mongoose = require('mongoose');
// const Grid = require('gridfs-stream');
// const { GridFsStorage } = require('multer-gridfs-storage');
// const multer = require('multer');
// const { graphqlUploadExpress } = require('graphql-upload');
// const typeDefs = require('./typeDefs');
// const resolvers = require('./resolvers');

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/mydatabase', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const db = mongoose.connection;
// let gfs;

// // Initialize GridFS stream once the database connection is open
// db.once('open', () => {
//   gfs = Grid(db.db, mongoose.mongo);
//   gfs.collection('uploads');
//   console.log('Connected to MongoDB and GridFS initialized');
// });

// // Create storage engine for Multer to use GridFS
// const storage = new GridFsStorage({
//   url: 'mongodb://localhost:27017/mydatabase', // MongoDB connection URL
//   file: (req, file) => {
//     return {
//       bucketName: 'uploads', // Collection name in MongoDB
//       filename: `${Date.now()}-${file.originalname}`, // Unique filename
//       metadata: { contentType: 'image/jpeg' }, // Metadata, specify JPEG format
//     };
//   },
// });

// const upload = multer({ storage }); // Initialize Multer with the GridFS storage

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   context: ({ req }) => ({ req, gfs, upload }), // Add gfs and upload to context
//   uploads: false, // Disable default Apollo upload handling
// });

// const app = express();
// app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 })); // Middleware for handling file uploads
// server.applyMiddleware({ app }); // Apply Apollo server middleware to Express app

// app.listen({ port: 4000 }, () => {
//   console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
// });

