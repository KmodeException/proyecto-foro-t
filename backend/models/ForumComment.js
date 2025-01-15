import mongoose from 'mongoose';

const forumCommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ForumPost'
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ForumComment'
    }
}, { timestamps: true });