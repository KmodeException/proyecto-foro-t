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
    },
    votes: {
        up: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        down: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true }
});

forumCommentSchema.virtual('replies', {
    ref: 'ForumComment',
    localField: '_id',
    foreignField: 'parentComment'
});

const ForumComment = mongoose.model('ForumComment', forumCommentSchema);
export default ForumComment;