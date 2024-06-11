// import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from 'mongoose';

export default async function connect(){
  // const mongoServer = await MongoMemoryServer.create();
  // const mongoUri = mongoServer.getUri();

  // await mongoose.connect(mongoUri, { dbName: "picture-chat"});
  // console.log(`MongoDB connected to ${mongoUri}`);
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/picture-chat', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
};


// config.js
