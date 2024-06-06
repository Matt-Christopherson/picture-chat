import mongoose from 'mongoose';

const db = mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pictureChat', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

// async function db() {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pictureChat', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("Connected to MongoDB");
//   }
//   catch (error) {
//     console.error("Error connecting to MongoDB: ", error);
//   }
// };

export default db;
