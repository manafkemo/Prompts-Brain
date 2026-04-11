'use client';

import { useEffect, useState, use } from 'react';
import { Prompt } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { ScoreBar } from '@/components/ui/ScoreBar';
import { Spinner } from '@/components/ui/Spinner';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Copy, Trash2, Calendar, FileText } from 'lucide-react';

export default function PromptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchPrompt();
  }, [resolvedParams.id]);

  const fetchPrompt = async () => {
    try {
      const res = await fetch(`/api/prompts/${resolvedParams.id}`);
      if (res.ok) {
        const data = await res.json();
        setPrompt(data);
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error(error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt.original_prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this prompt?')) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`/api/prompts/${resolvedParams.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to delete', error);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Spinner className="h-10 w-10 text-violet-500" />
      </div>
    );
  }

  if (!prompt) return null;

  return (
    <div className="min-h-screen bg-black text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
          <button 
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to DB</span>
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors border border-slate-700 text-sm font-medium"
            >
              {copied ? <span className="text-green-400">Copied!</span> : <><Copy className="w-4 h-4" /> Copy Prompt</>}
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors focus:outline-none"
              title="Delete prompt"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left col) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel rounded-2xl p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge className="capitalize">{prompt.type}</Badge>
                {prompt.tags.map(tag => (
                  <Badge key={tag} variant="secondary">#{tag}</Badge>
                ))}
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
                {prompt.subject}
              </h1>
              
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                {prompt.description}
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-violet-400 font-medium">
                  <FileText className="h-5 w-5" />
                  <h2>Original Prompt Content</h2>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 relative group">
                  <pre className="text-slate-300 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                    {prompt.original_prompt}
                  </pre>
                  
                  <button
                    onClick={handleCopy}
                    className="absolute top-4 right-4 p-2 bg-slate-800/80 hover:bg-violet-600 rounded-lg text-slate-300 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar (Right col) */}
          <div className="space-y-6">
            {/* AI Analysis Card */}
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <span className="bg-violet-500/20 text-violet-400 p-1.5 rounded-lg">✨</span>
                AI Analysis
              </h3>
              
              <div className="space-y-6">
                <div>
                  <ScoreBar score={prompt.quality_score} label="Quality Score" />
                </div>
                <div>
                  <ScoreBar score={prompt.creativity_score} label="Creativity Score" />
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <div className="text-sm text-slate-400 mb-2 font-medium">Detected Styles</div>
                  <div className="flex flex-wrap gap-2">
                    {prompt.style.map(s => (
                      <span key={s} className="px-2 py-1 bg-slate-800/80 text-slate-300 text-xs rounded-md border border-slate-700/50">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Meta Card */}
            <div className="glass-panel rounded-2xl p-6">
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Added on</span>
                  </div>
                  <span className="text-slate-300">
                    {new Date(prompt.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                {prompt.extracted_text && (
                  <div className="pt-4 border-t border-slate-800 text-slate-400">
                    <p className="flex items-center gap-2 text-xs mb-1 text-emerald-400/80">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Extracted via OCR
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
