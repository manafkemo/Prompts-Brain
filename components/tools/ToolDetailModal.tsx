'use client';

import { Tool } from '@/lib/types';
import { Modal } from '@/components/ui/Modal';
import { ExternalLink, Sparkles, Box, LayoutGrid } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ToolDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: Tool | null;
  suggestedPrompts?: string[];
}

export function ToolDetailModal({ isOpen, onClose, tool, suggestedPrompts }: ToolDetailModalProps) {
  const router = useRouter();

  if (!tool) return null;

  const handleUsePrompt = (prompt: string) => {
    // Navigate to dashboard with draft prompt
    localStorage.setItem('draft_prompt', prompt);
    router.push('/dashboard?draft_prompt=true');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tool Details">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">{tool.name}</h2>
            <span className="text-xs font-semibold uppercase tracking-wider bg-violet-500/20 text-violet-400 px-2.5 py-1 rounded-md">
              {tool.category}
            </span>
          </div>
          <p className="text-slate-300 text-base leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            {tool.description}
          </p>
        </div>

        {/* Tags and Pricing */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-slate-800">
          <div className="flex flex-wrap gap-2">
            <Box className="w-4 h-4 text-slate-500 mt-0.5" />
            {tool.tags.map(tag => (
              <span key={tag} className="text-xs font-medium uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-800 text-slate-300">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-amber-400/90 bg-amber-400/10 px-3 py-1 rounded-md">
              {tool.pricing}
            </span>
            <a 
              href={tool.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-slate-100 hover:bg-white text-slate-900 px-4 py-1.5 rounded-lg font-semibold transition-colors"
            >
              Visit <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Suggested Prompts Section */}
        {suggestedPrompts && suggestedPrompts.length > 0 && (
          <div className="space-y-4 pt-2">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-500" />
              Suggested Prompts for {tool.name}
            </h3>
            
            <div className="grid gap-3">
              {suggestedPrompts.map((prompt, idx) => (
                <div key={idx} className="group flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 bg-slate-900 border border-slate-800 hover:border-violet-500/30 rounded-xl transition-all">
                  <p className="text-sm text-slate-300 italic">&quot;{prompt}&quot;</p>
                  <button 
                    onClick={() => handleUsePrompt(prompt)}
                    className="flex shrink-0 items-center gap-2 text-sm font-medium text-violet-400 hover:text-white hover:bg-violet-600 bg-violet-500/10 px-4 py-2 rounded-lg transition-all"
                  >
                    Use this <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
