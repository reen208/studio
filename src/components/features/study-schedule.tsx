"use client";

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { generateStudyScheduleAction } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import useLocalStorage from '@/lib/hooks/use-local-storage';
import { PlusCircle, Trash2, Bot, Loader2, BookOpenCheck } from 'lucide-react';
import { format, isSameDay, parseISO } from 'date-fns';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';
import { Caveat } from 'next/font/google';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '../ui/scroll-area';

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-handwriting',
});

type ExamEvent = {
  id: string;
  date: string;
  title: string;
  time: string;
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Schedule...
          </>
        ) : (
          <>
            <BookOpenCheck className="mr-2 h-4 w-4" />
            Get Study Plan Recommendation
          </>
        )}
      </Button>
    );
}

export function StudySchedule() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useLocalStorage<ExamEvent[]>('studySchedule', []);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const initialState = { message: null, errors: null, schedule: null };
  const [state, dispatch] = useFormState(generateStudyScheduleAction, initialState);

  useEffect(() => {
    if (state.message && state.message !== "Success!") {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: state.message,
      });
    }
  }, [state, toast]);

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
    <div className="grid lg:grid-cols-2 gap-8">
        <Card className={cn("w-full", caveat.variable)}>
        <CardHeader>
            <CardTitle>Upcoming Exams & Tests</CardTitle>
            <CardDescription>Add your exams to the calendar, then let the AI create a study plan for you.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
            <div className="flex justify-center">
                <div className="relative rounded-md border bg-green-50/50 p-4 shadow-inner" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'hsla(130, 40%, 65%, 0.1)\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")', backgroundBlendMode: 'overlay'}}>
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="!p-0 !border-0"
                    modifiers={{ event: eventDays }}
                    classNames={{
                        root: 'border-0',
                        caption_label: 'text-5xl font-bold text-green-800/80 font-handwriting',
                        head_cell: 'text-green-800/70 font-handwriting text-2xl font-semibold w-12',
                        cell: 'h-12 w-12',
                        day: 'h-12 w-12 text-xl font-handwriting font-bold text-green-900/80 hover:bg-yellow-100/50 rounded-full',
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
                            <PlusCircle className="mr-2 h-4 w-4" /> Add study plan
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
        <CardFooter>
            <form action={dispatch} className="w-full">
                <input type="hidden" name="exams" value={JSON.stringify(events.map(e => ({ title: e.title, date: format(parseISO(e.date), 'PPP') })))} />
                <SubmitButton />
            </form>
        </CardFooter>
        </Card>

        <Card className="flex flex-col">
            <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bot /> Your Study Schedule</CardTitle>
            <CardDescription>Here's a recommended study plan based on your upcoming exams.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
            {state.schedule ? (
                <ScrollArea className="h-[500px] pr-4">
                    <div className="prose prose-sm max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: state.schedule.replace(/\n/g, '<br />') }} />
                </ScrollArea>
            ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Add your exams and click "Generate" to get your plan!</p>
                </div>
            )}
            </CardContent>
        </Card>
    </div>
  );
}
