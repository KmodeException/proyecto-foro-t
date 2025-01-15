import mongoose from 'mongoose';

const translationSchema = new mongoose.Schema({
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    },
    originalText: {
        type: String,
        required: true
    },
    translatedText: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true,
        enum: ['menu', 'dialogs', 'items', 'misc']
    },
    status: {
        type: String,
        enum: ['pending', 'in_review', 'approved', 'rejected'],
        default: 'pending'
    },
    translator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    version: {
        type: Number,
        default: 1
    },
    changes: [{
        version: Number,
        translatedText: String,
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
        notes: String
    }]
}, { timestamps: true });

export default mongoose.model('Translation', translationSchema);