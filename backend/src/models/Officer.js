const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const officerSchema = new mongoose.Schema({
  badgeNumber: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'Border Officer'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash the password before saving
officerSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Helper method to compare passwords
officerSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Officer', officerSchema);
