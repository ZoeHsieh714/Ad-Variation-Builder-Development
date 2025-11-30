# 履歴管理と多言語対応の実装ガイド

## 現在の状態

✅ **完了済み**:
- ダウンロード機能 (100%) - すぐに使用可能
- データベース構造 (db.ts)
- App.tsx の構文エラー修正済み

⚠️ **未完了**:
- 履歴管理の統合
- 多言語対応

---

## ステップ 1: 履歴管理の完成

### 1.1 App.tsx に履歴の読み込みと保存を追加

`App.tsx` で `const [isSettingsOpen, setIsSettingsOpen] = useState(false);` の後に以下を追加:

```typescript
// マウント時に履歴を読み込む
useEffect(() => {
  loadHistory();
}, []);

const loadHistory = async () => {
  try {
    const records = await db.history.orderBy('timestamp').reverse().toArray();
    setHistoryList(records);
  } catch (error) {
    console.error('Failed to load history:', error);
  }
};

const saveToHistory = async () => {
  if (generatedImages.length === 0 || !sampleAd[0]) return;
  
  try {
    await db.history.add({
      timestamp: new Date(),
      sampleAdName: sampleAd[0].name,
      source: generationSource,
      promptsText: prompts || undefined,
      productImageCount: productImages.length || undefined,
      generatedImages: generatedImages,
    });
    await loadHistory();
  } catch (error) {
    console.error('Failed to save history:', error);
  }
};

const deleteHistory = async (id: number) => {
  try {
    await db.history.delete(id);
    await loadHistory();
  } catch (error) {
    console.error('Failed to delete history:', error);
  }
};
```

### 1.2 生成完了後に履歴を保存

`setIsGenerating(false);` の行(setTimeout 内)の後に以下を追加:

```typescript
setIsGenerating(false);
saveToHistory(); // この行を追加
```

### 1.3 History Modal の更新

History Modal の部分を以下に置き換え:

```typescript
{/* History Modal */}
<Modal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} title="生成履歴">
  <div className="space-y-4">
    {historyList.length === 0 ? (
      <div className="border border-border rounded-xl p-8 text-center">
        <Clock size={48} className="mx-auto text-foreground/20 mb-4" />
        <p className="text-sm font-medium text-foreground/50">履歴がありません</p>
        <p className="text-xs text-foreground/40 mt-2">バリエーションを生成すると、ここに表示されます</p>
      </div>
    ) : (
      <div className="space-y-3">
        {historyList.map((record) => (
          <div key={record.id} className="border border-border rounded-lg p-4 hover:bg-background transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-foreground">{record.sampleAdName}</h4>
                <p className="text-xs text-foreground/60 mt-1">
                  {new Date(record.timestamp).toLocaleString('ja-JP')}
                </p>
                <p className="text-xs text-foreground/50 mt-1">
                  ソース: {record.source} | 画像: {record.generatedImages.length}
                </p>
              </div>
              <button
                onClick={() => record.id && deleteHistory(record.id)}
                className="p-2 hover:bg-red-50 rounded-full transition-colors text-foreground/50 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-3">
              {record.generatedImages.slice(0, 4).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`結果 ${idx + 1}`}
                  className="w-full aspect-square object-cover rounded"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</Modal>
```

---

## ステップ 2: 多言語対応の実装

### 2.1 依存関係のインストール

```bash
cd frontend
npm install react-i18next i18next
```

### 2.2 翻訳ファイルの作成

ディレクトリ構造を作成:
```
frontend/src/locales/
  ├── ja/
  │   └── translation.json
  ├── en/
  │   └── translation.json
  └── zh-TW/
      └── translation.json
```

**`locales/ja/translation.json`**:
```json
{
  "header": {
    "title": "AdVariationBuilder",
    "history": "履歴",
    "settings": "設定",
    "exportAll": "すべてエクスポート"
  },
  "upload": {
    "sampleAd": "1. サンプル広告(参照)",
    "productImages": "2. 商品画像(置換)",
    "dragHere": "画像をクリックまたはドラッグ",
    "supports": "JPG、PNGに対応(最大{{max}}ファイル)"
  },
  "config": {
    "title": "設定",
    "prompts": "商品説明プロンプト",
    "promptsHelp": "1行に1つの商品説明を入力してください",
    "generate": "バリエーションを生成",
    "processing": "処理中..."
  },
  "results": {
    "title": "生成されたバリエーション",
    "noResults": "まだバリエーションが生成されていません",
    "uploadAndGenerate": "アセットをアップロードして生成を開始",
    "download": "ダウンロード",
    "results": "{{count}}件の結果"
  },
  "settings": {
    "title": "設定",
    "theme": "テーマ設定",
    "baumTheme": "BAUM ナチュラルテーマ",
    "darkMode": "ダークモード(近日公開)",
    "output": "出力設定",
    "format": "デフォルトフォーマット",
    "quality": "品質",
    "save": "設定を保存",
    "language": "言語"
  },
  "history": {
    "title": "生成履歴",
    "noHistory": "履歴がありません",
    "generateToSee": "バリエーションを生成すると、ここに表示されます",
    "source": "ソース",
    "images": "画像"
  }
}
```

**`locales/en/translation.json`**:
```json
{
  "header": {
    "title": "AdVariationBuilder",
    "history": "History",
    "settings": "Settings",
    "exportAll": "Export All"
  },
  "upload": {
    "sampleAd": "1. Sample Ad (Reference)",
    "productImages": "2. Product Images (Replacement)",
    "dragHere": "Click or drag images here",
    "supports": "Supports JPG, PNG (Max {{max}} files)"
  },
  "config": {
    "title": "Configuration",
    "prompts": "Product Description Prompts",
    "promptsHelp": "Enter one product description per line",
    "generate": "Generate Variations",
    "processing": "Processing..."
  },
  "results": {
    "title": "Generated Variations",
    "noResults": "No variations generated yet",
    "uploadAndGenerate": "Upload assets and click generate to start",
    "download": "Download",
    "results": "{{count}} results"
  },
  "settings": {
    "title": "Settings",
    "theme": "Theme Preferences",
    "baumTheme": "BAUM Natural Theme",
    "darkMode": "Dark Mode (Coming Soon)",
    "output": "Output Settings",
    "format": "Default Format",
    "quality": "Quality",
    "save": "Save Settings",
    "language": "Language"
  },
  "history": {
    "title": "Generation History",
    "noHistory": "No history yet",
    "generateToSee": "Generate some variations to see them here",
    "source": "Source",
    "images": "Images"
  }
}
```

**`locales/zh-TW/translation.json`**:
```json
{
  "header": {
    "title": "廣告變化生成器",
    "history": "歷史記錄",
    "settings": "設定",
    "exportAll": "全部匯出"
  },
  "upload": {
    "sampleAd": "1. 範例廣告(參考)",
    "productImages": "2. 產品圖片(替換)",
    "dragHere": "點擊或拖曳圖片至此",
    "supports": "支援 JPG、PNG(最多{{max}}個檔案)"
  },
  "config": {
    "title": "配置",
    "prompts": "產品描述提示",
    "promptsHelp": "每行輸入一個產品描述",
    "generate": "生成變化",
    "processing": "處理中..."
  },
  "results": {
    "title": "生成的變化",
    "noResults": "尚未生成任何變化",
    "uploadAndGenerate": "上傳資源並點擊生成開始",
    "download": "下載",
    "results": "{{count}}個結果"
  },
  "settings": {
    "title": "設定",
    "theme": "主題偏好",
    "baumTheme": "BAUM 自然主題",
    "darkMode": "深色模式(即將推出)",
    "output": "輸出設定",
    "format": "預設格式",
    "quality": "品質",
    "save": "儲存設定",
    "language": "語言"
  },
  "history": {
    "title": "生成歷史",
    "noHistory": "尚無歷史記錄",
    "generateToSee": "生成一些變化後將顯示在此",
    "source": "來源",
    "images": "圖片"
  }
}
```

### 2.3 i18n 設定の作成

`frontend/src/i18n.ts` を作成:

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ja from './locales/ja/translation.json';
import en from './locales/en/translation.json';
import zhTW from './locales/zh-TW/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ja: { translation: ja },
      en: { translation: en },
      'zh-TW': { translation: zhTW },
    },
    lng: 'ja', // デフォルト言語
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
```

### 2.4 main.tsx でインポート

`frontend/src/main.tsx` の最上部に追加:

```typescript
import './i18n';
```

### 2.5 Settings Modal に言語切替を追加

Settings Modal の Theme Preferences セクションの後に追加:

```typescript
<div className="pt-4 border-t border-border">
  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
    <Globe size={16} className="text-secondary" />
    {t('settings.language')}
  </h3>
  <select 
    value={i18n.language} 
    onChange={(e) => i18n.changeLanguage(e.target.value)}
    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
  >
    <option value="ja">日本語</option>
    <option value="en">English</option>
    <option value="zh-TW">繁體中文</option>
  </select>
</div>
```

### 2.6 翻訳の使用

各コンポーネントで:

```typescript
import { useTranslation } from 'react-i18next';

function Header() {
  const { t } = useTranslation();
  
  return (
    <h1>{t('header.title')}</h1>
  );
}
```

---

## テストチェックリスト

### ダウンロード機能
- [ ] 画像生成後、画像カードにホバーすると Download ボタンが表示される
- [ ] Download をクリックすると単一画像がダウンロードされる
- [ ] Header の "Export All" をクリックすると ZIP がダウンロードされる
- [ ] ZIP ファイル名が正しい (`ad-variations_{source}_{date}.zip`)

### 履歴管理
- [ ] 生成完了後、自動的に履歴に保存される
- [ ] History Modal を開くと履歴リストが表示される
- [ ] サムネイル、時刻、ソースが表示される
- [ ] 履歴を削除できる

### 多言語
- [ ] Settings で言語を切り替えられる
- [ ] 切り替え後、UI テキストが即座に更新される
- [ ] 日本語/英語/繁体字中国語が正しく表示される

---

## クイックリファレンス

**完了済みファイル**:
- `frontend/src/utils/downloadUtils.ts` ✅
- `frontend/src/db.ts` ✅
- `frontend/src/components/Header.tsx` ✅ (Export All ボタン付き)
- `frontend/src/components/Layout.tsx` ✅
- `frontend/src/App.tsx` ⚠️ (履歴ロジックの追加が必要)

**作成が必要なファイル**:
- `frontend/src/i18n.ts`
- `frontend/src/locales/ja/translation.json`
- `frontend/src/locales/en/translation.json`
- `frontend/src/locales/zh-TW/translation.json`

**修正が必要なファイル**:
- `frontend/src/main.tsx` (i18n import の追加)
- `frontend/src/App.tsx` (履歴ロジックと History Modal の更新)
