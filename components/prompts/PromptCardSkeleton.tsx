import React from 'react';

export function PromptCardSkeleton() {
  return (
    <div className="glass-panel relative overflow-hidden rounded-xl p-5 animate-pulse">
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="h-6 w-20 bg-slate-800 rounded-md"></div>
          <div className="h-6 w-6 bg-slate-800 rounded-md"></div>
        </div>

        <div className="h-7 w-3/4 bg-slate-800 rounded-md mb-2"></div>
        
        <div className="space-y-2 mb-4">
          <div className="h-4 w-full bg-slate-800 rounded-md"></div>
          <div className="h-4 w-5/6 bg-slate-800 rounded-md"></div>
        </div>

        <div className="flex items-end justify-between mt-auto">
          <div className="flex gap-1">
            <div className="h-5 w-12 bg-slate-800 rounded-md"></div>
            <div className="h-5 w-12 bg-slate-800 rounded-md"></div>
            <div className="h-5 w-12 bg-slate-800 rounded-md"></div>
          </div>
          
          <div className="flex gap-2">
            <div className="h-10 w-8 bg-slate-800 rounded-md"></div>
            <div className="h-10 w-8 bg-slate-800 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
