import React from 'react';
import { ArrowLeft, Check, Star } from 'lucide-react';
import { Level } from '@/types/game';
import { useGameProgress } from '@/hooks/useGameProgress';
import { cn } from '@/lib/utils';

interface LevelSelectScreenProps {
  title: string;
  levels: Level[];
  onSelectLevel: (level: Level, index: number) => void;
  onBack: () => void;
}

export function LevelSelectScreen({
  title,
  levels,
  onSelectLevel,
  onBack,
}: LevelSelectScreenProps) {
  const { getLevelProgress } = useGameProgress();

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 p-4">
        <button onClick={onBack} className="icon-btn">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      </header>

      {/* Level grid */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
          {levels.map((level, index) => {
            const progress = getLevelProgress(level.id);
            const underPar = progress.bestMoves && level.par && progress.bestMoves <= level.par;

            return (
              <button
                key={level.id}
                onClick={() => onSelectLevel(level, index)}
                className={cn(
                  'aspect-square rounded-xl flex flex-col items-center justify-center gap-1 relative',
                  'bg-muted/50 hover:bg-muted transition-colors',
                  progress.completed && 'bg-muted'
                )}
              >
                <span className="text-lg font-semibold text-foreground">
                  {index + 1}
                </span>
                
                {progress.completed && (
                  <div className="absolute top-1 right-1">
                    {underPar ? (
                      <Star className="w-3 h-3 text-accent fill-accent" />
                    ) : (
                      <Check className="w-3 h-3 text-echo" />
                    )}
                  </div>
                )}

                {progress.bestMoves && (
                  <span className="text-xs text-muted-foreground font-mono">
                    {progress.bestMoves}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
