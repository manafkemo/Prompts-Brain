import * as React from "react"
import { X } from "lucide-react"

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="relative z-50 w-full max-w-2xl transform overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 text-left align-middle shadow-2xl transition-all sm:my-8 glass-panel p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-semibold leading-6 text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto custom-scrollbar pr-2">
          {children}
        </div>
      </div>
    </div>
  );
}
