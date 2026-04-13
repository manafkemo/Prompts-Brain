'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { extractTextFromImage } from '@/lib/ocr';
import { Prompt } from '@/lib/types';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { Upload, X, Sparkles } from 'lucide-react';
import { CreditLimitModal } from '@/components/ui/CreditLimitModal';

interface AddPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: (prompt: Prompt) => void;
}

export function AddPromptModal({ isOpen, onClose, onAdded }: AddPromptModalProps) {
  const [step, setStep] = useState<'input' | 'processing' | 'review'>('input');
  const [rawText, setRawText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLimitReached, setIsLimitReached] = useState(false);

  const handleClose = () => {
    setStep('input');
    setRawText('');
    setFile(null);
    setError(null);
    onClose();
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setStep('processing');
      setError(null);
      try {
        const text = await extractTextFromImage(acceptedFiles[0]);
        setRawText(text);
        setStep('review');
      } catch (err: any) {
        setError('Failed to extract text. Please type it manually.');
        setStep('input');
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
  });

  const handleSubmit = async () => {
    if (!rawText.trim()) {
      setError('Prompt text cannot be empty');
      return;
    }

    setStep('processing');
    setError(null);

    try {
      // 1. Analyze with Gemini
      const aiRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptText: rawText })
      });
      
      if (!aiRes.ok) {
        if (aiRes.status === 403) {
          setIsLimitReached(true);
          setStep('input');
          return;
        }
        throw new Error('AI Analysis failed');
      }
      const analysis = await aiRes.json();

      // 2. Save to Database
      const saveRes = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          original_prompt: rawText,
          extracted_text: file ? rawText : null,
          image_url: null, // MVP: skipping storage upload for now to keep it simple
          ...analysis
        })
      });

      if (!saveRes.ok) throw new Error('Failed to save to database');
      const savedPrompt = await saveRes.json();

      onAdded(savedPrompt);
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setStep('review');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Prompt">
      {step === 'processing' && (
        <div className="flex flex-col items-center justify-center py-12">
          <Spinner className="h-10 w-10 text-violet-500 mb-4" />
          <p className="text-slate-300">
            {file && !rawText ? 'Extracting text with OCR...' : 'Analyzing with Manaf AI...'}
          </p>
        </div>
      )}

      {(step === 'input' || step === 'review') && (
        <div className="space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          {step === 'input' && (
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-violet-500 bg-violet-500/10' : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center">
                <div className="bg-slate-800 p-3 rounded-full mb-3">
                  <Upload className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-slate-300 font-medium">Drag & drop an image here</p>
                <p className="text-slate-500 text-sm mt-1">or click to browse</p>
              </div>
            </div>
          )}

          {step === 'input' && (
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-700"></div>
              <span className="flex-shrink-0 mx-4 text-slate-500 text-sm">OR</span>
              <div className="flex-grow border-t border-slate-700"></div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex justify-between">
              <span>{step === 'review' && file ? 'Extracted Text (Edit if needed)' : 'Paste Prompt Text'}</span>
            </label>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="w-full h-32 rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-3 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 custom-scrollbar resize-none"
              placeholder="e.g. A hyper-realistic cinematic shot of a cyberpunk city..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!rawText.trim()}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="h-4 w-4" />
              Analyze & Save
            </button>
          </div>
        </div>
      )}

      <CreditLimitModal 
        isOpen={isLimitReached} 
        onClose={() => setIsLimitReached(false)} 
      />
    </Modal>
  );
}
