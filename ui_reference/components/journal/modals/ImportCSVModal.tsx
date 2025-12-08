import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';
import { Button } from '../../ui/Button';

interface ImportCSVModalProps {
  onClose: () => void;
}

export const ImportCSVModal: React.FC<ImportCSVModalProps> = ({ onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type === "text/csv" || file.name.endsWith('.csv')) {
      setFile(file);
      // Simulate processing
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setUploadStatus('success');
      }, 2000);
    } else {
        setUploadStatus('error');
    }
  };

  const reset = () => {
    setFile(null);
    setUploadStatus('idle');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-void/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative z-10 w-full max-w-lg"
      >
        <GlassCard className="p-0 overflow-hidden shadow-2xl shadow-emerald-500/10 border-emerald-500/20">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
            <h3 className="text-xl text-white font-light">Import Trade History</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8">
            <div className="mb-6">
                <label className="text-sm text-slate-400 block mb-2">Select Exchange / Broker</label>
                <select className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-emerald-500">
                    <option>Binance (Universal)</option>
                    <option>Bybit (Unified)</option>
                    <option>Kraken</option>
                    <option>MetaTrader 4/5</option>
                    <option>Custom CSV</option>
                </select>
            </div>

            <AnimatePresence mode="wait">
                {file === null ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        key="dropzone"
                        className={`
                            relative h-64 rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer
                            ${dragActive ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}
                        `}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => inputRef.current?.click()}
                    >
                        <input ref={inputRef} type="file" className="hidden" onChange={handleChange} accept=".csv" />
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <Upload className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-white font-medium mb-1">Click to upload or drag and drop</p>
                        <p className="text-slate-500 text-sm max-w-[200px]">Supported formats: .CSV (Max 10MB)</p>
                    </motion.div>
                ) : isProcessing ? (
                     <motion.div 
                        key="processing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-64 rounded-xl border border-white/10 bg-black/20 flex flex-col items-center justify-center"
                     >
                        <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin mb-4" />
                        <p className="text-white">Analyzing Data Structure...</p>
                        <p className="text-slate-500 text-sm">Please wait</p>
                     </motion.div>
                ) : (
                    <motion.div 
                        key="result"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-64 rounded-xl border border-white/10 bg-black/20 flex flex-col items-center justify-center"
                    >
                        {uploadStatus === 'success' ? (
                            <>
                                <CheckCircle className="w-12 h-12 text-emerald-400 mb-4" />
                                <h4 className="text-white font-medium mb-1">Upload Complete</h4>
                                <p className="text-slate-400 text-sm mb-6">{file.name}</p>
                                <div className="flex gap-3">
                                    <Button variant="secondary" onClick={reset}>Upload Another</Button>
                                    <Button variant="primary" onClick={onClose}>Done</Button>
                                </div>
                            </>
                        ) : (
                             <>
                                <AlertCircle className="w-12 h-12 text-rose-400 mb-4" />
                                <h4 className="text-white font-medium mb-1">Import Failed</h4>
                                <p className="text-slate-400 text-sm mb-6">Invalid CSV format</p>
                                <Button variant="secondary" onClick={reset}>Try Again</Button>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};