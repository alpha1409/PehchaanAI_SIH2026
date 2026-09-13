// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title DocumentVerificationRegistry
 * @dev Anchors PehchaanAI SHA-256 verification hashes to the Ethereum blockchain
 * to provide an immutable, tamper-evident audit trail for border officers.
 * No PII (Personally Identifiable Information) is ever stored on-chain.
 */
contract DocumentVerificationRegistry {

    struct Verification {
        bytes32 documentHash; // Hash of the document or document ID reference
        bytes32 recordHash;   // Canonical SHA-256 hash of the verification result JSON
        string documentType;  // E.g., "Aadhaar", "Passport", "Visa"
        uint8 riskScore;      // 0-100 score given by the AI
        address officer;      // Wallet address of the anchoring system/officer
        uint256 timestamp;    // Block timestamp of anchor
    }

    // Mapping from document hash to Verification record
    mapping(bytes32 => Verification) public verifications;

    // Event emitted when a new verification is anchored
    event VerificationAnchored(
        bytes32 indexed documentHash,
        bytes32 indexed recordHash,
        address officer,
        uint256 timestamp
    );

    /**
     * @dev Anchor a new verification record hash
     * @param _documentHash The hash of the document ID
     * @param _recordHash The canonical SHA-256 hash of the verification payload
     * @param _documentType The type of document (Passport, Aadhaar)
     * @param _riskScore The final risk score (0-100)
     */
    function recordVerification(
        bytes32 _documentHash,
        bytes32 _recordHash,
        string memory _documentType,
        uint8 _riskScore
    ) public {
        require(verifications[_documentHash].timestamp == 0, "Document verification already anchored.");
        
        verifications[_documentHash] = Verification({
            documentHash: _documentHash,
            recordHash: _recordHash,
            documentType: _documentType,
            riskScore: _riskScore,
            officer: msg.sender,
            timestamp: block.timestamp
        });

        emit VerificationAnchored(_documentHash, _recordHash, msg.sender, block.timestamp);
    }

    /**
     * @dev Retrieve a verification record by document hash
     */
    function getVerification(bytes32 _documentHash) public view returns (Verification memory) {
        require(verifications[_documentHash].timestamp != 0, "Record not found.");
        return verifications[_documentHash];
    }
}
