import React from 'react';
import { Calendar, Layers, HelpCircle, BarChart3, Settings } from 'lucide-react';
import { useGameProgress } from '@/hooks/useGameProgress';
import { allLevels } from '@/data/levels';

interface HomeScreenProps {
  onDailyPuzzle: () => void;
  onLevelPacks: () => void;
  onTutorial: () => void;
  onStats: () => void;
  onSettings: () => void;
}

export function HomeScreen({
  onDailyPuzzle,
  onLevelPacks,
  onTutorial,
  onStats,
  onSettings,
}: HomeScreenProps) {
  const { getCurrentStreak, progress } = useGameProgress();
  const streak = getCurrentStreak();
  const completedLevels = Object.values(progress.levels).filter(l => l.completed).length;

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
        {/* Logo/Title */}
        <div className="text-center animate-slide-up">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-lead to-lead/80 shadow-[0_0_30px_hsl(var(--lead)/0.4)]" />
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-echo to-echo/80 shadow-[0_0_30px_hsl(var(--echo)/0.4)]" />
          </div>
          <h1 className="text-5xl font-bold title-gradient mb-2">
            ECHO MOVE
          </h1>
          <p className="text-muted-foreground text-lg">
            Lead now. Echo later.
          </p>
        </div>

        {/* Streak badge */}
        {streak > 0 && (
          <div className="stat-badge bg-echo/20 text-echo animate-slide-up">
            🔥 {streak} day streak
          </div>
        )}

        {/* Main CTA */}
        <div className="w-full max-w-xs space-y-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <button onClick={onDailyPuzzle} className="btn-primary flex items-center justify-center gap-3">
            <Calendar className="w-5 h-5" />
            Daily Puzzle
          </button>

          <button onClick={onLevelPacks} className="btn-secondary flex items-center justify-center gap-3">
            <Layers className="w-5 h-5" />
            Level Packs
            <span className="text-xs text-muted-foreground ml-auto">
              {completedLevels}/{allLevels.length}
            </span>
          </button>

          <button onClick={onTutorial} className="btn-secondary flex items-center justify-center gap-3">
            <HelpCircle className="w-5 h-5" />
            Tutorial
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 pb-8">
        <div className="flex justify-center gap-8">
          <button onClick={onStats} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs">Stats</span>
          </button>
          <button onClick={onSettings} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="w-5 h-5" />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
