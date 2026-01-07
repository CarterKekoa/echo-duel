import React, { useState, useCallback } from 'react';
import { Level } from '@/types/game';
import { useGameState } from '@/hooks/useGameState';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { useGameProgress } from '@/hooks/useGameProgress';
import { GameBoard } from './GameBoard';
import { DirectionIndicator } from './DirectionIndicator';
import { DPad } from './DPad';
import { WinModal } from './WinModal';
import { RotateCcw, Undo2, Home, Gamepad2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameScreenProps {
  level: Level;
  isDaily?: boolean;
  onBack: () => void;
  onNext?: () => void;
}

export function GameScreen({ level, isDaily, onBack, onNext }: GameScreenProps) {
  const { state, move, restart, undo, canUndo } = useGameState(level);
  const { completeLevel, completeDailyLevel, getLevelProgress, getCurrentStreak } = useGameProgress();
  const [showDPad, setShowDPad] = useState(false);
  const [hasCompletedOnce, setHasCompletedOnce] = useState(false);

  const swipeRef = useSwipeGesture({
    onSwipe: move,
  });

  const handleWin = useCallback(() => {
    if (hasCompletedOnce) return;
    
    if (isDaily) {
      const dateStr = level.id.replace('daily-', '');
      completeDailyLevel(dateStr, state.moveCount);
    } else {
      completeLevel(level.id, state.moveCount);
    }
    setHasCompletedOnce(true);
  }, [isDaily, level.id, state.moveCount, completeLevel, completeDailyLevel, hasCompletedOnce]);

  // Trigger completion on win
  React.useEffect(() => {
    if (state.isWon && !hasCompletedOnce) {
      handleWin();
    }
  }, [state.isWon, hasCompletedOnce, handleWin]);

  const handleReplay = () => {
    setHasCompletedOnce(false);
    restart();
  };

  const handleShare = async () => {
    const text = isDaily
      ? `ECHO MOVE • ${level.name} • ${state.moveCount} moves • Streak ${getCurrentStreak()}`
      : `ECHO MOVE • ${level.name} • ${state.moveCount} moves`;

    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        // User cancelled or share failed
        await navigator.clipboard.writeText(text);
      }
    } else {
      await navigator.clipboard.writeText(text);
    }
    
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 30, 10]);
    }
  };

  const levelProgress = getLevelProgress(level.id);

  return (
    <div
      ref={swipeRef}
      className="h-full flex flex-col bg-background touch-none select-none"
    >
      {/* Header */}
      <header className="flex items-center justify-between p-4 gap-3">
        <button onClick={onBack} className="icon-btn">
          <Home className="w-5 h-5" />
        </button>

        <div className="flex-1 text-center">
          <h1 className="font-semibold text-foreground truncate">{level.name}</h1>
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="stat-badge">
              {state.moveCount} moves
            </span>
            <DirectionIndicator direction={state.previousSwipe} label="Last" />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={cn('icon-btn', !canUndo && 'opacity-30')}
          >
            <Undo2 className="w-5 h-5" />
          </button>
          <button onClick={handleReplay} className="icon-btn">
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Game board */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
        <GameBoard
          level={level}
          leadPosition={state.lead}
          echoPosition={state.echo}
          isMoving={state.isMoving}
        />

        {/* Legend */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-lead to-lead/80 shadow-[0_0_8px_hsl(var(--lead)/0.4)]" />
            <span className="text-muted-foreground">Lead</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-echo to-echo/80 shadow-[0_0_8px_hsl(var(--echo)/0.4)]" />
            <span className="text-muted-foreground">Echo</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 pb-8">
        {showDPad ? (
          <div className="animate-slide-up">
            <DPad onDirection={move} disabled={state.isWon} />
            <button
              onClick={() => setShowDPad(false)}
              className="mt-4 text-muted-foreground text-sm mx-auto block"
            >
              Hide D-Pad
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="swipe-hint mb-3">Swipe anywhere to move</p>
            <button
              onClick={() => setShowDPad(true)}
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 mx-auto text-sm"
            >
              <Gamepad2 className="w-4 h-4" />
              Show D-Pad
            </button>
          </div>
        )}
      </footer>

      {/* Win modal */}
      {state.isWon && (
        <WinModal
          moves={state.moveCount}
          bestMoves={levelProgress.bestMoves}
          par={level.par}
          levelName={level.name}
          isDaily={isDaily}
          streak={isDaily ? getCurrentStreak() : undefined}
          onReplay={handleReplay}
          onNext={onNext}
          onShare={handleShare}
        />
      )}
    </div>
  );
}
