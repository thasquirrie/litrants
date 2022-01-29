const mongoose = require('mongoose');

const followingSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      required: [true, 'A following must include a user with an ID'],
    },
    username: {
      type: String,
      required: [true, 'The username of a follower is needed'],
    },
    followed: {
      type: Boolean,
      default: false,
    },
    dateFollowed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Following = mongoose.model('Following', followingSchema);
module.exports = Following;
