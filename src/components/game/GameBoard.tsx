import React from 'react';
import { Level, Position } from '@/types/game';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  level: Level;
  leadPosition: Position;
  echoPosition: Position;
  isMoving?: boolean;
}

function positionsEqual(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}

export function GameBoard({ level, leadPosition, echoPosition, isMoving }: GameBoardProps) {
  const tiles = [];

  for (let y = 0; y < level.height; y++) {
    for (let x = 0; x < level.width; x++) {
      const pos = { x, y };
      const isWall = level.walls.some(w => positionsEqual(w, pos));
      const isGoalLead = positionsEqual(level.goalLead, pos);
      const isGoalEcho = positionsEqual(level.goalEcho, pos);
      const isLead = positionsEqual(leadPosition, pos);
      const isEcho = positionsEqual(echoPosition, pos);
      const bothOnSameTile = positionsEqual(leadPosition, echoPosition) && isLead;

      tiles.push(
        <div
          key={`${x}-${y}`}
          className={cn(
            'game-tile relative flex items-center justify-center',
            isWall && 'game-tile-wall',
            !isWall && isGoalLead && !isGoalEcho && 'game-tile-goal-lead',
            !isWall && isGoalEcho && !isGoalLead && 'game-tile-goal-echo',
            !isWall && isGoalLead && isGoalEcho && 'game-tile-goal-lead game-tile-goal-echo'
          )}
        >
          {/* Goal indicators */}
          {isGoalLead && !isWall && (
            <div className="absolute inset-[25%] rounded-full border-2 border-dashed border-lead/50 animate-pulse-glow" />
          )}
          {isGoalEcho && !isWall && (
            <div className="absolute inset-[25%] rounded-full border-2 border-dashed border-echo/50 animate-pulse-glow" />
          )}
          
          {/* Pieces */}
          {bothOnSameTile ? (
            // Both pieces on same tile - show combined
            <div className="absolute inset-[15%] flex items-center justify-center">
              <div 
                className={cn(
                  'absolute inset-0 rounded-full bg-gradient-to-br from-lead to-echo',
                  'shadow-[0_0_20px_hsl(var(--lead)/0.4),0_0_20px_hsl(var(--echo)/0.4)]',
                  isMoving && 'piece-moving'
                )}
              />
            </div>
          ) : (
            <>
              {isEcho && (
                <div className={cn('piece piece-echo', isMoving && 'piece-moving')} />
              )}
              {isLead && (
                <div className={cn('piece piece-lead', isMoving && 'piece-moving')} />
              )}
            </>
          )}
        </div>
      );
    }
  }

  return (
    <div
      className="game-grid w-full max-w-[min(90vw,400px)] mx-auto"
      style={{
        gridTemplateColumns: `repeat(${level.width}, 1fr)`,
        gridTemplateRows: `repeat(${level.height}, 1fr)`,
      }}
    >
      {tiles}
    </div>
  );
}
