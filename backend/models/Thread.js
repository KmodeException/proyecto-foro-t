import mongoose from 'mongoose';

const threadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        enum: ['official', 'community'],
        default: 'community'
    },
    rules: [String],
    moderators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

const Thread = mongoose.model('Thread', threadSchema);
export default Thread;