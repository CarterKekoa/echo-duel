import React, { useState, useCallback } from 'react';
import { Level } from '@/types/game';
import { HomeScreen } from '@/components/screens/HomeScreen';
import { GameScreen } from '@/components/game/GameScreen';
import { LevelSelectScreen } from '@/components/screens/LevelSelectScreen';
import { StatsScreen } from '@/components/screens/StatsScreen';
import { SettingsScreen } from '@/components/screens/SettingsScreen';
import { tutorialLevels, mainLevels, getDailyLevel, allLevels } from '@/data/levels';
import { useGameProgress } from '@/hooks/useGameProgress';

type Screen = 'home' | 'game' | 'levels' | 'tutorial' | 'stats' | 'settings';

export default function Index() {
  const [screen, setScreen] = useState<Screen>('home');
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [levelPack, setLevelPack] = useState<'tutorial' | 'main'>('main');
  const [isDaily, setIsDaily] = useState(false);
  const { currentLevelIndex, setCurrentLevelIndex } = useGameProgress();

  const handleDailyPuzzle = useCallback(() => {
    const daily = getDailyLevel(new Date());
    setCurrentLevel(daily);
    setIsDaily(true);
    setScreen('game');
  }, []);

  const handleLevelPacks = useCallback(() => {
    setLevelPack('main');
    setScreen('levels');
  }, []);

  const handleTutorial = useCallback(() => {
    setLevelPack('tutorial');
    setScreen('levels');
  }, []);

  const handleSelectLevel = useCallback((level: Level, index: number) => {
    setCurrentLevel(level);
    setIsDaily(false);
    setCurrentLevelIndex(index);
    setScreen('game');
  }, [setCurrentLevelIndex]);

  const handleNextLevel = useCallback(() => {
    const levels = levelPack === 'tutorial' ? tutorialLevels : mainLevels;
    const nextIndex = currentLevelIndex + 1;
    
    if (nextIndex < levels.length) {
      setCurrentLevel(levels[nextIndex]);
      setCurrentLevelIndex(nextIndex);
    } else {
      // Completed all levels in pack
      setScreen('home');
    }
  }, [levelPack, currentLevelIndex, setCurrentLevelIndex]);

  const handleBack = useCallback(() => {
    if (screen === 'game' && !isDaily) {
      setScreen('levels');
    } else {
      setScreen('home');
    }
  }, [screen, isDaily]);

  // Render current screen
  switch (screen) {
    case 'game':
      return currentLevel ? (
        <GameScreen
          level={currentLevel}
          isDaily={isDaily}
          onBack={handleBack}
          onNext={isDaily ? undefined : handleNextLevel}
        />
      ) : null;

    case 'levels':
      return (
        <LevelSelectScreen
          title={levelPack === 'tutorial' ? 'Tutorial' : 'Level Packs'}
          levels={levelPack === 'tutorial' ? tutorialLevels : mainLevels}
          onSelectLevel={handleSelectLevel}
          onBack={() => setScreen('home')}
        />
      );

    case 'stats':
      return <StatsScreen onBack={() => setScreen('home')} />;

    case 'settings':
      return <SettingsScreen onBack={() => setScreen('home')} />;

    default:
      return (
        <HomeScreen
          onDailyPuzzle={handleDailyPuzzle}
          onLevelPacks={handleLevelPacks}
          onTutorial={handleTutorial}
          onStats={() => setScreen('stats')}
          onSettings={() => setScreen('settings')}
        />
      );
  }
}
