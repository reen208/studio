"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquareQuote, Star } from 'lucide-react';
import useLocalStorage from '@/lib/hooks/use-local-storage';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const allQuotes = [
  { id: 1, text: "Believe you can and you're halfway there." },
  { id: 2, text: "The secret of getting ahead is getting started." },
  { id: 3, text: "It’s not whether you get knocked down, it’s whether you get up." },
  { id: 4, text: "The only way to do great work is to love what you do." },
  { id: 5, text: "Success is not final, failure is not fatal: it is the courage to continue that counts." },
  { id: 6, text: "Don't watch the clock; do what it does. Keep going." },
  { id: 7, text: "The future belongs to those who believe in the beauty of their dreams." },
  { id: 8, text: "Well done is better than well said." },
];

export function MotivationCards() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [favorites, setFavorites] = useLocalStorage<number[]>('motivationFavorites', []);
  const [isFlipping, setIsFlipping] = useState(false);

  const showNextQuote = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % allQuotes.length);
      setIsFlipping(false);
    }, 300); // Half of the animation duration
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const isFavorite = (id: number) => favorites.includes(id);

  const currentQuote = allQuotes[currentQuoteIndex];
  const favoriteQuotes = allQuotes.filter(q => favorites.includes(q.id));

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="all"><MessageSquareQuote className="mr-2 h-4 w-4"/>All Quotes</TabsTrigger>
        <TabsTrigger value="favorites"><Star className="mr-2 h-4 w-4" />Favorites</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <div className="perspective-1000">
          <Card 
            className={cn(
                "w-full min-h-[350px] flex flex-col transition-transform duration-500 ease-in-out transform-style-3d",
                isFlipping && "rotate-y-180"
            )}
            style={{
                background: 'linear-gradient(to bottom, #fef9e7 0%, #fef9e7 95%, #fceecf 100%)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.08)'
            }}
          >
            <div className={cn("w-full h-full flex flex-col", isFlipping && 'opacity-0')}>
                <CardHeader>
                    <CardTitle>A Dose of Motivation</CardTitle>
                    <CardDescription>A little encouragement to brighten your day.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex items-center justify-center text-center p-6">
                    <p className="text-2xl font-semibold text-amber-900/80" style={{ fontFamily: "'Comic Sans MS', 'Chalkduster', 'cursive'" }}>
                    “{currentQuote.text}”
                    </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFavorite(currentQuote.id)}
                    aria-label="Favorite"
                    >
                    <Heart className={cn("w-6 h-6", isFavorite(currentQuote.id) ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
                    </Button>
                    <Button onClick={showNextQuote} disabled={isFlipping}>Next Quote</Button>
                </CardFooter>
            </div>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="favorites">
        <Card className="w-full min-h-[350px]">
          <CardHeader>
            <CardTitle>Your Favorite Quotes</CardTitle>
            <CardDescription>The words that inspire you the most.</CardDescription>
          </CardHeader>
          <CardContent>
            {favoriteQuotes.length > 0 ? (
              <ul className="space-y-4">
                {favoriteQuotes.map(quote => (
                   <li key={quote.id} className="p-4 bg-muted/50 rounded-lg flex items-start justify-between">
                     <p className="text-foreground italic">“{quote.text}”</p>
                     <Button
                       variant="ghost"
                       size="icon"
                       onClick={() => toggleFavorite(quote.id)}
                       aria-label="Unfavorite"
                     >
                       <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                     </Button>
                   </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-muted-foreground py-10">
                <p>You haven't saved any favorite quotes yet.</p>
                <p>Click the heart icon on a quote to save it here!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}