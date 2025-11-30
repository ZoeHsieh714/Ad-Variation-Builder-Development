import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import UploadZone from './components/UploadZone';
import ConfigPanel from './components/ConfigPanel';
import Modal from './components/Modal';
import { motion } from 'framer-motion';
import { AlertCircle, Download, Clock, Palette, Trash2 } from 'lucide-react';
import { downloadImage, downloadVariationsAsZip } from './utils/downloadUtils';
import { db, type GenerationHistory } from './db';

function App() {
  const [sampleAd, setSampleAd] = useState<File[]>([]);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [prompts, setPrompts] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [generationSource, setGenerationSource] = useState<'prompt' | 'image'>('prompt');
  const [historyList, setHistoryList] = useState<GenerationHistory[]>([]);

  // Modal states
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSampleAdSelect = (files: File[]) => {
    if (files.length > 0) {
      setSampleAd([files[0]]);
      setError(null);
    }
  };

  const handleProductImageSelect = (files: File[]) => {
    setProductImages(prev => [...prev, ...files]);
    setError(null);
  };

  const handleRemoveSampleAd = () => setSampleAd([]);
  const handleRemoveProductImage = (index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    // Validation
    if (sampleAd.length === 0) {
      setError('Please upload a sample ad.');
      return;
    }
    if (productImages.length === 0 && !prompts.trim()) {
      setError('Please provide either product images OR description prompts.');
      return;
    }
    if (productImages.length > 0 && prompts.trim()) {
      setError('Please use EITHER product images OR prompts, not both.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('sampleAd', sampleAd[0]);
      productImages.forEach(file => formData.append('productImages', file));
      formData.append('promptsText', prompts);

      // In a real app, use the actual backend URL
      const response = await fetch('http://localhost:3000/api/generate', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.status === 'processing' || data.status === 'success') {
        // Track generation source
        setGenerationSource(prompts.trim() ? 'prompt' : 'image');

        setTimeout(() => {
          // Mock result for demo purposes
          setGeneratedImages([
            'https://images.unsplash.com/photo-1615397349754-c5204588a56b?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=1000&auto=format&fit=crop'
          ]);
          setIsGenerating(false);
        }, 2000);
      } else {
        setError('Generation failed. Please try again.');
        setIsGenerating(false);
      }

    } catch (err) {
      console.error(err);
      setError('Failed to connect to the server.');
      setIsGenerating(false);
    }
  };

  // Download handlers
  const handleDownloadSingle = async (imageUrl: string, index: number) => {
    try {
      const extension = 'png';
      const filename = `variation_${generationSource}_${index + 1}.${extension} `;
      await downloadImage(imageUrl, filename);
    } catch (error) {
      setError('Download failed. Please try again.');
    }
  };

  const handleDownloadAll = async () => {
    if (generatedImages.length === 0) return;

    try {
      await downloadVariationsAsZip(generatedImages, generationSource);
    } catch (error) {
      setError('Failed to create ZIP file. Please try again.');
    }
  };

  return (
    <Layout
      onHistoryClick={() => setIsHistoryOpen(true)}
      onSettingsClick={() => setIsSettingsOpen(true)}
      onExportAll={handleDownloadAll}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-surface rounded-2xl p-6 shadow-sm border border-border">
            <h2 className="text-lg font-serif font-bold text-foreground mb-6 tracking-wide">Input Assets</h2>

            <div className="space-y-8">
              <UploadZone
                label="1. Sample Ad (Reference)"
                selectedFiles={sampleAd}
                onFilesSelected={handleSampleAdSelect}
                onRemoveFile={handleRemoveSampleAd}
              />

              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-surface px-3 text-xs font-bold text-foreground/40 uppercase tracking-widest">OR</span>
                </div>
              </div>

              <UploadZone
                label="2. Product Images (Replacement)"
                maxFiles={10}
                selectedFiles={productImages}
                onFilesSelected={handleProductImageSelect}
                onRemoveFile={handleRemoveProductImage}
              />
            </div>
          </div>

          <ConfigPanel
            prompts={prompts}
            setPrompts={setPrompts}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-8">
          <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-sm border border-border min-h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-serif font-bold text-foreground tracking-wide">Generated Variations</h2>
              {generatedImages.length > 0 && (
                <span className="text-sm font-medium text-secondary">{generatedImages.length} results</span>
              )}
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700">
                <AlertCircle size={20} />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {generatedImages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-foreground/30 border-2 border-dashed border-border rounded-xl m-4">
                <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mb-4 border border-border">
                  <ImageIconPlaceholder />
                </div>
                <p className="text-base font-medium text-foreground/60">No variations generated yet</p>
                <p className="text-sm mt-2">Upload assets and click generate to start</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                {generatedImages.map((img, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative aspect-[4/5] rounded-xl overflow-hidden bg-background shadow-sm hover:shadow-xl transition-all duration-500"
                  >
                    <img src={img} alt={`Variation ${idx + 1} `} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => handleDownloadSingle(img, idx)}
                        className="bg-white text-foreground px-6 py-3 rounded-full text-sm font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 hover:bg-secondary hover:text-white"
                      >
                        <Download size={16} /> Download
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* History Modal */}
      <Modal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} title="Generation History">
        <div className="space-y-4">
          <p className="text-sm text-foreground/60">Your recent generation history will appear here.</p>
          <div className="border border-border rounded-xl p-8 text-center">
            <Clock size={48} className="mx-auto text-foreground/20 mb-4" />
            <p className="text-sm font-medium text-foreground/50">No history yet</p>
            <p className="text-xs text-foreground/40 mt-2">Generate some variations to see them here</p>
          </div>
        </div>
      </Modal>

      {/* Settings Modal */}
      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Settings">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Palette size={16} className="text-secondary" />
              Theme Preferences
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 bg-background rounded-lg border border-border cursor-pointer hover:border-secondary transition-colors">
                <span className="text-sm text-foreground">BAUM Natural Theme</span>
                <input type="radio" name="theme" defaultChecked className="text-primary focus:ring-primary" />
              </label>
              <label className="flex items-center justify-between p-4 bg-background rounded-lg border border-border cursor-pointer hover:border-secondary transition-colors opacity-50">
                <span className="text-sm text-foreground">Dark Mode (Coming Soon)</span>
                <input type="radio" name="theme" disabled className="text-primary focus:ring-primary" />
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <h3 className="text-sm font-semibold text-foreground mb-3">Output Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/80">Default Format</span>
                <select className="px-3 py-2 border border-border rounded-lg text-sm bg-background focus:border-secondary focus:ring-1 focus:ring-secondary outline-none">
                  <option>PNG</option>
                  <option>JPG</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/80">Quality</span>
                <select className="px-3 py-2 border border-border rounded-lg text-sm bg-background focus:border-secondary focus:ring-1 focus:ring-secondary outline-none">
                  <option>High (Pro)</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <button className="w-full bg-primary text-primary-foreground py-3 rounded-full font-medium hover:bg-primary/90 transition-colors">
              Save Settings
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}

const ImageIconPlaceholder = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

export default App;
