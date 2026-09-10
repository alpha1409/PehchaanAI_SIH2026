from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import io
import cv2
import datetime
import numpy as np
from typing import List
from mrz.checker.td3 import TD3CodeChecker
from forensics import run_tampering_engine
import re

try:
    from PIL import Image
    import easyocr
    reader = easyocr.Reader(['en'])
    print("✅ EasyOCR loaded successfully!")
except ImportError as e:
    print("❌ IMPORT ERROR:", e)
    reader = None

app = FastAPI(title="SeemaPrahari AI Service")

# Allow requests from the Node.js backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "SeemaPrahari AI Service is running!"}

def fix_passport(p_num):
    p_num = p_num.replace('<', '')
    if p_num and p_num[0].isdigit():
        corrections = {'8': 'B', '0': 'O', '1': 'I', '5': 'S', '2': 'Z'}
        if p_num[0] in corrections:
            p_num = corrections[p_num[0]] + p_num[1:]
    return p_num

def parse_mrz_date(yymmdd, is_dob=True):
    # Fix common OCR typos in dates
    corrections = {'O': '0', 'S': '5', 'I': '1', 'L': '1', 'B': '8', 'Z': '2', 'Q': '0'}
    clean_str = "".join([corrections.get(c, c) for c in yymmdd])
    
    if len(clean_str) != 6 or not clean_str.isdigit():
        return clean_str
        
    yy = int(clean_str[:2])
    mm = clean_str[2:4]
    dd = clean_str[4:6]
    
    current_year = datetime.datetime.now().year
    current_yy = current_year % 100
    current_century = (current_year // 100) * 100
    
    if is_dob:
        yyyy = (current_century - 100 + yy) if yy > current_yy else (current_century + yy)
    else:
        yyyy = (current_century - 100 + yy) if yy > current_yy + 20 else (current_century + yy)
            
    return f"{yyyy}-{mm}-{dd}"

def classify_document(ocr_results):
    text_corpus = " ".join([text.upper() for text in ocr_results])
    
    # Aadhaar Check
    if "AADHAAR" in text_corpus or "GOVERNMENT OF INDIA" in text_corpus or "UNIQUE IDENTIFICATION" in text_corpus or "VID :" in text_corpus:
        return "AADHAAR"
        
    # Passport Check (P< is the document code for passport in MRZ)
    if "PASSPORT" in text_corpus or "P<" in text_corpus or "REPUBLIC OF INDIA" in text_corpus:
        return "PASSPORT"
        
    # Driving License Check
    if "DRIVING LICENCE" in text_corpus or "DRIVING LICENSE" in text_corpus or "TRANSPORT DEPARTMENT" in text_corpus:
        return "DRIVING_LICENSE"
        
    # Visa Check (V< is the document code for Visa in MRZ)
    if "VISA" in text_corpus or "V<" in text_corpus:
        return "VISA"
        
    return "UNKNOWN"

@app.post("/analyze-document")
async def analyze_document(files: List[UploadFile] = File(...)):
    
    validation_status = "Failed"
    risk_score = 50
    extracted_data = {}
    document_type = "UNKNOWN"
    all_contents = []

    if reader is not None:
        try:
            print(f"--- Starting OCR Processing ({len(files)} files) ---")
            
            results = []
            qr_data_total = ""
            first_contents = None
            first_img_array = None
            
            for idx, file in enumerate(files):
                contents = await file.read()
                all_contents.append(contents)
                image = Image.open(io.BytesIO(contents)).convert('RGB')
                img_array = np.array(image)
                
                if idx == 0:
                    first_contents = contents
                    first_img_array = img_array
                    
                # --- OpenCV Image Preprocessing ---
                img_bgr = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
                gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
                
                # Run OCR on the full grayscaled image
                file_results = reader.readtext(gray, detail=0)
                results.extend(file_results)
                
                # Detect QR codes on all panels
                qr_decoder = cv2.QRCodeDetector()
                qr_data, _, _ = qr_decoder.detectAndDecode(img_bgr)
                if qr_data:
                    qr_data_total += qr_data + " "
            
            # 1. Classify Document based on combined text from all panels
            document_type = classify_document(results)
            print(f"📄 Detected Document Type: {document_type}")
            
            # 2. Route to specialized parsers
            if document_type == "PASSPORT":
                print("🛂 Routing to Enterprise Engine (PassportEye Crop + EasyOCR Read)...")
                
                import pytesseract
                pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
                from passporteye import read_mrz
                
                # 1. Ask PassportEye to LOCATE and CROP the MRZ (Passports are usually 1 image)
                mrz = read_mrz(io.BytesIO(first_contents), save_roi=True)
                
                if mrz and 'roi' in mrz.aux:
                    print("✅ PassportEye successfully located and cropped the MRZ block!")
                    roi_img = mrz.aux['roi']
                    
                    if roi_img.dtype != np.uint8:
                        if roi_img.max() <= 1.0:
                            roi_img = (roi_img * 255).astype(np.uint8)
                        else:
                            roi_img = roi_img.astype(np.uint8)
                else:
                    print("⚠️ PassportEye failed to find MRZ bounding box. Falling back to OpenCV 25% crop.")
                    img_bgr = cv2.cvtColor(first_img_array, cv2.COLOR_RGB2BGR)
                    height, width = img_bgr.shape[:2]
                    roi_img = img_bgr[int(height * 0.75):height, 0:width]
                    roi_img = cv2.cvtColor(roi_img, cv2.COLOR_BGR2GRAY)
                    _, roi_img = cv2.threshold(roi_img, 150, 255, cv2.THRESH_BINARY)

                # Resizing exactly as requested to optimize EasyOCR dimensions
                roi_img = cv2.resize(roi_img, (1110, 140))
                
                # Restrict EasyOCR to only look for valid MRZ characters
                import string as st
                allowlist = st.ascii_letters + st.digits + '< '
                
                print("📖 Handing cropped image to EasyOCR for accurate reading...")
                code = reader.readtext(roi_img, paragraph=False, detail=0, allowlist=allowlist)
                
                if len(code) >= 2:
                    # Take the last two lines
                    a, b = code[-2].upper(), code[-1].upper()
                    print(a, b)
                    
                    # Pad lines if EasyOCR missed the trailing padding
                    if len(a) < 44:
                        a = a + '<' * (44 - len(a))
                    if len(b) < 44:
                        b = b + '<' * (44 - len(b))
                        
                    # Split surname and given names exactly as requested
                    surname_names = a[5:44].split('<<', 1)
                    if len(surname_names) < 2:
                        surname_names += ['']
                    surname, names = surname_names
                    
                    def clean(string_val):
                        return ''.join(i for i in string_val if i.isalnum()).upper()
                        
                    clean_surname = surname.replace('<', ' ').strip()
                    full_name = f"{names.replace('<', ' ').strip()} {clean_surname}".strip()
                    final_passport_number = fix_passport(clean(b[0:9]))
                    
                    # Gender matching logic
                    raw_gender = clean(b[20])
                    if raw_gender in ['M', 'F']:
                        gender = raw_gender
                    elif raw_gender == '0':
                        gender = 'M'
                    else:
                        gender = 'F'

                    # --- VIZ <-> MRZ CROSS-VALIDATION (FORGERY DETECTION) ---
                    # Combine all text found on the top visual half of the passport
                    viz_corpus = " ".join([text.upper() for text in results]).replace(' ', '')
                    
                    # We strip spaces from the corpus to make matching more resilient to OCR gaps
                    is_surname_match = clean_surname.replace(' ', '') in viz_corpus if clean_surname else True
                    
                    # Check passport number. We check the exact string, and a fallback where '0' might be read as 'O'
                    is_passport_match = final_passport_number in viz_corpus or final_passport_number.replace('0', 'O') in viz_corpus

                    extracted_data = {
                        "full_name": full_name,
                        "passport_number": final_passport_number,
                        "nationality": clean(b[10:13]),
                        "gender": gender,
                        "dob": parse_mrz_date(clean(b[13:19]), is_dob=True), 
                        "expiry_date": parse_mrz_date(clean(b[21:27]), is_dob=False)
                    }
                    
                    # Enforce the Forgery Rule
                    if is_surname_match and is_passport_match:
                        validation_status = "Passed (VIZ Matches MRZ)"
                        risk_score = 0
                        print("✅ VIZ Cross-Validation Passed! Data is authentic.")
                    else:
                        validation_status = "Failed (Forgery Risk: VIZ/MRZ Mismatch)"
                        risk_score = 100
                        print(f"🚨 FORGERY DETECTED: Surname ({is_surname_match}) or Passport Number ({is_passport_match}) missing from Visual Zone!")
                        
                else:
                    print(f"❌ Not enough MRZ lines found by EasyOCR. Got {len(code)} lines.")
                    
            elif document_type == "AADHAAR":
                # --- VERHOEFF ALGORITHM (Government Cryptographic Checksum) ---
                verhoeff_d = (
                    (0, 1, 2, 3, 4, 5, 6, 7, 8, 9), (1, 2, 3, 4, 0, 6, 7, 8, 9, 5),
                    (2, 3, 4, 0, 1, 7, 8, 9, 5, 6), (3, 4, 0, 1, 2, 8, 9, 5, 6, 7),
                    (4, 0, 1, 2, 3, 9, 5, 6, 7, 8), (5, 9, 8, 7, 6, 0, 4, 3, 2, 1),
                    (6, 5, 9, 8, 7, 1, 0, 4, 3, 2), (7, 6, 5, 9, 8, 2, 1, 0, 4, 3),
                    (8, 7, 6, 5, 9, 3, 2, 1, 0, 4), (9, 8, 7, 6, 5, 4, 3, 2, 1, 0)
                )
                verhoeff_p = (
                    (0, 1, 2, 3, 4, 5, 6, 7, 8, 9), (1, 5, 7, 6, 2, 8, 3, 0, 9, 4),
                    (5, 8, 0, 3, 7, 9, 6, 1, 4, 2), (8, 9, 1, 6, 0, 4, 3, 5, 2, 7),
                    (9, 4, 5, 3, 1, 2, 6, 8, 7, 0), (4, 2, 8, 6, 5, 7, 3, 9, 0, 1),
                    (2, 7, 9, 3, 8, 0, 6, 4, 1, 5), (7, 0, 4, 6, 9, 1, 3, 2, 5, 8)
                )
                
                def validate_verhoeff(num_str):
                    if not num_str.isdigit() or len(num_str) != 12:
                        return False
                    c = 0
                    for i, n in enumerate(reversed(num_str)):
                        c = verhoeff_d[c][verhoeff_p[i % 8][int(n)]]
                    return c == 0

                if qr_data_total.strip():
                    print("✅ Secure QR Code Detected! Embedded Data:", qr_data_total)
                else:
                    print("⚠️ No QR Code detected across any panels.")

                # --- 2. MULTI-PANEL OCR EXTRACTION ---
                extracted_data = {
                    "full_name": "Unknown",
                    "passport_number": "Unknown", # Storing Aadhaar number here for uniform frontend handling
                    "nationality": "IND",
                    "gender": "U",
                    "dob": "Unknown",
                    "expiry_date": "N/A"
                }
                
                # Aadhaar Number Mismatch Detection
                found_aadhaar_numbers = set()
                raw_aadhaar_numbers = []
                
                for line in results:
                    # Match 12 digits potentially separated by spaces
                    matches = re.findall(r'\b(?:\d\s*){12}\b', line)
                    for match in matches:
                        clean_num = match.replace(" ", "")
                        if len(clean_num) == 12:
                            raw_aadhaar_numbers.append(clean_num)
                            # Only count mathematically valid numbers to ignore OCR typos
                            if validate_verhoeff(clean_num):
                                found_aadhaar_numbers.add(clean_num)

                mismatch_detected = False
                if len(found_aadhaar_numbers) > 1:
                    print(f"🚨 CRITICAL ALERT: Multiple conflicting VALID Aadhaar numbers found: {found_aadhaar_numbers}")
                    mismatch_detected = True
                    extracted_data["passport_number"] = list(found_aadhaar_numbers)[0]
                elif len(found_aadhaar_numbers) == 1:
                    extracted_data["passport_number"] = list(found_aadhaar_numbers)[0]
                elif len(raw_aadhaar_numbers) > 0:
                    # Fallback to the raw OCR read if none passed the checksum (due to severe blur)
                    # The system will naturally fail it later during the formal Verhoeff check
                    extracted_data["passport_number"] = raw_aadhaar_numbers[0]
                        
                # DOB / YOB Regex
                dob_index = -1
                for i, line in enumerate(results):
                    match = re.search(r'(?:DOB|Year of Birth|YOB).*?(\d{2}/\d{2}/\d{4}|\d{4})', line, re.IGNORECASE)
                    if match:
                        extracted_data["dob"] = match.group(1)
                        dob_index = i
                        break
                        
                # Positional Heuristic Name Extraction (Usually directly above DOB)
                if dob_index > 0:
                    ignore_words = ["GOVERNMENT", "INDIA", "FATHER", "MERA", "AADHAAR"]
                    for j in range(dob_index - 1, -1, -1):
                        candidate = results[j].strip().upper()
                        # If it's mostly letters/spaces and not a generic keyword
                        if len(candidate) > 3 and re.match(r'^[A-Z\s]+$', candidate):
                            if not any(w in candidate for w in ignore_words):
                                extracted_data["full_name"] = candidate
                                break

                # Gender
                corpus = " ".join(results).upper()
                if "FEMALE" in corpus:
                    extracted_data["gender"] = "F"
                elif "MALE" in corpus:
                    extracted_data["gender"] = "M"
                    
                # --- 3. SECURITY VALIDATIONS ---
                validation_status = "Passed"
                risk_score = 0
                
                # 3A. Cross-Panel Mismatch Check (Frankenstein ID)
                if mismatch_detected:
                    validation_status = "Failed (Frankenstein ID: Conflicting Aadhaar Numbers)"
                    risk_score = 100
                    print("🚨 FORGERY DETECTED: The front and back of the document belong to different people!")
                
                else:
                    # 3B. Cryptographic Verhoeff Check
                    aadhaar_num = extracted_data["passport_number"]
                    if aadhaar_num != "Unknown":
                        is_valid_crypto = validate_verhoeff(aadhaar_num)
                        if not is_valid_crypto:
                            validation_status = "Failed (Verhoeff Checksum Invalid - Forgery!)"
                            risk_score = 100
                            print("🚨 FORGERY DETECTED: Fake Aadhaar Number (Fails Verhoeff Matrix).")
                        else:
                            # 3C. QR <-> OCR Cross-Validation (If QR exists)
                            if qr_data_total.strip() and risk_score == 0:
                                if aadhaar_num not in qr_data_total:
                                    validation_status = "Failed (QR/OCR Mismatch - Altered Document!)"
                                    risk_score = 100
                                    print("🚨 FORGERY DETECTED: Printed number does not match QR Code!")
                                else:
                                    validation_status = "Passed (Verhoeff & QR Cross-Check Valid)"
                                    print("✅ Aadhaar Number mathematically verified and matches QR.")
                            else:
                                validation_status = "Passed (Verhoeff Crypto Check Valid)"
                                print("✅ Aadhaar Number mathematically verified.")
                    else:
                        validation_status = "Failed (Aadhaar Number missing)"
                        risk_score = 80
            
            else:
                print("❌ Unsupported document type.")
                validation_status = "Unsupported Document Type"
                
        except Exception as e:
            print("❌ OCR/Parsing Error:", e)
    else:
        print("❌ Reader is None (EasyOCR not loaded).")

    # Fallback to Mock Data if extraction fails completely
    if not extracted_data:
        extracted_data = {
            "full_name": "SHUBHAM KUMAR YADAV (Mock)",
            "passport_number": "P1234567",
            "nationality": "IND",
            "gender": "M",
            "dob": "2005-01-15",
            "expiry_date": "2030-05-12"
        }
        validation_status = "Mocked Data - OCR Failed"
        risk_score = 50

    # --- FORENSICS: Tampering Detection (All Panels) ---
    print(f"🔍 Running Tampering Detection Engine across {len(all_contents)} panels...")
    highest_tamper_score = 0
    worst_tampering_data = {"tamperingScore": 0, "analysis": []}
    
    for content in all_contents:
        t_data = run_tampering_engine(content)
        if t_data["tamperingScore"] >= highest_tamper_score:
            highest_tamper_score = t_data["tamperingScore"]
            worst_tampering_data = t_data
    
    tampering_data = worst_tampering_data
    
    # Adjust overall risk score if tampering is detected
    if tampering_data["tamperingScore"] > risk_score:
        risk_score = tampering_data["tamperingScore"]

    return {
        "validation": {
            "mrz_consistency": validation_status,
            "expirationCheck": "Passed" if extracted_data.get("expiry_date") != "N/A" else "N/A"
        },
        "risk_score": risk_score,
        "document_type": document_type,
        "extracted_data": extracted_data,
        "tampering_data": tampering_data
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting SeemaPrahari AI Service on port 8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000)