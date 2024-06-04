const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');
const { graphqlUploadExpress } = require('graphql-upload');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
let gfs;

// Initialize GridFS stream once the database connection is open
db.once('open', () => {
  gfs = Grid(db.db, mongoose.mongo);
  gfs.collection('uploads');
  console.log('Connected to MongoDB and GridFS initialized');
});

// Create storage engine for Multer to use GridFS
const storage = new GridFsStorage({
  url: 'mongodb://localhost:27017/mydatabase', // MongoDB connection URL
  file: (req, file) => {
    return {
      bucketName: 'uploads', // Collection name in MongoDB
      filename: `${Date.now()}-${file.originalname}`, // Unique filename
      metadata: { contentType: 'image/jpeg' }, // Metadata, specify JPEG format
    };
  },
});

const upload = multer({ storage }); // Initialize Multer with the GridFS storage

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, gfs, upload }), // Add gfs and upload to context
  uploads: false, // Disable default Apollo upload handling
});

const app = express();
app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 })); // Middleware for handling file uploads
server.applyMiddleware({ app }); // Apply Apollo server middleware to Express app

app.listen({ port: 4000 }, () => {
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
});
