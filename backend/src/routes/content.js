const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Get all content with filters
router.get('/', async (req, res) => {
    try {
        const { status, influencerId, page = 1, limit = 50 } = req.query;
        const query = {};
        
        if (status) query.status = status;
        if (influencerId) query.influencerId = influencerId;
        
        const skip = (page - 1) * limit;
        
        const content = await Content.find(query)
            .skip(skip)
            .limit(limit)
            .populate('influencerId', 'name channelName');
            
        const total = await Content.countDocuments(query);
        
        res.json({
            data: content,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Submit new content for review
router.post('/', async (req, res) => {
    try {
        const content = new Content({
            ...req.body,
            timeline: {
                ...req.body.timeline,
                conceptSubmitted: new Date()
            }
        });
        
        // Auto-review with AI if it's a concept or script
        if (req.body.type === 'concept' || req.body.type === 'script') {
            const aiReview = await performAIReview(req.body.content, req.body.type);
            content.reviews.push({
                stage: req.body.type,
                reviewer: 'AI',
                feedback: aiReview.feedback,
                aiAnalysis: {
                    score: aiReview.score,
                    feedback: aiReview.detailed_feedback,
                    brandSafetyCheck: aiReview.isSafe
                }
            });
        }
        
        const result = await content.save();
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get content by ID
router.get('/:id', async (req, res) => {
    try {
        const content = await Content.findById(req.params.id)
            .populate('influencerId', 'name channelName');
        if (!content) {
            return res.status(404).json({ error: 'Content not found' });
        }
        res.json(content);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update content review status
router.patch('/:id/review', async (req, res) => {
    try {
        const { stage, feedback, approved } = req.body;
        const content = await Content.findById(req.params.id);
        
        if (!content) {
            return res.status(404).json({ error: 'Content not found' });
        }
        
        // Add review
        content.reviews.push({
            stage,
            reviewer: req.user?.name || 'System',
            feedback,
            date: new Date()
        });
        
        // Update status based on stage and approval
        if (approved) {
            const statusMap = {
                concept: 'script_review',
                script: 'video_review',
                video: 'approved'
            };
            content.status = statusMap[stage] || content.status;
        } else {
            content.status = 'rejected';
        }
        
        // Update timeline
        content.timeline[`${stage}Reviewed`] = new Date();
        
        const updated = await content.save();
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Perform AI content review
async function performAIReview(content, type) {
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a content reviewer for ${type}s. Review for brand safety, quality, and guidelines alignment.`
                },
                {
                    role: "user",
                    content
                }
            ],
            model: "gpt-4-turbo-preview",
        });
        
        // Parse AI response (assuming structured response)
        const analysis = completion.choices[0].message.content;
        return {
            score: 0.8, // You'd parse this from the AI response
            feedback: analysis,
            detailed_feedback: analysis,
            isSafe: !analysis.toLowerCase().includes('unsafe')
        };
    } catch (error) {
        console.error('AI Review Error:', error);
        return {
            score: 0,
            feedback: 'AI review failed',
            detailed_feedback: error.message,
            isSafe: false
        };
    }
}

module.exports = router;
