const { Schema, model } = require('mongoose');

const postSchema = new Schema ({
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

const Post = model('Post', postSchema);

module.exports = Post;