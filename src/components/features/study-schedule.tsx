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
import { Label } from '../ui/label';

type ExamEvent = {
  id: string;
  date: string;
  title: string;
  time: string;
};

export function StudySchedule() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useLocalStorage<ExamEvent[]>('studySchedule', []);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addEvent = () => {
    if (newEventTitle && date) {
      const newEvent: ExamEvent = {
        id: crypto.randomUUID(),
        date: date.toISOString(),
        title: newEventTitle,
        time: newEventTime,
      };
      setEvents([...events, newEvent].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      setNewEventTitle('');
      setNewEventTime('');
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
        <CardTitle>Upcoming Exams & Tests</CardTitle>
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
                Tasks for {date ? format(date, 'PPP') : '...'}
            </h3>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button size="sm">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Exam
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Add New Exam/Test</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="exam-title">Exam/Test Title</Label>
                          <Input 
                              id="exam-title"
                              placeholder="E.g., Psychology Midterm" 
                              value={newEventTitle}
                              onChange={(e) => setNewEventTitle(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="exam-time">Time (Optional)</Label>
                          <Input 
                              id="exam-time"
                              placeholder="E.g., 10:00 AM" 
                              value={newEventTime}
                              onChange={(e) => setNewEventTime(e.target.value)}
                          />
                        </div>
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
          <div className="space-y-4">
            {selectedDayEvents.length > 0 ? (
              selectedDayEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-semibold">{event.title}</p>
                    {event.time && <p className="text-sm text-muted-foreground">{event.time}</p>}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteEvent(event.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-6">No exams planned for this day.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
