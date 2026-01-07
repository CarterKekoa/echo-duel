import { useState, useEffect, useCallback } from 'react';
import { GameProgress, LevelProgress } from '@/types/game';

const STORAGE_KEY = 'echo-move-progress';

const defaultProgress: GameProgress = {
  levels: {},
  dailyStreak: 0,
  lastDailyDate: null,
  dailyBestMoves: {},
  currentLevelIndex: 0,
};

function loadProgress(): GameProgress {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...defaultProgress, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to load progress:', e);
  }
  return defaultProgress;
}

function saveProgress(progress: GameProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress:', e);
  }
}

export function useGameProgress() {
  const [progress, setProgress] = useState<GameProgress>(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const getLevelProgress = useCallback((levelId: string): LevelProgress => {
    return progress.levels[levelId] || { completed: false, bestMoves: null };
  }, [progress.levels]);

  const completeLevel = useCallback((levelId: string, moves: number) => {
    setProgress(prev => {
      const existing = prev.levels[levelId];
      const isNewBest = !existing?.bestMoves || moves < existing.bestMoves;
      
      return {
        ...prev,
        levels: {
          ...prev.levels,
          [levelId]: {
            completed: true,
            bestMoves: isNewBest ? moves : existing?.bestMoves ?? moves,
          },
        },
      };
    });
  }, []);

  const completeDailyLevel = useCallback((dateStr: string, moves: number) => {
    setProgress(prev => {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      let newStreak = prev.dailyStreak;
      
      // Check if this is a new daily completion
      if (prev.lastDailyDate !== dateStr) {
        if (prev.lastDailyDate === yesterday) {
          // Continuing streak
          newStreak = prev.dailyStreak + 1;
        } else if (dateStr === today) {
          // Starting new streak
          newStreak = 1;
        }
      }

      const existingBest = prev.dailyBestMoves[dateStr];
      const isNewBest = !existingBest || moves < existingBest;

      return {
        ...prev,
        dailyStreak: newStreak,
        lastDailyDate: dateStr,
        dailyBestMoves: {
          ...prev.dailyBestMoves,
          [dateStr]: isNewBest ? moves : existingBest,
        },
      };
    });
  }, []);

  const getCurrentStreak = useCallback((): number => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (progress.lastDailyDate === today || progress.lastDailyDate === yesterday) {
      return progress.dailyStreak;
    }
    return 0;
  }, [progress.dailyStreak, progress.lastDailyDate]);

  const setCurrentLevelIndex = useCallback((index: number) => {
    setProgress(prev => ({
      ...prev,
      currentLevelIndex: index,
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress);
  }, []);

  return {
    progress,
    getLevelProgress,
    completeLevel,
    completeDailyLevel,
    getCurrentStreak,
    currentLevelIndex: progress.currentLevelIndex,
    setCurrentLevelIndex,
    resetProgress,
  };
}
