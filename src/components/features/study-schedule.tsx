"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import useLocalStorage from '@/lib/hooks/use-local-storage';
import { PlusCircle, Trash2 } from 'lucide-react';
import { format, isSameDay, parseISO } from 'date-fns';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';

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
        <CardDescription>Add your exams to the calendar to keep track of them.</CardDescription>
    </CardHeader>
    <CardContent className="grid md:grid-cols-2 gap-8">
        <div className="flex justify-center">
            <div className="relative rounded-md border bg-green-50/50 p-4 shadow-inner">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="!p-0 !border-0"
                modifiers={{ event: eventDays }}
                modifiersClassNames={{
                    event: 'bg-yellow-300/50 rounded-full',
                }}
                classNames={{
                    root: 'border-0',
                    caption_label: 'text-lg font-bold text-green-800/80',
                    head_cell: 'text-green-800/70 font-semibold w-12',
                    cell: 'h-12 w-12',
                    day: 'h-12 w-12 text-base text-green-900/80 hover:bg-yellow-100/50 rounded-full',
                    day_selected: 'bg-primary/80 text-primary-foreground rounded-full hover:bg-primary/90',
                    day_today: 'bg-yellow-200/50 text-green-900 rounded-full',
                    day_outside: 'text-green-900/30',
                    nav_button: 'text-green-800/80 hover:text-green-900 hover:bg-yellow-100/50',
                }}
            />
            </div>
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
        <ScrollArea className="h-64">
            <div className="space-y-4 pr-4">
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
        </ScrollArea>
        </div>
    </CardContent>
    </Card>
  );
}
