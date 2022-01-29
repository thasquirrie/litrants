const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A post needs a title'],
  },
  author: {
    type: mongoose.Schema.ObjectId,
  },
});
