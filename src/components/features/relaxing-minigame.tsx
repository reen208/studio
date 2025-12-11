"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DuckIcon } from '../icons/duck-icon';
import { Confetti } from 'lucide-react';

export function RelaxingMinigame() {
  const [duckPosition, setDuckPosition] = useState({ top: '50%', left: '50%' });
  const [found, setFound] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeToFind, setTimeToFind] = useState<number | null>(null);

  const newGame = () => {
    setFound(false);
    setTimeToFind(null);
    const top = `${Math.random() * 85 + 5}%`;
    const left = `${Math.random() * 85 + 5}%`;
    setDuckPosition({ top, left });
    setStartTime(Date.now());
  };

  useEffect(() => {
    newGame();
  }, []);

  const handleFoundDuck = () => {
    if (startTime) {
      setTimeToFind((Date.now() - startTime) / 1000);
    }
    setFound(true);
  };
  
  const backgroundDots = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 6 + 2}px`,
      opacity: Math.random() * 0.5 + 0.1,
    }));
  }, []);


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Find the Duckie</CardTitle>
        <CardDescription>A simple game to take a break. Can you spot the hidden duckie?</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        <div className="relative w-full h-80 bg-accent/30 rounded-lg overflow-hidden border">
           {backgroundDots.map(dot => (
            <div
              key={dot.id}
              className="absolute rounded-full bg-primary/30"
              style={{ top: dot.top, left: dot.left, width: dot.size, height: dot.size, opacity: dot.opacity }}
            />
          ))}
          {!found && (
            <button
              onClick={handleFoundDuck}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ top: duckPosition.top, left: duckPosition.left }}
              aria-label="Find the duck"
            >
              <DuckIcon className="w-8 h-8 text-primary hover:scale-125 transition-transform" />
            </button>
          )}

          {found && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
                <Confetti className="w-16 h-16 text-accent-foreground" />
                <h3 className="text-2xl font-bold mt-4">You found it!</h3>
                {timeToFind && <p className="text-muted-foreground">It took you {timeToFind.toFixed(2)} seconds.</p>}
                <Button onClick={newGame} className="mt-6">Play Again</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
