import React from 'react';
import { Direction } from '@/types/game';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Minus } from 'lucide-react';

interface DirectionIndicatorProps {
  direction: Direction | null;
  label?: string;
}

export function DirectionIndicator({ direction, label }: DirectionIndicatorProps) {
  const Icon = direction
    ? {
        up: ArrowUp,
        down: ArrowDown,
        left: ArrowLeft,
        right: ArrowRight,
      }[direction]
    : Minus;

  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-xs text-muted-foreground font-mono">{label}</span>}
      <div className="direction-indicator">
        <Icon className="w-4 h-4" />
      </div>
    </div>
  );
}
