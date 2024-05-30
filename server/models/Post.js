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

      username: {
        type: String,
        required: true,
      },
})

const Post = model('Post', postSchema);

module.exports = Post;