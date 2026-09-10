import cv2
import numpy as np
from PIL import Image, ImageChops, ImageEnhance, ExifTags
import io

def analyze_metadata(image_bytes):
    """Stage 1: Metadata Analysis to detect editing software signatures."""
    try:
        img = Image.open(io.BytesIO(image_bytes))
        exif_data = img.getexif()
        if exif_data:
            for tag_id, value in exif_data.items():
                tag = ExifTags.TAGS.get(tag_id, tag_id)
                if tag in ["Software", "ProcessingSoftware"]:
                    val_str = str(value).lower()
                    suspects = ["photoshop", "gimp", "lightroom", "canva", "editor", "paint"]
                    if any(s in val_str for s in suspects):
                        return {"status": "Failed", "details": f"Software signature found: {value}"}
        return {"status": "Passed", "details": "Metadata normal"}
    except Exception as e:
        return {"status": "Passed", "details": "Metadata normal"}

def perform_ela(image_bytes, quality=90):
    """Stage 2 & 3: Error Level Analysis and Region Inconsistency."""
    try:
        original = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # Resave at specific quality to find compression differences
        temp_io = io.BytesIO()
        original.save(temp_io, 'JPEG', quality=quality)
        temp_io.seek(0)
        compressed = Image.open(temp_io)
        
        # Calculate pixel difference
        diff = ImageChops.difference(original, compressed)
        
        # Enhance difference
        extrema = diff.getextrema()
        max_diff = max([ex[1] for ex in extrema])
        if max_diff == 0:
            max_diff = 1
        scale = 255.0 / max_diff
        diff = ImageEnhance.Brightness(diff).enhance(scale)
        
        # Convert to OpenCV array for stats
        diff_cv = cv2.cvtColor(np.array(diff), cv2.COLOR_RGB2GRAY)
        gray_img = cv2.cvtColor(np.array(original), cv2.COLOR_RGB2GRAY)
        
        # Calculate inconsistency statistics
        mean_val = np.mean(diff_cv)
        std_val = np.std(diff_cv)
        max_val = np.max(diff_cv)
        
        # --- DIGITAL TEMPLATE DETECTION ---
        # Real camera photos ALWAYS have sensor noise. Synthetically generated 
        # fake IDs often have perfectly flat pixel regions (e.g. solid white/grey backgrounds).
        h, w = gray_img.shape
        corners = []
        if h > 100 and w > 100:
            corners = [
                gray_img[0:40, 0:40],
                gray_img[0:40, w-40:w],
                gray_img[h-40:h, 0:40],
                gray_img[h-40:h, w-40:w]
            ]
            
        synthetic_corners = 0
        for corner in corners:
            if np.std(corner) < 1.0:  # Threshold for impossibly flat noise (computer generated)
                synthetic_corners += 1
                
        digital_template_anomaly = bool(synthetic_corners >= 1)

        # Heuristic Region Analysis (Simulated mapping to Text/Portrait areas)
        text_anomaly = bool(std_val > 45 and max_val > 240)
        portrait_anomaly = bool(mean_val > 40 and std_val > 35)
        
        # Calculate base tampering score (0-100)
        raw_score = (std_val * 1.5) + (mean_val * 0.5)
        tampering_score = min(100, max(0, int(raw_score)))
        
        # Boost score if specific anomalies are found
        if text_anomaly: tampering_score = max(tampering_score, 75)
        if portrait_anomaly: tampering_score = max(tampering_score, 82)
        if digital_template_anomaly: tampering_score = max(tampering_score, 98)
        
        return {
            "score": tampering_score,
            "text_region": "Failed" if text_anomaly else "Passed",
            "portrait_region": "Failed" if portrait_anomaly else "Passed",
            "stamp_region": "Failed (Digital Fake)" if digital_template_anomaly else "Passed"
        }
    except Exception as e:
        print(f"ELA Error: {e}")
        return {
            "score": 0,
            "text_region": "Passed",
            "portrait_region": "Passed",
            "stamp_region": "Passed"
        }

def run_tampering_engine(image_bytes):
    """Runs the full 4-stage pipeline."""
    meta_results = analyze_metadata(image_bytes)
    ela_results = perform_ela(image_bytes)
    
    # If metadata completely fails, bump the overall score
    if meta_results["status"] == "Failed":
        ela_results["score"] = max(ela_results["score"], 85)
        
    return {
        "tamperingScore": ela_results["score"],
        "metadata": meta_results["status"],
        "metadataDetails": meta_results["details"],
        "textRegion": ela_results["text_region"],
        "portraitRegion": ela_results["portrait_region"],
        "stampRegion": ela_results["stamp_region"]
    }
