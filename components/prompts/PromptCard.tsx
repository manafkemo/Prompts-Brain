import { Prompt } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Copy, ImageIcon, Code, Mic, Video, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useState, memo } from "react";

interface PromptCardProps {
  prompt: Prompt;
}

export const PromptCard = memo(function PromptCard({ prompt }: PromptCardProps) {
  const [copied, setCopied] = useState(false);

  const TypeIcon = () => {
    switch (prompt.type) {
      case "image": return <ImageIcon className="w-4 h-4" />;
      case "video": return <Video className="w-4 h-4" />;
      case "voice": return <Mic className="w-4 h-4" />;
      case "code": return <Code className="w-4 h-4" />;
      default: return <HelpCircle className="w-4 h-4" />;
    }
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.original_prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Link href={`/prompt/${prompt.id}`}>
      <div className="glass-panel group relative overflow-hidden rounded-xl p-5 hover:border-violet-500/50 hover:shadow-violet-900/20 transition-all duration-300">
        
        {/* Subtle gradient background on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 via-violet-500/0 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="flex items-center space-x-1">
                <TypeIcon />
                <span className="capitalize">{prompt.type}</span>
              </Badge>
            </div>
            
            <button 
              onClick={handleCopy}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors focus:outline-none"
              title="Copy original prompt"
            >
              {copied ? <span className="text-xs font-semibold text-green-400">Copied!</span> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
            {prompt.subject}
          </h3>
          
          <p className="text-sm text-slate-400 mb-4 line-clamp-2 min-h-[40px]">
            {prompt.description}
          </p>

          <div className="flex items-end justify-between mt-auto">
            <div className="flex flex-wrap gap-1 max-w-[70%]">
              {prompt.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-xs bg-slate-800/50 border border-slate-700/50 text-slate-300 px-2 py-0.5 rounded-md">
                  #{tag}
                </span>
              ))}
              {prompt.tags.length > 3 && (
                <span className="text-xs text-slate-500 px-1 py-0.5">+{prompt.tags.length - 3}</span>
              )}
            </div>
            
            <div className="flex gap-2">
              <div className="text-center">
                <div className="text-xs text-slate-500">Qual</div>
                <div className="text-sm font-bold text-violet-400">{prompt.quality_score}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-500">Crea</div>
                <div className="text-sm font-bold text-emerald-400">{prompt.creativity_score}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
});
