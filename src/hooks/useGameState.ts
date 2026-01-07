import { useState, useCallback, useEffect } from 'react';
import { Direction, Level, GameState, Position } from '@/types/game';

function positionsEqual(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}

function isWall(pos: Position, walls: Position[]): boolean {
  return walls.some(w => positionsEqual(w, pos));
}

function isValidPosition(pos: Position, width: number, height: number): boolean {
  return pos.x >= 0 && pos.x < width && pos.y >= 0 && pos.y < height;
}

function moveInDirection(pos: Position, dir: Direction): Position {
  switch (dir) {
    case 'up': return { x: pos.x, y: pos.y - 1 };
    case 'down': return { x: pos.x, y: pos.y + 1 };
    case 'left': return { x: pos.x - 1, y: pos.y };
    case 'right': return { x: pos.x + 1, y: pos.y };
  }
}

function tryMove(pos: Position, dir: Direction, level: Level): Position {
  const newPos = moveInDirection(pos, dir);
  if (!isValidPosition(newPos, level.width, level.height)) return pos;
  if (isWall(newPos, level.walls)) return pos;
  return newPos;
}

export function useGameState(level: Level) {
  const [state, setState] = useState<GameState>(() => ({
    lead: level.leadStart,
    echo: level.echoStart,
    previousSwipe: null,
    moveCount: 0,
    isWon: false,
    isMoving: false,
  }));

  const [history, setHistory] = useState<GameState[]>([]);

  // Reset when level changes
  useEffect(() => {
    setState({
      lead: level.leadStart,
      echo: level.echoStart,
      previousSwipe: null,
      moveCount: 0,
      isWon: false,
      isMoving: false,
    });
    setHistory([]);
  }, [level]);

  const checkWin = useCallback((leadPos: Position, echoPos: Position): boolean => {
    return positionsEqual(leadPos, level.goalLead) && positionsEqual(echoPos, level.goalEcho);
  }, [level]);

  const move = useCallback((direction: Direction) => {
    if (state.isWon || state.isMoving) return;

    // Save current state to history for undo
    setHistory(prev => [...prev, state]);

    setState(prev => {
      // Lead always moves in the current direction
      const newLeadPos = tryMove(prev.lead, direction, level);
      
      // Echo moves in the PREVIOUS direction (if any)
      const newEchoPos = prev.previousSwipe 
        ? tryMove(prev.echo, prev.previousSwipe, level)
        : prev.echo;

      const isWon = checkWin(newLeadPos, newEchoPos);

      return {
        lead: newLeadPos,
        echo: newEchoPos,
        previousSwipe: direction,
        moveCount: prev.moveCount + 1,
        isWon,
        isMoving: false,
      };
    });

    // Haptic feedback simulation
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }, [state.isWon, state.isMoving, level, checkWin]);

  const restart = useCallback(() => {
    setState({
      lead: level.leadStart,
      echo: level.echoStart,
      previousSwipe: null,
      moveCount: 0,
      isWon: false,
      isMoving: false,
    });
    setHistory([]);
    
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 50, 10]);
    }
  }, [level]);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    
    const prevState = history[history.length - 1];
    setState(prevState);
    setHistory(prev => prev.slice(0, -1));
    
    if ('vibrate' in navigator) {
      navigator.vibrate(5);
    }
  }, [history]);

  return {
    state,
    move,
    restart,
    undo,
    canUndo: history.length > 0,
  };
}
