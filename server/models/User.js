import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trimmed: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must match a valid email address'],
    },
    password: {
        type: String,
        required: true,
        trim: true,
      },
    post: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],

  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);
// Hashes the user's password before saving it to the database
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

// Compares the provided password with the hashed password stored in the database
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);

export default User;