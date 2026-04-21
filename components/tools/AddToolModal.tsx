'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Sparkles, Loader2, Plus, Check, ChevronRight } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface AddToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (tool: any) => void;
}

export function AddToolModal({ isOpen, onClose, onSuccess }: AddToolModalProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [step, setStep] = useState<'input' | 'analyzing' | 'confirm'>('input');
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    let formattedUrl = url.trim();
    if (!formattedUrl) return;

    // Auto-prepend https:// if missing
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    setLoading(true);
    setError(null);
    setStep('analyzing');
    setAnalyzing(true);

    try {
      const res = await fetch('/api/tools/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formattedUrl })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to analyze website');
      }

      const data = await res.json();
      setAnalysisResult(data.tool);
      setStep('confirm');
    } catch (err: any) {
      setError(err.message);
      setStep('input');
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  const handleConfirm = () => {
    onSuccess(analysisResult);
    setStep('input');
    setUrl('');
    setAnalysisResult(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add to Library">
      <div className="space-y-6 py-2">
        {step === 'input' && (
          <form onSubmit={handleAdd} className="space-y-4">
            <p className="text-slate-400 text-sm">
              Enter any website URL. Our AI will analyze what it is, categorize it, and save it to your library.
            </p>
            
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors">
                <Globe className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="domain.com"
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs px-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !url}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-bold rounded-2xl shadow-xl shadow-violet-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              Analyze with AI
              <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            </button>
          </form>
        )}

        {step === 'analyzing' && (
          <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-violet-500/20 blur-3xl rounded-full scale-110" />
              <Loader2 className="h-16 w-16 text-violet-500 animate-spin relative z-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">AI Analyst at work...</h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto animate-pulse">
                Fetching metadata, identifying category, and extracting features.
              </p>
            </div>
          </div>
        )}

        {step === 'confirm' && analysisResult && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="glass-panel p-6 rounded-2xl border-emerald-500/30 bg-emerald-500/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold">{analysisResult.name}</h4>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/80">
                    AI Analyzed Successfully
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-800 text-slate-300 px-2 py-1 rounded">
                    {analysisResult.category}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-500/10 text-amber-500 px-2 py-1 rounded">
                    {analysisResult.pricing}
                  </span>
                </div>
                <p className="text-sm text-slate-400 italic leading-relaxed">
                  "{analysisResult.description}"
                </p>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group"
            >
              Save to Library
              <Plus className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </div>
    </Modal>
  );
}
