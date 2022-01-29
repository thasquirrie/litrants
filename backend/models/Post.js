const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A post needs a title'],
  },
  author: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'A post must have an author'],
    ref: 'User',
  },
  body: {
    type: String,
    required: [true, 'The body of a post should not be empty'],
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  likes: {
    true: Number,
  },
}, {
  toJSON: {virtuals: true},
  toObject: {virtuals:true}
});

const Post = mongoose.model('Post',postSchema);
module.exports = Post;
