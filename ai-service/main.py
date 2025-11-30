from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import uvicorn
import os
import shutil

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "generated_images"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ai-service"}

@app.post("/generate")
async def generate_images(
    sample_ad: UploadFile = File(...),
    product_images: List[UploadFile] = File(default=[]),
    prompts_text: Optional[str] = Form(None)
):
    # Mock generation logic
    # In a real app, this would use Stable Diffusion / Inpainting
    
    # For now, just return a success message and mock paths
    return {
        "status": "success",
        "generated_images": [
            f"http://localhost:8000/static/mock_1.png",
            f"http://localhost:8000/static/mock_2.png"
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
