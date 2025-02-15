// backend/forum/models/Comment.js
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  datePublished: {
    type: Date,
    default: Date.now
  },
  // Polimorfismo para comentarios en videojuegos, traducciones o posts
  commentableType: {
    type: String,
    enum: ['Game', 'Translation', 'ForumPost'],
  },
  commentableId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'commentableType'
  },
  votes: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['up', 'down'],
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ForumPost',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;