import { Schema, model } from 'mongoose';

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
    get: (createdAtVal) => dateFormat(createdAtVal),
  },
});

const postSchema = new Schema ({
  postId: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  
    postImage: {
        type: String,
        requried: 'You must draw something!',
    },

    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => dateFormat(createdAtVal),
      },

      user: {
        type: String,
        required: true,
      },

      reactions: [reactionSchema],
})


const Post = model('Post', postSchema);

export default Post;