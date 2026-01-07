import React from 'react';
import { ArrowLeft, Trophy, Flame, Hash, Star } from 'lucide-react';
import { useGameProgress } from '@/hooks/useGameProgress';
import { allLevels, tutorialLevels, mainLevels } from '@/data/levels';

interface StatsScreenProps {
  onBack: () => void;
}

export function StatsScreen({ onBack }: StatsScreenProps) {
  const { progress, getCurrentStreak, resetProgress } = useGameProgress();
  
  const streak = getCurrentStreak();
  const completedLevels = Object.values(progress.levels).filter(l => l.completed).length;
  const totalMoves = Object.values(progress.levels).reduce((acc, l) => acc + (l.bestMoves || 0), 0);
  
  const starsEarned = allLevels.reduce((acc, level) => {
    const levelProgress = progress.levels[level.id];
    if (levelProgress?.bestMoves && level.par && levelProgress.bestMoves <= level.par) {
      return acc + 1;
    }
    return acc;
  }, 0);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 p-4">
        <button onClick={onBack} className="icon-btn">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-foreground">Statistics</h1>
      </header>

      {/* Stats */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Main stats grid */}
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="glass-card p-4 text-center">
            <Flame className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{streak}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Day Streak</p>
          </div>
          
          <div className="glass-card p-4 text-center">
            <Trophy className="w-6 h-6 text-lead mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">
              {completedLevels}<span className="text-muted-foreground text-lg">/{allLevels.length}</span>
            </p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Completed</p>
          </div>
          
          <div className="glass-card p-4 text-center">
            <Star className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{starsEarned}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Stars</p>
          </div>
          
          <div className="glass-card p-4 text-center">
            <Hash className="w-6 h-6 text-echo mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">{totalMoves}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Moves</p>
          </div>
        </div>

        {/* Daily stats */}
        <div className="glass-card p-4 max-w-md mx-auto">
          <h3 className="font-semibold text-foreground mb-3">Daily Puzzles</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Completed</span>
              <span className="text-foreground font-mono">{Object.keys(progress.dailyBestMoves).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Best streak</span>
              <span className="text-foreground font-mono">{progress.dailyStreak}</span>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="max-w-md mx-auto pt-8">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
                resetProgress();
              }
            }}
            className="text-destructive text-sm underline"
          >
            Reset all progress
          </button>
        </div>
      </main>
    </div>
  );
}
