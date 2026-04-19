interface ScoreBarProps {
  score: number;
  label: string;
}

export function ScoreBar({ score, label }: ScoreBarProps) {
  const percentage = (score / 10) * 100;
  
  let colorClass = "bg-red-500";
  if (score >= 8) colorClass = "bg-violet-500";
  else if (score >= 5) colorClass = "bg-amber-500";

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-slate-400">{label}</span>
        <span className="text-xs font-bold text-slate-200 font-en-nums">{score}/10</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden relative">
        <div 
          className={`h-full ${colorClass} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
        <div className="absolute inset-0 bg-white/20 mix-blend-overlay w-full h-full" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
