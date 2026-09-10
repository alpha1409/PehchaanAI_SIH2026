const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  caseId: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Cleared', 'Flagged'],
    default: 'Pending'
  },
  documentType: {
    type: String,
    default: 'Unknown'
  },
  documentImagePath: {
    type: String,
    required: true
  },
  extractedData: {
    fullName: String,
    passportNumber: String,
    nationality: String,
    dob: String,
    gender: String,
    expiryDate: String
  },
  riskScore: {
    type: Number,
    default: 0
  },
  validation: {
    mrzConsistency: String,
    expirationCheck: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Case', caseSchema);
