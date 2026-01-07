export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Position {
  x: number;
  y: number;
}

export interface Level {
  id: string;
  name: string;
  width: number;
  height: number;
  walls: Position[];
  leadStart: Position;
  echoStart: Position;
  goalLead: Position;
  goalEcho: Position;
  par?: number;
}

export interface GameState {
  lead: Position;
  echo: Position;
  previousSwipe: Direction | null;
  moveCount: number;
  isWon: boolean;
  isMoving: boolean;
}

export interface LevelProgress {
  completed: boolean;
  bestMoves: number | null;
}

export interface GameProgress {
  levels: Record<string, LevelProgress>;
  dailyStreak: number;
  lastDailyDate: string | null;
  dailyBestMoves: Record<string, number>;
  currentLevelIndex: number;
}
