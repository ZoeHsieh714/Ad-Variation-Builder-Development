# 📘 Ad Variation Builder

> PRO級の広告バリエーション自動生成ツール

[![Status](https://img.shields.io/badge/Status-Prototype-yellow)](https://github.com)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-blue)](https://reactjs.org/)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Python-green)](https://nodejs.org/)

---

## 📋 プロジェクト概要

Ad Variation Builder は、サンプル広告を基に、同一のスタイル・サイズ・レイアウトを保ちながら、商品を置き換えた広告バリエーションを一括生成するツールです。

### 主要機能

- 🎨 **スタイル一貫性**: 背景、構図、色調、フォントを完全に維持
- 📏 **サイズ一貫性**: 解像度とアスペクト比を保持
- 🔄 **クリーンな置き換え**: インペインティング技術による自然な商品配置
- 💡 **光環境一致**: 明るさ、光の方向、色温度を自動調整
- 📦 **バッチ処理**: テキストプロンプトまたは画像で最大10枚を一括生成
- 💾 **ダウンロード機能**: 個別ダウンロード & ZIP一括ダウンロード
- 📚 **履歴管理**: IndexedDB による生成履歴の保存
- 🌐 **多言語対応**: 日本語・英語・繁体字中国語(実装予定)

---

## 🏗️ アーキテクチャ

```
AdVariationBuilder/
├── frontend/          # React + TypeScript + Tailwind CSS
├── backend/           # Node.js + Express (API Server)
├── ai-service/        # Python + FastAPI (AI Image Processing)
└── docs/              # プロジェクト文書
```

### 技術スタック

#### フロントエンド
- **Framework**: React 18 + TypeScript + Vite
- **UI Library**: Tailwind CSS (BAUM Theme)
- **Animation**: Framer Motion
- **State Management**: React Hooks
- **Database**: Dexie.js (IndexedDB wrapper)
- **Download**: JSZip + FileSaver.js
- **i18n**: react-i18next (予定)

#### バックエンド
- **API Server**: Node.js + Express
- **File Upload**: Multer
- **CORS**: cors middleware

#### AI Service
- **Framework**: Python + FastAPI
- **Image Processing**: Pillow, NumPy (現在はモック)
- **AI Model**: Stable Diffusion / 外部API (実装予定)

---

## 📂 プロジェクト構成

```
AdVariationBuilder/
├── frontend/
│   ├── src/
│   │   ├── components/                   # React コンポーネント
│   │   │   ├── Header.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── UploadZone.tsx
│   │   │   ├── ConfigPanel.tsx
│   │   │   └── Modal.tsx
│   │   ├── utils/
│   │   │   └── downloadUtils.ts          # ダウンロード機能
│   │   ├── db.ts                         # IndexedDB 定義
│   │   ├── App.tsx                       # メインアプリ
│   │   └── main.tsx
│   ├── package.json
│   └── tailwind.config.js                # BAUM テーマ設定
│
├── backend/
│   ├── index.js                          # Express サーバー
│   ├── package.json
│   └── uploads/                          # アップロードファイル保存
│
├── ai-service/
│   ├── main.py                           # FastAPI サーバー
│   └── requirements.txt
│
├── docs/                                 # プロジェクト文書
│   ├── adVariationBuilder_prompt.md      # 要件定義(自作)
│   ├── adVariationBuild_plan.md          # 技術仕様(Copilot)
│   ├── adVariationBuild_project.md       # プロジェクト計画(Copilot)
│   ├── AI_IMPLEMENTATION_GUIDE.md        # AI実装ガイド
│   ├── COMPLETE_IMPLEMENTATION_GUIDE.md  # 完全実装ガイド
│   ├── FEATURE_STATUS.md                 # 機能状態レポート
│   └── IMPLEMENTATION_SUMMARY.md         # 実装サマリー
│
├── start_app.ps1                         # アプリ起動スクリプト
├── README.md                             # このファイル
└── PROJECT_PROGRESS.md                   # 進度管理
```

---

## 🚀 セットアップ & 起動

### 前提条件

- Node.js v18 以上
- Python 3.10 以上
- npm または yarn

### インストール

```bash
# 1. リポジトリをクローン
git clone <repository-url>
cd AdVariationBuilder

# 2. フロントエンド依存関係をインストール
cd frontend
npm install

# 3. バックエンド依存関係をインストール
cd ../backend
npm install

# 4. AI サービス依存関係をインストール
cd ../ai-service
pip install -r requirements.txt
```

### 起動

#### 方法 1: PowerShell スクリプト (推奨)

```powershell
.\start_app.ps1
```

#### 方法 2: 個別起動

```bash
# Terminal 1: Frontend
cd frontend
npm run dev

# Terminal 2: Backend
cd backend
npm start

# Terminal 3: AI Service
cd ai-service
python main.py
```

### アクセス

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **AI Service**: http://localhost:8000

---

## 📊 実装状況

### ✅ 完成済み (70%)

#### UI/UX (100%)
- [x] BAUM ブランドテーマ (自然素材・上品なデザイン)
- [x] レスポンシブデザイン (モバイル/タブレット/デスクトップ)
- [x] Framer Motion アニメーション
- [x] Settings / History モーダル

#### 入力機能 (100%)
- [x] サンプル広告アップロード
- [x] 商品画像アップロード (最大10枚)
- [x] テキストプロンプト入力
- [x] 排他制御 (画像 OR プロンプト)
- [x] バリデーション & エラー表示

#### ダウンロード機能 (100%)
- [x] 個別画像ダウンロード
- [x] ZIP 一括ダウンロード
- [x] ファイル命名規則 (`variation_{source}_{index}.png`)

#### バックエンド (100%)
- [x] Express API サーバー
- [x] FastAPI AI サービス
- [x] ファイルアップロード処理
- [x] CORS 対応

#### データ管理 (100%)
- [x] IndexedDB スキーマ (Dexie.js)
- [x] 履歴保存機能 (実装ガイド完成)

### ⚠️ 部分実装 (20%)

#### 画像生成 (10%)
- ⚠️ モック実装 (Unsplash 画像を返す)
- ❌ 実際の AI インペインティング未実装
- ❌ Stable Diffusion 統合未実装
- ❌ QA スコア算出未実装

#### 履歴管理 (80%)
- ✅ データベース構造完成
- ⚠️ UI 統合は実装ガイド参照

### ❌ 未実装 (10%)

#### 多言語対応 (0%)
- ❌ react-i18next 未導入
- ❌ 翻訳ファイル未作成
- ❌ 言語切替 UI 未実装
- ✅ 実装ガイド完成

#### クラウド統合 (0%)
- ❌ Firebase / Supabase 認証
- ❌ AWS S3 / Azure Blob ストレージ
- ❌ Docker / CI/CD

---

## 🎯 使用方法

### 基本フロー

1. **サンプル広告をアップロード**
   - 参照となる広告画像を選択

2. **商品を指定** (どちらか一方)
   - **方法A**: 商品画像をアップロード (最大10枚)
   - **方法B**: テキストで商品を記述 (1行1商品)

3. **設定を調整** (オプション)
   - 出力フォーマット: PNG / JPG
   - 品質: High / Medium / Low

4. **生成**
   - "Generate Variations" ボタンをクリック
   - 処理完了まで待機 (現在はモック: 2秒)

5. **ダウンロード**
   - 個別: 画像カードの "Download" ボタン
   - 一括: Header の "Export All" ボタン

---

## 📖 ドキュメント

### プロジェクト文書

| ファイル | 作成者 | 説明 |
|---------|--------|------|
| `adVariationBuilder_prompt.md` | ZoeHsieh714 | 要件定義・タスク仕様 |
| `adVariationBuild_plan.md` | Copilot | 技術要件定義書 |
| `adVariationBuild_project.md` | Copilot | プロジェクト全体計画書 |
| `AI_IMPLEMENTATION_GUIDE.md` | Antigravity | AI 統合完全ガイド |
| `COMPLETE_IMPLEMENTATION_GUIDE.md` | Antigravity | 履歴・i18n 実装ガイド |
| `FEATURE_STATUS.md` | Antigravity | 機能状態詳細レポート |
| `IMPLEMENTATION_SUMMARY.md` | Antigravity | 実装サマリー |
| `PROJECT_PROGRESS.md` | Antigravity | 進度管理 |

### 実装ガイド

- **AI 統合**: `AI_IMPLEMENTATION_GUIDE.md` 参照
  - Stable Diffusion ローカル実装
  - 外部 API 統合 (Stability AI, OpenAI, Replicate)
  - QA スコア算出
  - Docker デプロイ

- **履歴・多言語**: `COMPLETE_IMPLEMENTATION_GUIDE.md` 参照
  - IndexedDB 統合手順
  - react-i18next セットアップ
  - 翻訳ファイル例

---

## 🛠️ 開発

### 開発チーム

- **要件定義**: ZoeHsieh714
- **技術設計**: GitHub Copilot
- **フロントエンド実装**: Google Antigravity
- **AI モデル統合**: 今後実装予定

### 開発環境

- **IDE**: Visual Studio Code
- **バージョン管理**: Git
- **パッケージマネージャー**: npm
- **Python 環境**: venv

### コーディング規約

- **TypeScript**: Strict mode
- **CSS**: Tailwind CSS utility-first
- **命名**: camelCase (変数), PascalCase (コンポーネント)
- **コミット**: Conventional Commits

---

## 🔮 ロードマップ

### Phase 1: プロトタイプ (完了)
- [x] UI/UX デザイン
- [x] 基本入力機能
- [x] ダウンロード機能
- [x] モックバックエンド

### Phase 2: AI 統合 (予定)
- [ ] Stable Diffusion 統合
- [ ] インペインティング実装
- [ ] QA スコア算出
- [ ] バッチ処理最適化

### Phase 3: 機能拡張 (予定)
- [ ] 履歴管理 UI 統合
- [ ] 多言語対応完成
- [ ] ユーザー認証
- [ ] クラウドストレージ

### Phase 4: 本番化 (予定)
- [ ] Docker コンテナ化
- [ ] CI/CD パイプライン
- [ ] パフォーマンス最適化
- [ ] セキュリティ強化

---

## 📝 ライセンス

このプロジェクトは個人開発プロジェクトです。

---

## 🙏 謝辞

- **GitHub Copilot**: 技術設計とプロジェクト計画
- **Google Antigravity**: フロントエンド実装
- **BAUM / SHIRO**: デザインインスピレーション
- **Unsplash**: モック画像提供

---

## 📞 お問い合わせ

プロジェクトに関する質問や提案は、Issue を作成してください。

---

**Last Updated**: 2025-12-03
**Version**: 0.1.0 (Prototype)
