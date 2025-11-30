const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const fs = require('fs');
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'backend' });
});

app.post('/api/generate', upload.fields([{ name: 'sampleAd', maxCount: 1 }, { name: 'productImages', maxCount: 10 }]), async (req, res) => {
    try {
        const sampleAd = req.files['sampleAd'] ? req.files['sampleAd'][0] : null;
        const productImages = req.files['productImages'] || [];
        const { promptsText } = req.body;

        if (!sampleAd) {
            return res.status(400).json({ error: 'Sample ad is required' });
        }

        // Forward to AI service
        // In a real app, we would send files or paths. Here we'll mock the interaction or send paths.
        // For the mock AI service, we'll just send the filenames.
        
        const payload = {
            sampleAdPath: sampleAd.path,
            productImagePaths: productImages.map(f => f.path),
            promptsText: promptsText
        };

        // Call AI Service
        // const aiResponse = await axios.post(`${AI_SERVICE_URL}/generate`, payload);
        // res.json(aiResponse.data);

        // Mock response for now until AI service is fully ready
        res.json({ 
            status: 'processing', 
            jobId: Date.now().toString(),
            message: 'Job submitted successfully' 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
