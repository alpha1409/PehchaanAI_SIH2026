from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import shutil
import os
from deepface import DeepFace

app = FastAPI(title="SeemaPrahari Face Verification Microservice")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("temp_faces", exist_ok=True)

@app.post("/verify-face")
async def verify_face(documentImage: UploadFile = File(...), liveImage: UploadFile = File(...)):
    # Ensure absolute paths
    base_dir = os.path.abspath("temp_faces")
    doc_path = os.path.join(base_dir, f"doc_{documentImage.filename}")
    live_path = os.path.join(base_dir, f"live_{liveImage.filename}")
    
    with open(doc_path, "wb") as buffer:
        shutil.copyfileobj(documentImage.file, buffer)
    with open(live_path, "wb") as buffer:
        shutil.copyfileobj(liveImage.file, buffer)
        
    try:
        # Use retinaface backend which is significantly more robust for ID cards
        # enforce_detection=True ensures it automatically crops the face from the ID card
        result = DeepFace.verify(
            img1_path=doc_path, 
            img2_path=live_path, 
            model_name="Facenet", # Fast and highly accurate
            detector_backend="retinaface", # Much better at finding faces in noisy ID cards
            enforce_detection=True
        )
        
        # Deepface returns 'distance' (lower is better)
        distance = result["distance"]
        threshold = result["threshold"]
        
        # Convert distance to a friendly 0-100 percentage score
        if distance < threshold:
            score = 100 - ((distance / threshold) * 20)
        else:
            score = 80 - ((distance - threshold) * 40)
            
        score = max(0, min(100, int(score)))

        return {
            "verified": result["verified"],
            "matchScore": score,
            "distance": distance
        }
    except ValueError as e:
        # Triggered if DeepFace can't find a face in one of the images
        print(f"Face Detection Error: {e}")
        return {"verified": False, "matchScore": 0, "error": "Could not detect a clear face in one of the images."}
    except Exception as e:
        print(f"DeepFace Error: {e}")
        return {"verified": False, "matchScore": 0, "error": str(e)}
    finally:
        # Cleanup
        if os.path.exists(doc_path): os.remove(doc_path)
        if os.path.exists(live_path): os.remove(live_path)

if __name__ == "__main__":
    print("🚀 Starting Face Verification Microservice on Port 5001...")
    uvicorn.run(app, host="0.0.0.0", port=5001)
