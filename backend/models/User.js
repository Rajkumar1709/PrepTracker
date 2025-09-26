// models/User.js

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  // You can add more fields here later, like email and password
  // for a full authentication system.
});

const User = mongoose.model('User', userSchema);

export default User;