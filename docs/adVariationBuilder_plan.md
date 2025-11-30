# 📘 技術要件定義書 ＋ 環境構築仕様書

## 1. プロジェクト概要
- プロジェクト名: 広告バリエーションビルダー
- 目的: サンプル広告を解析し、商品置換・光環境調整・色調統一を行った広告バリエーションを自動生成
- 対応言語: 日本語 🇯🇵（デフォルト）、英語 🇺🇸、中国語繁体字 🇹🇼
- 対象ユーザー: 広告代理店、デザイナー、マーケター

---

## 2. 技術要件

### フロントエンド
- **フレームワーク:** React + TypeScript
- **UIライブラリ:** Material UI / Tailwind CSS
- **アニメーション:** Framer Motion / GSAP
- **多言語対応:** react-i18next
- **テスト:** Jest / Cypress

### バックエンド
- **APIサーバー:** Node.js + Express
- **画像処理:** Python + FastAPI / OpenCV / Pillow / PyTorch
- **ジョブ管理:** BullMQ（Node.js）または Celery（Python）
- **データ保存:** Firebase / Supabase（履歴管理・認証）
- **ストレージ:** AWS S3 / Azure Blob（画像・ZIP保存）

### QA検証
- **アルゴリズム:** OpenCV + NumPy
- **指標:** アーティファクト検出、影方向一致率、色温度差分

---

## 3. 環境構築仕様書

### 開発環境
- **OS:** Windows 10 / macOS / Linux（Docker対応）
- **IDE:** Visual Studio Code
- **バージョン管理:** GitHub / GitLab
- **CI/CD:** GitHub Actions
- **コンテナ:** Docker / Kubernetes

### 必要ツール
- Node.js (v18以上)
- Python (v3.10以上)
- npm / yarn
- Docker Desktop
- Firebase CLI / Supabase CLI
- AWS CLI / Azure CLI

### セットアップ手順
1. **リポジトリクローン**
   ```bash
   git clone https://github.com/[project]/ad-variation-builder.git
   cd ad-variation-builder
   ```
2. **フロントエンド環境構築**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. **バックエンド環境構築**
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```
4. **Dockerコンテナ起動**
   ```bash
   docker-compose up -d
   ```
5. **CI/CD設定**
   - GitHub Actionsで frontend と backend のビルド＋テストを自動化
   - 成果物を Docker イメージとしてクラウドにデプロイ


## 4. 非機能要件
- パフォーマンス: バッチ処理で最大10枚を同時生成
- セキュリティ: Firebase認証、HTTPS通信必須
- 拡張性: 多言語対応、履歴保存、クラウドスケーリング可能
- 可用性: Docker/Kubernetesで冗長化構成

## 5. 成果物
- 動作するプロトタイプ（UI＋バックエンド連携）
- 履歴管理機能（IndexedDB＋クラウド保存）
- 多言語対応UI（日本語・英語・繁体字中国語）
- QAスコア算出アルゴリズム実装済み

   
