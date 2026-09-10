@echo off
echo ===================================================
echo Setting up Python 3.10 Environment for DeepFace
echo ===================================================

echo [1/3] Creating virtual environment (venv_face) using Python 3.10...
py -3.10 -m venv venv_face

echo [2/3] Activating environment and upgrading pip...
call venv_face\Scripts\activate.bat
python -m pip install --upgrade pip

echo [3/3] Installing DeepFace, FastAPI, and OpenCV...
pip install fastapi uvicorn python-multipart deepface tf-keras opencv-python

echo ===================================================
echo SETUP COMPLETE!
echo ===================================================
echo To run the Face Verification Microservice:
echo 1. cd python_ai
echo 2. call venv_face\Scripts\activate.bat
echo 3. python face_api.py
echo ===================================================
pause
