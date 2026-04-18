'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, MessageSquareText } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit feedback');
      }

      setIsSuccess(true);
      setContent('');
      
      // Auto close after 2 seconds on success
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-violet-500/20 bg-slate-900/90 shadow-2xl backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 p-6">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-violet-400">
                  <MessageSquareText size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Share Feedback</h2>
                  <p className="text-xs text-slate-400">Your ideas help ZanZora grow.</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                    <Send size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Sent Successfully!</h3>
                  <p className="mt-2 text-slate-400">Thanks for making ZanZora better.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="group relative">
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="What's on your mind? Found a bug? Have a feature request?"
                      className="min-h-[160px] w-full resize-none rounded-2xl border border-slate-800 bg-slate-950/50 p-4 text-white placeholder-slate-500 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all"
                      required
                    />
                    <div className="absolute bottom-3 right-3 text-[10px] text-slate-600 group-focus-within:text-slate-500">
                      Markdown supported
                    </div>
                  </div>

                  {error && (
                    <p className="text-sm text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || !content.trim()}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 py-4 font-bold text-white shadow-lg shadow-violet-900/20 transition-all hover:translate-y-[-2px] hover:shadow-violet-900/40 active:translate-y-[0px] disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Sending Feedback...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send to Developers
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
            
            {/* Footer decoration */}
            <div className="h-1.5 w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 opacity-50" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
