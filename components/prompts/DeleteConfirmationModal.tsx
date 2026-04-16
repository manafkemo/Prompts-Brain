import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Trash2, AlertTriangle } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isDeleting?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Prompt",
  description = "Are you sure you want to delete this prompt? This action cannot be undone.",
  isDeleting = false
}: DeleteConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center text-center py-4">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
          <Trash2 className="h-8 w-8 text-red-500" />
        </div>
        
        <p className="text-slate-400 mb-8 max-w-sm leading-relaxed">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all border border-slate-700 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold transition-all shadow-lg shadow-red-900/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? 'Deleting...' : 'Delete Permanently'}
          </button>
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs text-slate-500 italic">
          <AlertTriangle className="h-3 w-3" />
          This will also remove any associated AI analysis data.
        </div>
      </div>
    </Modal>
  );
}
