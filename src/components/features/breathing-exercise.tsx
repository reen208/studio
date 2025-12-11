"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const phases = [
  { name: 'Breathe In', duration: 4000 },
  { name: 'Hold', duration: 4000 },
  { name: 'Breathe Out', duration: 6000 },
];

export function BreathingExercise() {
  const [isBreathing, setIsBreathing] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    if (!isBreathing) return;

    const timer = setTimeout(() => {
      setPhaseIndex((prevIndex) => (prevIndex + 1) % phases.length);
    }, phases[phaseIndex].duration);

    return () => clearTimeout(timer);
  }, [isBreathing, phaseIndex]);

  const startBreathing = () => {
    setPhaseIndex(0);
    setIsBreathing(true);
  };

  const stopBreathing = () => {
    setIsBreathing(false);
  };

  const currentPhase = phases[phaseIndex];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Guided Breathing</CardTitle>
        <CardDescription>Follow the guide to calm your mind. A simple 4-4-6 breathing pattern.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-8 pt-6 min-h-[350px]">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <div
            className={cn(
              "absolute w-full h-full bg-primary/20 rounded-full transition-transform duration-[3000ms] ease-in-out",
              isBreathing && (currentPhase.name === 'Breathe In' || currentPhase.name === 'Hold') ? 'scale-100' : 'scale-50',
               !isBreathing && 'scale-50'
            )}
            style={{
                transitionDuration: isBreathing ? `${currentPhase.duration}ms` : '500ms'
            }}
          />
          <div className="relative z-10 text-2xl font-semibold text-primary-foreground bg-primary rounded-full w-32 h-32 flex items-center justify-center text-center">
            {isBreathing ? currentPhase.name : 'Ready?'}
          </div>
        </div>
        <div className="text-center">
          {isBreathing ? (
            <Button onClick={stopBreathing} variant="outline">End Session</Button>
          ) : (
            <Button onClick={startBreathing}>Start Session</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
