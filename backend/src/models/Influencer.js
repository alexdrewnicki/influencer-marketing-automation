const mongoose = require('mongoose');

const influencerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    channelName: {
        type: String,
        required: true
    },
    youtubeLink: String,
    status: {
        type: String,
        enum: ['pending', 'active', 'paused', 'terminated'],
        default: 'pending'
    },
    metrics: {
        subscribers: Number,
        averageViews: Number,
        engagementRate: Number
    },
    content: [{
        title: String,
        status: {
            type: String,
            enum: ['draft', 'submitted', 'approved', 'rejected', 'published'],
            default: 'draft'
        },
        submissionDate: Date,
        reviewDate: Date,
        feedback: String
    }],
    contract: {
        status: {
            type: String,
            enum: ['pending', 'sent', 'signed', 'expired'],
            default: 'pending'
        },
        signedDate: Date,
        expiryDate: Date
    },
    payments: [{
        amount: Number,
        date: Date,
        status: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending'
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Influencer', influencerSchema);
