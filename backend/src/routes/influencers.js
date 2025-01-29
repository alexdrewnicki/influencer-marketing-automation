const express = require('express');
const router = express.Router();
const Influencer = require('../models/Influencer');

// Get all influencers with pagination
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const influencers = await Influencer.find()
            .skip(skip)
            .limit(limit)
            .select('-payments'); // Exclude sensitive payment data

        const total = await Influencer.countDocuments();

        res.json({
            data: influencers,
            page,
            totalPages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new influencer
router.post('/', async (req, res) => {
    try {
        const influencer = new Influencer(req.body);
        const result = await influencer.save();
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get influencer by ID
router.get('/:id', async (req, res) => {
    try {
        const influencer = await Influencer.findById(req.params.id);
        if (!influencer) {
            return res.status(404).json({ error: 'Influencer not found' });
        }
        res.json(influencer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update influencer
router.put('/:id', async (req, res) => {
    try {
        const influencer = await Influencer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!influencer) {
            return res.status(404).json({ error: 'Influencer not found' });
        }
        res.json(influencer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update influencer status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const influencer = await Influencer.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!influencer) {
            return res.status(404).json({ error: 'Influencer not found' });
        }
        res.json(influencer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get influencer analytics
router.get('/:id/analytics', async (req, res) => {
    try {
        const influencer = await Influencer.findById(req.params.id)
            .select('metrics content');
        if (!influencer) {
            return res.status(404).json({ error: 'Influencer not found' });
        }
        
        // Calculate key metrics
        const totalContent = influencer.content.length;
        const approvedContent = influencer.content.filter(c => c.status === 'approved').length;
        const averageReviewTime = calculateAverageReviewTime(influencer.content);
        
        res.json({
            metrics: influencer.metrics,
            contentStats: {
                total: totalContent,
                approved: approvedContent,
                averageReviewTime
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Helper function for calculating average review time
function calculateAverageReviewTime(content) {
    const reviewTimes = content
        .filter(c => c.submissionDate && c.reviewDate)
        .map(c => c.reviewDate - c.submissionDate);
    
    if (reviewTimes.length === 0) return 0;
    return reviewTimes.reduce((a, b) => a + b, 0) / reviewTimes.length;
}

module.exports = router;
