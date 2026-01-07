import React from 'react';
import { ArrowLeft, Volume2, VolumeX, Smartphone } from 'lucide-react';

interface SettingsScreenProps {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [haptics, setHaptics] = React.useState(() => {
    return localStorage.getItem('echo-move-haptics') !== 'false';
  });

  const toggleHaptics = () => {
    const newValue = !haptics;
    setHaptics(newValue);
    localStorage.setItem('echo-move-haptics', String(newValue));
    
    if (newValue && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 p-4">
        <button onClick={onBack} className="icon-btn">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-foreground">Settings</h1>
      </header>

      {/* Settings */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-md mx-auto space-y-4">
          {/* Haptics */}
          <div className="glass-card p-4">
            <button
              onClick={toggleHaptics}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-muted-foreground" />
                <div className="text-left">
                  <p className="font-medium text-foreground">Haptic Feedback</p>
                  <p className="text-sm text-muted-foreground">Vibrate on moves</p>
                </div>
              </div>
              <div className={`w-12 h-7 rounded-full p-1 transition-colors ${haptics ? 'bg-lead' : 'bg-muted'}`}>
                <div className={`w-5 h-5 rounded-full bg-foreground transition-transform ${haptics ? 'translate-x-5' : ''}`} />
              </div>
            </button>
          </div>

          {/* About */}
          <div className="glass-card p-4 space-y-3">
            <h3 className="font-semibold text-foreground">About</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong className="text-foreground">Echo Move</strong> is a minimal puzzle game 
                where Lead and Echo must reach their goals together.
              </p>
              <p>
                The twist? Echo always performs your <em>previous</em> move, 
                creating a unique delay-based puzzle mechanic.
              </p>
            </div>
          </div>

          {/* Credits */}
          <div className="text-center text-sm text-muted-foreground pt-8">
            <p>Made with ❤️ using Lovable</p>
            <p className="text-xs mt-1">v1.0.0</p>
          </div>
        </div>
      </main>
    </div>
  );
}
