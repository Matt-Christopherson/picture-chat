import { Schema, model, Types } from 'mongoose';
import  dateFormat from '../utils/dateFormat.js';

const reactionSchema = new Schema({
  reactionId: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  reactionBody: {
    type: String,
    required: true,
    maxlength: 280,
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => dateFormat(timestamp),
  },
});

const postSchema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  postImage: {
    type: String,
    required: true,
  }, // Store base64-encoded image data
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => dateFormat(timestamp),
  },
  user: {
    type: String,
    required: true,
  },
  reactions: [reactionSchema],
});

const Post = model('Post', postSchema);

export default Post;
