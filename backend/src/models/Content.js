const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    influencerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Influencer',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['video', 'post', 'story'],
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'concept_review', 'script_review', 'video_review', 'approved', 'rejected', 'published'],
        default: 'draft'
    },
    timeline: {
        conceptSubmitted: Date,
        conceptReviewed: Date,
        scriptSubmitted: Date,
        scriptReviewed: Date,
        videoSubmitted: Date,
        videoReviewed: Date,
        published: Date
    },
    reviews: [{
        stage: {
            type: String,
            enum: ['concept', 'script', 'video']
        },
        reviewer: String,
        feedback: String,
        aiAnalysis: {
            score: Number,
            feedback: String,
            brandSafetyCheck: Boolean
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    metrics: {
        views: Number,
        likes: Number,
        comments: Number,
        engagement: Number,
        updateDate: Date
    },
    adCodes: [{
        code: String,
        url: String,
        clicks: Number
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add index for faster queries
contentSchema.index({ influencerId: 1, status: 1 });
contentSchema.index({ 'adCodes.code': 1 });

module.exports = mongoose.model('Content', contentSchema);
