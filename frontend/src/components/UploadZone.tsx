import React, { useCallback } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface UploadZoneProps {
    label: string;
    accept?: string;
    maxFiles?: number;
    onFilesSelected: (files: File[]) => void;
    selectedFiles: File[];
    onRemoveFile: (index: number) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({
    label,
    accept = "image/*",
    maxFiles = 1,
    onFilesSelected,
    selectedFiles,
    onRemoveFile
}) => {
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            onFilesSelected(files);
        }
    }, [onFilesSelected]);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            onFilesSelected(Array.from(e.target.files));
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-serif font-semibold text-foreground tracking-wide">{label}</h3>

            <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-border rounded-xl p-8 transition-all hover:border-secondary hover:bg-secondary/5 cursor-pointer group relative"
            >
                <input
                    type="file"
                    accept={accept}
                    multiple={maxFiles > 1}
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="flex flex-col items-center justify-center text-center gap-4">
                    <div className="w-14 h-14 bg-background border border-border rounded-full flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                        <Upload className="text-secondary" size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-foreground">Click or drag images here</p>
                        <p className="text-xs text-foreground/50 mt-1">Supports JPG, PNG (Max {maxFiles} files)</p>
                    </div>
                </div>
            </div>

            {selectedFiles.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedFiles.map((file, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative bg-surface p-3 rounded-lg border border-border flex items-center gap-3 shadow-sm"
                        >
                            <div className="w-10 h-10 bg-background rounded flex items-center justify-center flex-shrink-0 border border-border">
                                <ImageIcon size={18} className="text-secondary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                                <p className="text-xs text-foreground/50">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button
                                onClick={() => onRemoveFile(idx)}
                                className="p-1.5 hover:bg-background rounded-full transition-colors text-foreground/50 hover:text-foreground"
                            >
                                <X size={14} />
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UploadZone;
