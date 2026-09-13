import hashlib
import json
import os
import time

def generate_canonical_payload(document_id: str, document_type: str, verification_status: str, risk_score: int, timestamp: str) -> str:
    # Build a deterministic canonical payload string
    return f"{document_id}|{document_type}|{verification_status}|{risk_score}|{timestamp}"

def calculate_sha256(payload: str) -> str:
    # Produces standard 256-bit hexadecimal digest
    return hashlib.sha256(payload.encode('utf-8')).hexdigest()

def get_network_status():
    provider_url = os.environ.get("BLOCKCHAIN_PROVIDER_URL")
    
    if not provider_url:
        return {
            "connected": False,
            "status": "Configuration Required",
            "network": None,
            "chainId": None,
            "latestBlock": None
        }
    
    try:
        from web3 import Web3
        w3 = Web3(Web3.HTTPProvider(provider_url))
        if w3.is_connected():
            return {
                "connected": True,
                "status": "Connected",
                "network": os.environ.get("BLOCKCHAIN_NETWORK_NAME", "Ethereum Node"),
                "chainId": w3.eth.chain_id,
                "latestBlock": w3.eth.block_number
            }
    except ImportError:
        pass
    except Exception as e:
        print(f"Blockchain connection error: {e}")
        
    return {
        "connected": False,
        "status": "Not Connected",
        "network": None,
        "chainId": None,
        "latestBlock": None
    }

def anchor_hash(document_id: str, record_hash: str, status: str, risk_score: int):
    network_status = get_network_status()
    if not network_status["connected"]:
        return {
            "anchored": False,
            "status": "Configuration Required",
            "tx_hash": None,
            "block_number": None
        }
        
    return {
        "anchored": False,
        "status": "Contract Not Deployed",
        "tx_hash": None,
        "block_number": None
    }

def verify_hash_integrity(record_data: dict, expected_hash: str):
    payload = generate_canonical_payload(
        str(record_data.get('document_id', '')),
        str(record_data.get('document_type', '')),
        str(record_data.get('verification_status', '')),
        int(record_data.get('risk_score', 0)),
        str(record_data.get('timestamp', ''))
    )
    recalculated_hash = calculate_sha256(payload)
    
    if recalculated_hash == expected_hash:
        return {
            "status": "Hash Verified",
            "recalculated_hash": recalculated_hash,
            "match": True
        }
    else:
        return {
            "status": "Integrity Check Failed",
            "recalculated_hash": recalculated_hash,
            "match": False
        }
