# AI 画像生成実装ガイド

> 本ドキュメントでは、実際の AI 画像生成機能（商品置換、インペインティング）の実装方法を説明します

---

## 📋 概要

現在のアプリケーションはモック画像を使用しています。実際の商品置換機能を実現するには、AI モデルまたは外部 API の統合が必要です。

---

## 🎯 方式の選択

### 方式 A: ローカル AI モデル (Stable Diffusion)

**メリット**:
- ✅ 完全な制御
- ✅ API 費用不要
- ✅ プライバシー保護

**デメリット**:
- ❌ GPU が必要 (NVIDIA, 8GB+ VRAM)
- ❌ 複雑な環境設定
- ❌ 処理速度が遅い (GPU なしの場合)

**技術スタック**:
```
Python 3.10+
PyTorch 2.0+
diffusers (Hugging Face)
transformers
accelerate
```

**実装手順**:

#### 1. 依存関係のインストール
```bash
cd ai-service
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
pip install diffusers transformers accelerate pillow
```

#### 2. モデルのダウンロード
```python
from diffusers import StableDiffusionInpaintPipeline
import torch

# Stable Diffusion Inpainting モデルをダウンロード
model_id = "runwayml/stable-diffusion-inpainting"
pipe = StableDiffusionInpaintPipeline.from_pretrained(
    model_id,
    torch_dtype=torch.float16,
)
pipe = pipe.to("cuda")  # または "cpu" (非常に遅い)
```

#### 3. main.py の更新
```python
from fastapi import FastAPI, UploadFile, File, Form
from diffusers import StableDiffusionInpaintPipeline
import torch
from PIL import Image
import io

app = FastAPI()

# モデルの読み込み (起動時)
pipe = StableDiffusionInpaintPipeline.from_pretrained(
    "runwayml/stable-diffusion-inpainting",
    torch_dtype=torch.float16,
).to("cuda")

@app.post("/generate")
async def generate_images(
    sample_ad: UploadFile = File(...),
    product_images: List[UploadFile] = File(default=[]),
    prompts_text: Optional[str] = Form(None)
):
    # 1. サンプル広告を読み込む
    sample_img = Image.open(io.BytesIO(await sample_ad.read()))
    
    # 2. マスクを生成 (物体検出モデルが必要、例: SAM)
    mask = generate_mask(sample_img)  # 実装が必要
    
    # 3. 各プロンプトを処理
    results = []
    if prompts_text:
        prompts = prompts_text.split('\n')
        for prompt in prompts:
            result = pipe(
                prompt=prompt,
                image=sample_img,
                mask_image=mask,
                num_inference_steps=50,
            ).images[0]
            results.append(result)
    
    # 4. 保存して URL を返す
    return {"generated_images": save_images(results)}
```

#### 4. 物体検出とマスク生成
**Segment Anything Model (SAM)** を使用:
```python
from segment_anything import sam_model_registry, SamAutomaticMaskGenerator

sam = sam_model_registry["vit_h"](checkpoint="sam_vit_h.pth")
mask_generator = SamAutomaticMaskGenerator(sam)

def generate_mask(image):
    masks = mask_generator.generate(image)
    # 主要物体のマスクを選択
    main_mask = select_main_object_mask(masks)
    return main_mask
```

---

### 方式 B: 外部 API (迅速な開発に推奨)

**メリット**:
- ✅ GPU 不要
- ✅ 迅速なセットアップ
- ✅ 高品質な結果

**デメリット**:
- ❌ API Key が必要
- ❌ 使用量に応じた課金
- ❌ 外部サービスへの依存

#### オプション 1: Stability AI API

**料金**: ~$0.002-0.01 per image

**実装**:
```python
import requests
import os

STABILITY_API_KEY = os.getenv("STABILITY_API_KEY")

@app.post("/generate")
async def generate_images(...):
    url = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/image-to-image/masking"
    
    headers = {
        "Authorization": f"Bearer {STABILITY_API_KEY}",
        "Accept": "application/json"
    }
    
    files = {
        "init_image": sample_ad.file,
        "mask_image": mask_file,
    }
    
    data = {
        "text_prompts[0][text]": prompt,
        "cfg_scale": 7,
        "samples": 1,
    }
    
    response = requests.post(url, headers=headers, files=files, data=data)
    return response.json()
```

**登録**: https://platform.stability.ai/

---

#### オプション 2: OpenAI DALL-E 3 API

**料金**: $0.040-0.080 per image

**実装**:
```python
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.post("/generate")
async def generate_images(...):
    # DALL-E 3 は inpainting をサポートしていないため、edit 機能を使用
    response = client.images.edit(
        image=sample_ad.file,
        mask=mask_file,
        prompt=prompt,
        n=1,
        size="1024x1024"
    )
    
    return {"image_url": response.data[0].url}
```

**登録**: https://platform.openai.com/

---

#### オプション 3: Replicate API (最も簡単)

**料金**: $0.0023 per second

**実装**:
```python
import replicate

@app.post("/generate")
async def generate_images(...):
    output = replicate.run(
        "stability-ai/stable-diffusion-inpainting:95b7223104132402a9ae91cc677285bc5eb997834bd2349fa486f53910fd68b3",
        input={
            "image": sample_ad_url,
            "mask": mask_url,
            "prompt": prompt,
        }
    )
    return {"image_url": output}
```

**登録**: https://replicate.com/

---

## 🔧 既存プロジェクトへの統合

### 1. Backend (index.js) の更新

```javascript
app.post('/api/generate', upload.fields([...]), async (req, res) => {
    try {
        const sampleAd = req.files['sampleAd'][0];
        const productImages = req.files['productImages'] || [];
        const { promptsText } = req.body;

        // FormData を作成して AI Service に転送
        const formData = new FormData();
        formData.append('sample_ad', fs.createReadStream(sampleAd.path));
        
        if (promptsText) {
            formData.append('prompts_text', promptsText);
        }
        
        productImages.forEach(img => {
            formData.append('product_images', fs.createReadStream(img.path));
        });

        // AI Service を呼び出す
        const aiResponse = await axios.post(
            `${AI_SERVICE_URL}/generate`,
            formData,
            { headers: formData.getHeaders() }
        );

        res.json(aiResponse.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Generation failed' });
    }
});
```

### 2. Frontend (App.tsx) の更新

```typescript
const handleGenerate = async () => {
    // ... バリデーションロジック ...
    
    setIsGenerating(true);
    setError(null);

    try {
        const formData = new FormData();
        formData.append('sampleAd', sampleAd[0]);
        productImages.forEach(file => formData.append('productImages', file));
        formData.append('promptsText', prompts);

        const response = await fetch('http://localhost:3000/api/generate', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        
        if (data.generated_images) {
            setGeneratedImages(data.generated_images);
            // 履歴に保存
            await saveToHistory({
                sampleAdName: sampleAd[0].name,
                promptsText: prompts,
                generatedImages: data.generated_images,
            });
        }
        
        setIsGenerating(false);
    } catch (err) {
        setError('Generation failed');
        setIsGenerating(false);
    }
};
```

---

## 📊 QA スコアの実装

### OpenCV を使用した品質指標の計算

```python
import cv2
import numpy as np

def calculate_qa_score(original, generated):
    # 1. 構造類似度 (SSIM)
    from skimage.metrics import structural_similarity as ssim
    ssim_score = ssim(original, generated, multichannel=True)
    
    # 2. エッジ検出 (アーティファクト検出)
    edges_orig = cv2.Canny(original, 100, 200)
    edges_gen = cv2.Canny(generated, 100, 200)
    edge_diff = np.sum(np.abs(edges_orig - edges_gen))
    artifact_score = 1 - (edge_diff / edges_orig.size)
    
    # 3. 色温度の一貫性
    color_diff = np.mean(np.abs(original - generated))
    color_score = 1 - (color_diff / 255)
    
    # 総合スコア
    qa_score = (ssim_score * 0.4 + artifact_score * 0.3 + color_score * 0.3)
    
    return {
        "overall": qa_score,
        "ssim": ssim_score,
        "artifact": artifact_score,
        "color": color_score
    }
```

---

## 🚀 デプロイの推奨事項

### Docker 化

**Dockerfile (ai-service)**:
```dockerfile
FROM nvidia/cuda:11.8.0-cudnn8-runtime-ubuntu22.04

RUN apt-get update && apt-get install -y python3.10 python3-pip

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**docker-compose.yml**:
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
  
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - AI_SERVICE_URL=http://ai-service:8000
  
  ai-service:
    build: ./ai-service
    ports:
      - "8000:8000"
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
```

---

## 💰 コスト見積もり

### ローカルデプロイ
- GPU: RTX 3060 (12GB) ~$300-400
- 電気代: ~$0.10/hour
- **適合**: 大量使用、プライバシー要件

### API サービス (月間 1000 枚の画像)
- Stability AI: ~$2-10
- OpenAI DALL-E: ~$40-80
- Replicate: ~$5-15
- **適合**: テスト、小規模使用

---

## 📚 参考リソース

- [Stable Diffusion Inpainting](https://huggingface.co/runwayml/stable-diffusion-inpainting)
- [Segment Anything Model](https://github.com/facebookresearch/segment-anything)
- [Stability AI API Docs](https://platform.stability.ai/docs/api-reference)
- [OpenAI Image API](https://platform.openai.com/docs/guides/images)
- [Replicate Docs](https://replicate.com/docs)

---

## ✅ 次のステップ

1. **方式の選択**: ローカル vs API
2. **認証情報の取得**: API Key (API を使用する場合)
3. **ai-service/main.py の更新**
4. **テスト**: 単一画像の生成
5. **統合**: Backend と Frontend の接続
6. **最適化**: バッチ処理、キャッシュ
