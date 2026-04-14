'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Sparkles, Save } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  credits: number;
}

interface EditCreditsModalProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string, credits: number) => Promise<void>;
}

export function EditCreditsModal({ user, isOpen, onClose, onSave }: EditCreditsModalProps) {
  const [newCredits, setNewCredits] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setNewCredits(user.credits);
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await onSave(user.id, newCredits);
      onClose();
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit User Credits">
      <div className="space-y-8 py-4">
        <div className="flex flex-col items-center">
          <div className="h-20 w-20 rounded-3xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 mb-4 animate-pulse-slow">
            <Sparkles className="h-10 w-10 text-violet-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-1 truncate max-w-full">
            {user?.email || 'User Profile'}
          </h3>
          <p className="text-slate-500 text-sm">Update credit balance manually</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-sm font-medium text-slate-400">
            <span>Amount</span>
            <span className="text-violet-400 font-bold">{newCredits} Credits</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="1000"
            step="1"
            value={newCredits}
            onChange={(e) => setNewCredits(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
          />
          <div className="flex gap-4">
            <input 
              type="number"
              value={newCredits}
              onChange={(e) => setNewCredits(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-6 py-4 text-white font-bold text-center text-xl focus:outline-none focus:border-violet-500/50"
            />
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full py-5 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-bold rounded-2xl shadow-xl shadow-violet-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 group"
        >
          {isSaving ? (
            'Saving Changes...'
          ) : (
            <>
              <Save className="h-5 w-5" />
              Update Credits
            </>
          )}
        </button>
      </div>
    </Modal>
  );
}
