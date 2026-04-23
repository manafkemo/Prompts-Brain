'use client';

import { useState } from 'react';
import { Sparkles, Search, Loader2 } from 'lucide-react';

export interface Recommendation {
  tool_id: string;
  name: string;
  reasoning: string;
  suggested_prompts: string[];
}

interface AIRecommendBoxProps {
  onRecommendationFound: (recommendations: Recommendation[]) => void;
}

export function AIRecommendBox({ onRecommendationFound }: AIRecommendBoxProps) {
  const [goal, setGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRecommend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/tools/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ goal }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to get recommendations');
      }

      onRecommendationFound(data.recommendations);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto mb-16 rounded-3xl overflow-hidden glass-panel p-1 z-10">
      {/* Animated gradient border simulation */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-600 opacity-20 blur-xl" />
      
      <div className="relative bg-slate-950/80 rounded-[22px] p-5 sm:p-10 border border-white/10 backdrop-blur-md">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center p-2.5 sm:p-3 bg-violet-500/10 rounded-full mb-3 sm:mb-4 ring-1 ring-violet-500/20 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-violet-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-violet-100 to-violet-300 bg-clip-text text-transparent mb-2 sm:mb-3">
            AI Tools Matchmaker
          </h2>
          <p className="text-[10px] sm:text-sm font-bold text-amber-500/90 mb-2 uppercase tracking-widest">Cost: 1 Credit</p>
          <p className="text-slate-400 text-sm sm:text-lg max-w-xl mx-auto leading-relaxed">
            Tell us what you want to achieve, and our AI will recommend the absolute best tools along with perfect prompts.
          </p>
        </div>

        <form onSubmit={handleRecommend} className="relative max-w-2xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              disabled={isLoading}
              placeholder="e.g. I want to generate a cinematic trailer..."
              className="relative w-full bg-slate-900 border border-slate-700 focus:border-violet-500 rounded-2xl py-3.5 sm:py-4 pl-5 sm:pl-6 pr-24 sm:pr-32 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all font-medium"
            />
            <button
              type="submit"
              disabled={isLoading || !goal.trim()}
              className="absolute right-1.5 top-1.5 bottom-1.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-4 sm:px-6 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-600/30 text-xs sm:text-sm"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <>
                  Find <span className="hidden xs:inline">Tools</span> <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5 sm:ml-1" />
                </>
              )}
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
