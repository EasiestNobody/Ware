const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/interactive-diary', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define schemas and models
const EntrySchema = new mongoose.Schema({
    category: String,
    content: String,
    date: { type: Date, default: Date.now },
});

const Entry = mongoose.model('Entry', EntrySchema);

// API endpoints
app.post('/api/entries', async (req, res) => {
    try {
        const { category, content } = req.body;
        const entry = new Entry({ category, content });
        await entry.save();
        res.status(201).send(entry);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/api/entries/:category', async (req, res) => {
    try {
        const entries = await Entry.find({ category: req.params.category });
        res.status(200).send(entries);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
