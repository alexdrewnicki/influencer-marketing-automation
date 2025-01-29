require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { OpenAI } = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Basic routes (we'll expand these)
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// API Routes (to be implemented)
app.use('/api/influencers', require('./routes/influencers'));
app.use('/api/content', require('./routes/content'));
app.use('/api/contracts', require('./routes/contracts'));
app.use('/api/analytics', require('./routes/analytics'));

// AI Content Review endpoint
app.post('/api/review', async (req, res) => {
    try {
        const { content } = req.body;
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a content reviewer for influencer marketing campaigns. Review the content for brand safety, quality, and alignment with guidelines."
                },
                {
                    role: "user",
                    content: content
                }
            ],
            model: "gpt-4-turbo-preview",
        });

        res.json({
            review: completion.choices[0].message.content,
            approved: !completion.choices[0].message.content.includes("REJECTED")
        });
    } catch (error) {
        console.error('AI Review Error:', error);
        res.status(500).json({ error: 'Error processing content review' });
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Connect to MongoDB (update with your connection string)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/influencer-platform')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

module.exports = app;
