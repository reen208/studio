"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import useLocalStorage from '@/lib/hooks/use-local-storage';
import { PlusCircle, Trash2 } from 'lucide-react';
import { format, isSameDay, parseISO } from 'date-fns';

type StudyEvent = {
  id: string;
  date: string;
  title: string;
};

export function StudySchedule() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useLocalStorage<StudyEvent[]>('studySchedule', []);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addEvent = () => {
    if (newEventTitle && date) {
      const newEvent: StudyEvent = {
        id: crypto.randomUUID(),
        date: date.toISOString(),
        title: newEventTitle,
      };
      setEvents([...events, newEvent]);
      setNewEventTitle('');
      setIsDialogOpen(false);
    }
  };
  
  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const selectedDayEvents = events.filter(event => date && isSameDay(parseISO(event.date), date));
  const eventDays = events.map(event => parseISO(event.date));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Study Schedule Manager</CardTitle>
        <CardDescription>Plan your study sessions and stay organized.</CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-8">
        <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              modifiers={{ event: eventDays }}
              modifiersStyles={{
                event: {
                  color: 'hsl(var(--primary-foreground))',
                  backgroundColor: 'hsl(var(--primary))',
                }
              }}
            />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Tasks for {date ? format(date, 'PPP') : '...'}
          </h3>
          <div className="space-y-4">
            {selectedDayEvents.length > 0 ? (
              selectedDayEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <p>{event.title}</p>
                  <Button variant="ghost" size="icon" onClick={() => deleteEvent(event.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-6">No study sessions planned for this day.</p>
            )}
             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="w-full mt-4">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Session
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Add New Study Session</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Input 
                            placeholder="E.g., Review Chapter 5" 
                            value={newEventTitle}
                            onChange={(e) => setNewEventTitle(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button onClick={addEvent}>Add</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
