'use client';

import { X, Trash2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  categoryName: string;
  isDeleting: boolean;
}

export function DeleteCategoryModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  categoryName,
  isDeleting 
}: DeleteCategoryModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-slate-950 border border-white/10 rounded-3xl p-8 shadow-2xl glass-panel"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Delete Category?</h3>
              <p className="text-slate-400 text-sm mb-6 px-4">
                Are you sure you want to delete <span className="text-white font-bold">"{categoryName}"</span>? 
                This action is permanent and cannot be undone. 
                <br /><br />
                <span className="flex items-center justify-center gap-2 text-amber-400 font-medium">
                  <AlertCircle className="w-4 h-4" /> 
                  Tools will remain in your library.
                </span>
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition-all border border-transparent hover:border-white/5"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isDeleting}
                  className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-red-900/20 transition-all flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Delete Category'
                  )}
                </button>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
