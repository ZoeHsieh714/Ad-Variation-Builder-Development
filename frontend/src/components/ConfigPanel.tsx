import React from 'react';
import { Sparkles } from 'lucide-react';

interface ConfigPanelProps {
    prompts: string;
    setPrompts: (val: string) => void;
    onGenerate: () => void;
    isGenerating: boolean;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ prompts, setPrompts, onGenerate, isGenerating }) => {
    return (
        <div className="bg-surface rounded-2xl p-6 shadow-sm border border-border h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6">
                <Sparkles className="text-secondary" size={20} />
                <h2 className="text-lg font-serif font-bold text-foreground tracking-wide">Configuration</h2>
            </div>

            <div className="space-y-6 flex-1">
                <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                        Product Description Prompts
                    </label>
                    <p className="text-xs text-foreground/60 mb-3">
                        Enter one product description per line. Each line will generate a separate variation.
                    </p>
                    <textarea
                        value={prompts}
                        onChange={(e) => setPrompts(e.target.value)}
                        placeholder="e.g. A luxury perfume bottle on a marble table&#10;A skincare cream with botanical ingredients"
                        className="w-full h-48 p-4 rounded-xl border border-border bg-background focus:border-secondary focus:ring-1 focus:ring-secondary outline-none resize-none text-sm transition-all placeholder:text-foreground/30"
                    />
                </div>

                <div className="p-5 bg-background rounded-xl border border-border/50">
                    <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-4">Settings</h4>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-foreground/80">Output Format</span>
                            <select className="text-sm border-none bg-transparent font-medium focus:ring-0 cursor-pointer text-foreground">
                                <option>PNG</option>
                                <option>JPG</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-foreground/80">Quality</span>
                            <span className="text-sm font-medium text-secondary">High (Pro)</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <button
                    onClick={onGenerate}
                    disabled={isGenerating || !prompts.trim()}
                    className={`w-full py-4 rounded-full font-bold text-white flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-md ${isGenerating || !prompts.trim()
                            ? 'bg-border text-foreground/40 cursor-not-allowed shadow-none'
                            : 'bg-primary hover:bg-primary/90 hover:shadow-lg'
                        }`}
                >
                    {isGenerating ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <Sparkles size={18} />
                            Generate Variations
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ConfigPanel;
