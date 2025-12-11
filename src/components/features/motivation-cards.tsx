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
        <div className="perspective-1000 p-4 min-h-[450px] flex items-center justify-center">
            <div 
              className={cn(
                  "relative w-full max-w-md h-[350px] transition-transform duration-700 ease-in-out transform-style-3d",
                  isFlipping && "rotate-y-180"
              )}
            >
              {/* Front of the card (the clipboard note) */}
              <div className="absolute w-full h-full backface-hidden">
                <div className="relative w-full h-full pt-12">
                  {/* Clipboard Clip */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-8 bg-slate-800 rounded-t-md flex items-center justify-center p-1 shadow-md">
                    <div className="w-16 h-4 bg-slate-600 rounded-sm"></div>
                  </div>

                  {/* Paper Stack */}
                  <div className="relative w-full h-full bg-white rounded-md shadow-lg
                    before:content-[''] before:absolute before:w-[98%] before:h-full before:bg-white before:rounded-md before:shadow-lg before:-z-10 before:left-[1%] before:top-1
                    after:content-[''] after:absolute after:w-[96%] after:h-full after:bg-white after:rounded-md after:shadow-lg after:-z-20 after:left-[2%] after:top-2"
                  >
                    <div className="h-full p-6 flex flex-col justify-between bg-repeat" style={{backgroundImage: `linear-gradient(to bottom, #e0e0e0 1px, transparent 1px)`, backgroundSize: '100% 2rem' }}>
                        <div className="flex-grow flex items-center justify-center">
                            <p className="text-2xl font-serif text-slate-800 text-center leading-relaxed">
                                “{currentQuote.text}”
                            </p>
                        </div>
                        <div className="flex justify-between items-center pt-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleFavorite(currentQuote.id)}
                                aria-label="Favorite"
                            >
                                <Heart className={cn("w-6 h-6", isFavorite(currentQuote.id) ? "fill-red-500 text-red-500" : "text-gray-400")} />
                            </Button>
                            <Button onClick={showNextQuote} disabled={isFlipping}>Next Quote</Button>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Back of the card (blank note) */}
              <div className="absolute w-full h-full backface-hidden rotate-y-180">
                 <div className="relative w-full h-full pt-12">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-8 bg-slate-800 rounded-t-md"></div>
                    <div className="relative w-full h-full bg-white rounded-md shadow-lg"></div>
                 </div>
              </div>

            </div>
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
