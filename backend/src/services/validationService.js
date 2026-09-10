/**
 * Validation Rules Engine
 * 
 * This service runs deterministic checks on the extracted data.
 * While the Python AI does the "fuzzy" work (OCR, tampering detection),
 * Node.js should handle strict business rules (e.g., date math).
 */

const calculateRisk = (extractedData, documentType = 'PASSPORT') => {
  let score = 0;
  const flags = [];

  // 1. Expiration Check (Aadhaar cards do not expire)
  if (extractedData.expiryDate && extractedData.expiryDate !== 'N/A' && documentType !== 'AADHAAR') {
    const expiry = new Date(extractedData.expiryDate);
    const today = new Date();
    
    if (isNaN(expiry.getTime())) {
      // If the MRZ had an invalid date like '2023-00-00', it's highly suspicious
      score += 100;
      flags.push('INVALID_EXPIRY_DATE');
    } else if (expiry < today) {
      score += 100; // Automatic High Risk if expired
      flags.push('DOCUMENT_EXPIRED');
    } else {
      // If expiring within 6 months, add slight risk
      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(today.getMonth() + 6);
      if (expiry < sixMonthsFromNow) {
        score += 20;
        flags.push('EXPIRING_SOON');
      }
    }
  }

  // 2. Age Check (Example: Flag if under 18 or over 90 for manual review)
  if (extractedData.dob) {
    const dob = new Date(extractedData.dob);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    if (age < 18) {
      score += 10;
      flags.push('MINOR');
    } else if (age > 90) {
      score += 10;
      flags.push('ELDERLY_REVIEW');
    }
  }

  // Determine final status based on score
  let status = 'Cleared';
  if (score >= 50) status = 'Flagged';
  else if (score >= 20) status = 'Pending'; // Needs manual review

  return {
    score: Math.min(score, 100), // Cap at 100
    flags,
    status
  };
};

module.exports = {
  calculateRisk
};
