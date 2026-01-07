import React from 'react';
import { Direction } from '@/types/game';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DPadProps {
  onDirection: (direction: Direction) => void;
  disabled?: boolean;
}

export function DPad({ onDirection, disabled }: DPadProps) {
  const handleClick = (direction: Direction) => {
    if (disabled) return;
    onDirection(direction);
    
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const buttonClass = cn(
    'w-14 h-14 rounded-xl flex items-center justify-center',
    'bg-muted/50 active:bg-muted text-muted-foreground active:text-foreground',
    'transition-all active:scale-95',
    disabled && 'opacity-50 pointer-events-none'
  );

  return (
    <div className="grid grid-cols-3 gap-2 w-fit mx-auto">
      <div />
      <button className={buttonClass} onClick={() => handleClick('up')}>
        <ArrowUp className="w-6 h-6" />
      </button>
      <div />
      
      <button className={buttonClass} onClick={() => handleClick('left')}>
        <ArrowLeft className="w-6 h-6" />
      </button>
      <div className="w-14 h-14 rounded-xl bg-muted/20 flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
      </div>
      <button className={buttonClass} onClick={() => handleClick('right')}>
        <ArrowRight className="w-6 h-6" />
      </button>
      
      <div />
      <button className={buttonClass} onClick={() => handleClick('down')}>
        <ArrowDown className="w-6 h-6" />
      </button>
      <div />
    </div>
  );
}
