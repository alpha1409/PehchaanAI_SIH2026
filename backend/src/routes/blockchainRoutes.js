const express = require('express');
const router = express.Router();
const axios = require('axios');
const BlockchainRecord = require('../models/BlockchainRecord');

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://127.0.0.1:8000';

// Middleware to mock officer badge if auth is not fully set up
const getOfficer = (req) => {
  return req.headers['x-officer-badge'] || 'SG-2047';
};

// GET /api/blockchain/status
router.get('/status', async (req, res) => {
  try {
    const pythonStatus = await axios.get(`${PYTHON_API_URL}/blockchain/status`);
    const totalRecords = await BlockchainRecord.countDocuments();
    const verifiedRecords = await BlockchainRecord.countDocuments({ verificationStatus: 'Passed' });

    res.json({
      success: true,
      network: pythonStatus.data,
      metrics: {
        totalRecords,
        verifiedRecords
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch blockchain status', details: error.message });
  }
});

// POST /api/blockchain/record
router.post('/record', async (req, res) => {
  try {
    const { documentId, documentType, verificationStatus, riskScore, caseId } = req.body;
    const officerBadge = getOfficer(req);
    const timestamp = new Date().toISOString();

    // 1. Call Python API to generate deterministic SHA-256 and attempt anchor
    const pythonRes = await axios.post(`${PYTHON_API_URL}/blockchain/generate-record`, {
      document_id: documentId,
      document_type: documentType,
      verification_status: verificationStatus,
      risk_score: riskScore,
      timestamp: timestamp
    });

    const { hash, payload, anchor_result } = pythonRes.data;

    // 2. Save record to MongoDB
    const newRecord = new BlockchainRecord({
      caseId: caseId || 'N/A',
      documentId,
      documentType,
      verificationStatus,
      riskScore,
      timestamp,
      recordHash: hash,
      canonicalPayload: payload,
      blockchainStatus: anchor_result.status,
      txHash: anchor_result.tx_hash,
      blockNumber: anchor_result.block_number,
      networkName: 'Ethereum', // Hardcoded fallback or use anchor_result
      officerBadge,
      auditTrail: [{
        action: 'RECORD_GENERATED',
        timestamp: new Date(),
        details: `Record securely hashed (SHA-256) and logged. Anchor Status: ${anchor_result.status}`,
        performedBy: officerBadge
      }]
    });

    await newRecord.save();
    res.json({ success: true, record: newRecord });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate blockchain record', details: error.message });
  }
});

// GET /api/blockchain/records
router.get('/records', async (req, res) => {
  try {
    const records = await BlockchainRecord.find().sort({ timestamp: -1 });
    res.json({ success: true, records });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch records' });
  }
});

// POST /api/blockchain/verify-integrity
router.post('/verify-integrity', async (req, res) => {
  try {
    const { documentId } = req.body;
    const officerBadge = getOfficer(req);
    
    const record = await BlockchainRecord.findOne({ documentId }).sort({ timestamp: -1 });
    if (!record) {
      return res.status(404).json({ success: false, error: 'Record Not Found' });
    }

    // Call Python to run verification
    const pythonRes = await axios.post(`${PYTHON_API_URL}/blockchain/verify-hash`, {
      record_data: {
        document_id: record.documentId,
        document_type: record.documentType,
        verification_status: record.verificationStatus,
        risk_score: record.riskScore,
        timestamp: record.timestamp.toISOString() // Must match exactly
      },
      expected_hash: record.recordHash
    });

    const verificationResult = pythonRes.data;

    // Log the audit event
    record.auditTrail.push({
      action: verificationResult.match ? 'INTEGRITY_VERIFIED' : 'INTEGRITY_FAILED',
      timestamp: new Date(),
      details: `Integrity check run. Result: ${verificationResult.status}`,
      performedBy: officerBadge
    });
    
    await record.save();

    res.json({
      success: true,
      verification: verificationResult,
      record
    });

  } catch (error) {
    res.status(500).json({ success: false, error: 'Integrity check failed', details: error.message });
  }
});

module.exports = router;
