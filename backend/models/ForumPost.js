import mongoose from 'mongoose';

const forumPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    thread: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thread'
    },
    votes: {
        up: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        down: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    }
}, { timestamps: true });