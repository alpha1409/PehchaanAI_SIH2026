const mongoose = require('mongoose');

const blockchainRecordSchema = new mongoose.Schema({
  caseId: { type: String },
  documentId: { type: String, required: true, index: true },
  documentType: { type: String, required: true },
  verificationStatus: { type: String, required: true },
  riskScore: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  
  // Cryptographic Proofs
  recordHash: { type: String, required: true },
  canonicalPayload: { type: String, required: true },
  
  // Blockchain State
  blockchainStatus: { 
    type: String, 
    enum: ['Verified', 'Pending', 'Failed', 'Configuration Required', 'Contract Not Deployed'],
    default: 'Configuration Required'
  },
  txHash: { type: String, default: null },
  blockNumber: { type: Number, default: null },
  networkName: { type: String, default: null },
  
  // Auditing
  officerBadge: { type: String, required: true },
  auditTrail: [{
    action: String,
    timestamp: { type: Date, default: Date.now },
    details: String,
    performedBy: String
  }]
});

module.exports = mongoose.model('BlockchainRecord', blockchainRecordSchema);
