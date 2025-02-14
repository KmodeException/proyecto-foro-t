import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  voteType: {
    type: String,
    enum: ['up', 'down'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  // Polimorfismo para votos en comentarios, traducciones o posts
  voteableType: {
    type: String,
    enum: ['Comment', 'Translation', 'ForumPost'],
    required: true
  },
  voteableId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'voteableType'
  }
});

const Vote = mongoose.model('Vote', voteSchema);

export default Vote; 