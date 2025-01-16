import mongoose from 'mongoose';

const translationSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    },
    translator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

const Translation = mongoose.model('Translation', translationSchema);
export default Translation;