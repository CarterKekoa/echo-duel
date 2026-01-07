import React from 'react';
import { Trophy, RotateCcw, ArrowRight, Share2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WinModalProps {
  moves: number;
  bestMoves: number | null;
  par?: number;
  levelName: string;
  isDaily?: boolean;
  streak?: number;
  onReplay: () => void;
  onNext?: () => void;
  onShare: () => void;
}

export function WinModal({
  moves,
  bestMoves,
  par,
  levelName,
  isDaily,
  streak,
  onReplay,
  onNext,
  onShare,
}: WinModalProps) {
  const isNewBest = !bestMoves || moves < bestMoves;
  const underPar = par && moves <= par;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card p-6 w-full max-w-sm animate-bounce-in">
        {/* Trophy icon */}
        <div className="flex justify-center mb-4">
          <div className={cn(
            'w-20 h-20 rounded-full flex items-center justify-center',
            underPar 
              ? 'bg-gradient-to-br from-accent to-accent/60' 
              : 'bg-gradient-to-br from-lead to-lead/60'
          )}>
            {underPar ? (
              <Star className="w-10 h-10 text-accent-foreground" />
            ) : (
              <Trophy className="w-10 h-10 text-primary-foreground" />
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-1">
          {underPar ? 'Perfect!' : 'Solved!'}
        </h2>
        <p className="text-muted-foreground text-center text-sm mb-6">
          {levelName}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <p className="text-3xl font-mono font-bold text-foreground">{moves}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Moves</p>
          </div>
          <div className="text-center">
            <p className={cn(
              'text-3xl font-mono font-bold',
              isNewBest ? 'text-lead' : 'text-foreground'
            )}>
              {bestMoves || moves}
              {isNewBest && <span className="text-sm ml-1">NEW</span>}
            </p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Best</p>
          </div>
        </div>

        {/* Par indicator */}
        {par && (
          <div className="flex justify-center mb-4">
            <div className={cn(
              'stat-badge',
              underPar ? 'bg-accent/20 text-accent' : 'text-muted-foreground'
            )}>
              Par: {par} {underPar ? '✓' : ''}
            </div>
          </div>
        )}

        {/* Streak for daily */}
        {isDaily && streak !== undefined && streak > 0 && (
          <div className="flex justify-center mb-6">
            <div className="stat-badge bg-echo/20 text-echo">
              🔥 {streak} day streak
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onReplay} className="btn-secondary flex-1 flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Replay
          </button>
          {onNext && (
            <button onClick={onNext} className="btn-primary flex-1 flex items-center justify-center gap-2">
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Share */}
        <button
          onClick={onShare}
          className="w-full mt-3 py-3 rounded-xl flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Share Result
        </button>
      </div>
    </div>
  );
}
