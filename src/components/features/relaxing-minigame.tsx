"use client";

import { useState, useEffect, useCallback, MouseEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DuckIcon } from '../icons/duck-icon';
import { Fish } from 'lucide-react';

const GAME_DURATION = 30; // 30 seconds

type Position = { top: number; left: number };

export function RelaxingMinigame() {
  const [duckPosition, setDuckPosition] = useState<Position>({ top: 50, left: 50 });
  const [fishes, setFishes] = useState<Position[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'over'>('ready');

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (gameState !== 'playing') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setDuckPosition({ top: (y / rect.height) * 100, left: (x / rect.width) * 100 });
  };

  const spawnFish = useCallback(() => {
    setFishes(f => [...f, {
      top: Math.random() * 90 + 5,
      left: Math.random() * 90 + 5,
    }]);
  }, []);
  
  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setFishes([]);
    setGameState('playing');
    // initial fish
    for(let i=0; i<5; i++){
        setTimeout(spawnFish, i*200);
    }
  };

  // Game timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (timeLeft <= 0) {
      setGameState('over');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // Fish spawning logic
  useEffect(() => {
    if (gameState !== 'playing') return;

    const fishInterval = setInterval(() => {
        if(fishes.length < 10) {
            spawnFish();
        }
    }, 1000);

    return () => clearInterval(fishInterval);
  }, [gameState, spawnFish, fishes.length]);
  
  // Collision detection
  useEffect(() => {
    if (gameState !== 'playing') return;

    const duckSize = 5; // Assuming duck is roughly 5% of container
    const caughtFishes: number[] = [];

    fishes.forEach((fish, index) => {
        const dx = duckPosition.left - fish.left;
        const dy = duckPosition.top - fish.top;
        const distance = Math.sqrt(dx*dx + dy*dy);
        if(distance < duckSize / 2){
            caughtFishes.push(index);
        }
    });

    if(caughtFishes.length > 0) {
        setScore(s => s + caughtFishes.length);
        setFishes(f => f.filter((_, i) => !caughtFishes.includes(i)));
    }

  }, [duckPosition, fishes, gameState])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Duckie Catches Fish</CardTitle>
        <CardDescription>Help the duckie catch as many fish as you can in 30 seconds!</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        <div 
            className="relative w-full h-96 bg-blue-200/40 rounded-lg overflow-hidden border cursor-crosshair"
            onMouseMove={handleMouseMove}
        >
          {gameState === 'playing' && (
             <DuckIcon
                className="w-12 h-12 text-primary absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-75"
                style={{ top: `${duckPosition.top}%`, left: `${duckPosition.left}%` }}
              />
          )}

          {gameState === 'playing' && fishes.map((fish, i) => (
             <Fish key={i} className="w-6 h-6 text-blue-600 absolute" style={{ top: `${fish.top}%`, left: `${fish.left}%` }} />
          ))}

          {gameState !== 'playing' && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                {gameState === 'ready' && (
                    <>
                        <h3 className="text-2xl font-bold mt-4">Ready to play?</h3>
                        <Button onClick={startGame} className="mt-6">Start Game</Button>
                    </>
                )}
                {gameState === 'over' && (
                    <>
                        <h3 className="text-2xl font-bold mt-4">Game Over!</h3>
                        <p className="text-muted-foreground mt-2 text-lg">You caught {score} fish!</p>
                        <Button onClick={startGame} className="mt-6">Play Again</Button>
                    </>
                )}
            </div>
          )}

        </div>
        <div className="w-full flex justify-between items-center text-lg font-semibold px-2">
            <span>Score: {score}</span>
            <span>Time: {timeLeft}s</span>
        </div>
      </CardContent>
    </Card>
  );
}