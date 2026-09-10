# 🛡️ PehchaanAI

> **AI-Powered Identity Verification & Border Security System**  
> *Built for Smart India Hackathon (SIH) 2026*

PehchaanAI is a robust, multi-layered microservice architecture designed to detect sophisticated identity fraud, including "Frankenstein IDs" (mixing front and back panels of different documents) and computer-generated digital fakes.

## ✨ Key Features
- **Multi-Panel OCR Engine:** Uses EasyOCR and PassportEye to extract and cross-validate data across visual zones and MRZ (Machine Readable Zones).
- **Cryptographic Validation:** Mathematically verifies Aadhaar numbers using the Government Verhoeff algorithm.
- **Advanced Forensics (ELA):** Runs Error Level Analysis and metadata extraction to detect Photoshop manipulation and synthetic digital templates.
- **Biometric Face Verification:** DeepFace microservice verifies live webcam feeds against the ID's portrait photo.
- **Frankenstein ID Detection:** Cross-references extracted ID numbers across all uploaded document sides to instantly catch mixed-identity forgery.

## 🏗️ Tech Stack & Architecture
The system runs on 4 isolated microservices:
1. **Frontend:** React (Vite) + Lucide Icons
2. **Backend Proxy:** Node.js + Express + MongoDB
3. **Core AI Service (Port 8000):** Python 3.14 (FastAPI, OpenCV, EasyOCR, Pillow)
4. **Biometric Service (Port 5001):** Python 3.10 (FastAPI, DeepFace, RetinaFace)

---

## 🚀 How to Run Locally

*Because this is a scalable microservice architecture, you need to open 4 separate terminal windows.*

### 1. Backend API (Port 5000)
```bash
cd backend
npm install
npm start
```

### 2. Frontend UI (Port 5173)
```bash
cd frontend
npm install
npm run dev
```

### 3. Core AI Engine (Port 8000)
```bash
cd python_ai
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn python-multipart easyocr opencv-python pillow passporteye mrz
python main.py
```

### 4. Face Verification Engine (Port 5001)
*Note: DeepFace requires Python 3.10 or lower.*
```bash
cd python_ai
python -m venv venv_face
venv_face\Scripts\activate
pip install fastapi uvicorn python-multipart deepface tf-keras
python face_api.py
```

## 🔐 Default Officer Login
- **Officer ID:** `ADMIN123`
- **Password:** `password123`
