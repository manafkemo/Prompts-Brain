'use client';

import { useEffect, useState, use } from 'react';
import { Prompt } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { ScoreBar } from '@/components/ui/ScoreBar';
import { Spinner } from '@/components/ui/Spinner';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Copy, Trash2, Calendar, FileText, BrainCircuit, Wand2, Check, Palette, Sparkles } from 'lucide-react';

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
  const [isImproving, setIsImproving] = useState(false);
  const [improvedPrompt, setImprovedPrompt] = useState<string | null>(null);
  const [copiedImproved, setCopiedImproved] = useState(false);
  const [isLoadingStyles, setIsLoadingStyles] = useState(false);
  const [styles, setStyles] = useState<string[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [isGeneratingStyle, setIsGeneratingStyle] = useState(false);
  const [generatedStylePrompt, setGeneratedStylePrompt] = useState<string | null>(null);
  const [copiedStylePrompt, setCopiedStylePrompt] = useState(false);
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

  const handleImprove = async () => {
    if (!prompt) return;
    setIsImproving(true);
    setImprovedPrompt(null);
    try {
      const res = await fetch('/api/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.original_prompt })
      });
      if (res.ok) {
        const data = await res.json();
        setImprovedPrompt(data.improved_prompt);
      } else {
        console.error('Failed to improve prompt');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsImproving(false);
    }
  };

  const handleCopyImproved = () => {
    if (improvedPrompt) {
      navigator.clipboard.writeText(improvedPrompt);
      setCopiedImproved(true);
      setTimeout(() => setCopiedImproved(false), 2000);
    }
  };

  const handleSuggestStyles = async () => {
    if (!prompt) return;
    setIsLoadingStyles(true);
    setStyles([]);
    setSelectedStyle(null);
    setGeneratedStylePrompt(null);
    try {
      const res = await fetch('/api/suggest-styles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.original_prompt })
      });
      if (res.ok) {
        const data = await res.json();
        setStyles(data.styles);
      } else {
        console.error('Failed to suggest styles');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingStyles(false);
    }
  };

  const handleGenerateStyle = async (style: string) => {
    if (!prompt) return;
    setSelectedStyle(style);
    setIsGeneratingStyle(true);
    setGeneratedStylePrompt(null);
    try {
      const res = await fetch('/api/generate-style', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.original_prompt, style })
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedStylePrompt(data.generated_prompt);
      } else {
        console.error('Failed to generate style prompt');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingStyle(false);
    }
  };

  const handleCopyStylePrompt = () => {
    if (generatedStylePrompt) {
      navigator.clipboard.writeText(generatedStylePrompt);
      setCopiedStylePrompt(true);
      setTimeout(() => setCopiedStylePrompt(false), 2000);
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
                    title="Copy original prompt"
                  >
                    {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>

                {/* Improve Logic Area */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleImprove}
                    disabled={isImproving}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <Wand2 className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                    {isImproving ? 'Improving...' : 'Improve Prompt'}
                  </button>
                </div>

                {isImproving && (
                  <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center animate-pulse">
                    <div className="relative">
                      <BrainCircuit className="h-12 w-12 text-violet-500 animate-pulse" />
                      <div className="absolute inset-0 h-12 w-12 border-2 border-violet-500/30 rounded-full animate-ping" />
                    </div>
                    <p className="text-violet-400 font-medium mt-4 tracking-wide">Enhancing your prompt with AI...</p>
                  </div>
                )}

                {improvedPrompt && !isImproving && (
                  <div className="mt-6 border border-indigo-500/30 bg-indigo-500/5 rounded-xl overflow-hidden transition-all duration-500 ease-out animate-in slide-in-from-bottom-4 fade-in">
                    <div className="bg-indigo-500/10 px-6 py-3 border-b border-indigo-500/20 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-indigo-400 font-medium tracking-wide">
                        <Wand2 className="h-5 w-5" />
                        <h2>Improved Prompt</h2>
                      </div>
                    </div>
                    <div className="p-6 relative group">
                      <pre className="text-slate-200 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                        {improvedPrompt}
                      </pre>
                      
                      <button
                        onClick={handleCopyImproved}
                        className="absolute top-4 right-4 p-2 bg-slate-800/80 hover:bg-indigo-600 rounded-lg text-slate-300 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        title="Copy improved prompt"
                      >
                        {copiedImproved ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Generate by Style Section */}
            <div className="glass-panel rounded-2xl p-6 sm:p-8 mt-6">
              <div className="flex items-center gap-2 text-fuchsia-400 font-medium mb-6">
                <Palette className="h-6 w-6" />
                <h2 className="text-xl font-semibold text-white">Generate by Style</h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleSuggestStyles}
                    disabled={isLoadingStyles || isGeneratingStyle}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-medium transition-all shadow-[0_0_20px_rgba(192,38,211,0.3)] hover:shadow-[0_0_25px_rgba(192,38,211,0.5)] disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isLoadingStyles ? (
                      <Spinner className="h-4 w-4 text-white" />
                    ) : (
                      <Sparkles className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    )}
                    {isLoadingStyles ? 'Finding Styles...' : 'Suggest Styles'}
                  </button>
                  <p className="text-slate-400 text-sm">
                    Let AI suggest the best styles for this prompt.
                  </p>
                </div>

                {styles.length > 0 && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-sm text-slate-400 mb-3 font-medium">Select a style to generate:</div>
                    <div className="flex flex-wrap gap-3">
                      {styles.map((style) => (
                        <button
                          key={style}
                          onClick={() => handleGenerateStyle(style)}
                          disabled={isGeneratingStyle}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border backdrop-blur-md ${
                            selectedStyle === style
                              ? 'bg-fuchsia-500/20 border-fuchsia-500/50 text-fuchsia-300 shadow-[0_0_15px_rgba(192,38,211,0.2)]'
                              : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:border-slate-600 hover:text-white'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {isGeneratingStyle && (
                  <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center animate-pulse">
                    <div className="relative">
                      <Palette className="h-12 w-12 text-fuchsia-500 animate-pulse" />
                      <div className="absolute inset-0 h-12 w-12 border-2 border-fuchsia-500/30 rounded-full animate-ping" />
                    </div>
                    <p className="text-fuchsia-400 font-medium mt-4 tracking-wide">
                      Crafting your {selectedStyle} prompt...
                    </p>
                  </div>
                )}

                {generatedStylePrompt && !isGeneratingStyle && (
                  <div className="border border-fuchsia-500/30 bg-fuchsia-500/5 rounded-xl overflow-hidden transition-all duration-500 ease-out animate-in slide-in-from-bottom-4 fade-in">
                    <div className="bg-fuchsia-500/10 px-6 py-3 border-b border-fuchsia-500/20 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-fuchsia-400 font-medium tracking-wide">
                        <Sparkles className="h-5 w-5" />
                        <h2>Generated Prompt ({selectedStyle})</h2>
                      </div>
                    </div>
                    <div className="p-6 relative group">
                      <pre className="text-slate-200 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                        {generatedStylePrompt}
                      </pre>
                      
                      <button
                        onClick={handleCopyStylePrompt}
                        className="absolute top-4 right-4 p-2 bg-slate-800/80 hover:bg-fuchsia-600 rounded-lg text-slate-300 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        title="Copy generated prompt"
                      >
                        {copiedStylePrompt ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}
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
