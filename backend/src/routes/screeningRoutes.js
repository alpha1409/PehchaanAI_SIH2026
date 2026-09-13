const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const Case = require('../models/Case');
const validationService = require('../services/validationService');
const auth = require('../middleware/auth'); // Import the JWT auth middleware

// POST /api/screening/upload
// Receives the passport/aadhaar images from the frontend (supports front and back panels)
router.post('/upload', auth, upload.array('documentImage', 2), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const imagePaths = req.files.map(f => f.path);
    const filenames = req.files.map(f => f.filename);

    const formData = new FormData();
    req.files.forEach(file => {
      formData.append('files', fs.createReadStream(file.path));
    });

    const pythonResponse = await axios.post('http://127.0.0.1:8000/analyze-document', formData, {
      headers: { ...formData.getHeaders() }
    });

    const aiData = pythonResponse.data;
    
    // --- Run Node.js Validation Rules Engine ---
    const extracted = {
      fullName: aiData.extracted_data.full_name,
      passportNumber: aiData.extracted_data.passport_number,
      nationality: aiData.extracted_data.nationality,
      dob: aiData.extracted_data.dob,
      gender: aiData.extracted_data.gender,
      expiryDate: aiData.extracted_data.expiry_date
    };
    
    // Calculate final risk score combining Node rules + AI Base score
    const ruleResults = validationService.calculateRisk(extracted, aiData.document_type || 'Unknown');
    const finalRiskScore = Math.min(ruleResults.score + (aiData.risk_score || 0), 100);

    // 3. Save the result to MongoDB!
    const newCase = new Case({
      caseId: `SP-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
      documentType: aiData.document_type || 'Unknown',
      documentImagePath: imagePaths.join(','),
      extractedData: extracted,
      riskScore: finalRiskScore,
      validation: {
        mrzConsistency: aiData.validation.mrz_consistency,
        expirationCheck: ruleResults.flags.includes('DOCUMENT_EXPIRED') ? 'Failed' : 'Passed',
        nodeFlags: ruleResults.flags.join(', ')
      },
      status: finalRiskScore >= 50 ? 'Flagged' : 'Cleared'
    });

    await newCase.save();
    console.log(`✅ Case saved to DB: ${newCase.caseId} (Score: ${finalRiskScore})`);

    // 4. Return the combined data to the React Frontend
    res.json({
      message: 'Document analyzed successfully!',
      filename: filenames.join(','),
      path: imagePaths.join(','),
      documentType: newCase.documentType,
      extractedData: extracted,
      riskScore: finalRiskScore,
      validation: newCase.validation,
      caseId: newCase.caseId,
      tampering_data: aiData.tampering_data,
      photo: aiData.photo || { available: false, image: null, quality: 'unavailable', message: 'Not processed' }
    });

  } catch (error) {
    console.error('AI Service Error:', error.message);
    res.status(500).json({ error: 'Failed to process document through AI service' });
  }
});

// POST /api/screening/verify-face
// Proxies face images to the Python 3.10 Face Verification Microservice on Port 5001
router.post('/verify-face', auth, upload.fields([{ name: 'documentImage', maxCount: 1 }, { name: 'liveImage', maxCount: 1 }]), async (req, res) => {
  try {
    if (!req.files || !req.files['documentImage'] || !req.files['liveImage']) {
      return res.status(400).json({ error: 'Missing document or live face image' });
    }

    const docFile = req.files['documentImage'][0];
    const liveFile = req.files['liveImage'][0];

    const formData = new FormData();
    formData.append('documentImage', fs.createReadStream(docFile.path));
    formData.append('liveImage', fs.createReadStream(liveFile.path));

    const pythonResponse = await axios.post('http://127.0.0.1:5001/verify-face', formData, {
      headers: { ...formData.getHeaders() }
    });

    res.json(pythonResponse.data);

  } catch (error) {
    console.error('Face Verify API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Face verification failed' });
  }
});

// GET /api/screening/history
// Fetches all previous screenings from MongoDB
router.get('/history', auth, async (req, res) => {
  try {
    // Fetch all cases, sorted by newest first
    const cases = await Case.find().sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch screening history' });
  }
});

module.exports = router;
