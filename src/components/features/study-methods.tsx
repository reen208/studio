"use client";

import { useFormState, useFormStatus } from "react-dom";
import { generateStudyRecommendationsAction } from "@/app/actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Bot, Loader2 } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : "Get Recommendations"}
    </Button>
  );
}

export function StudyMethods() {
  const initialState = { message: null, errors: null, recommendations: null };
  const [state, dispatch] = useFormState(generateStudyRecommendationsAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && state.message !== "Success!") {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Personalized Study Methods</CardTitle>
          <CardDescription>Tell us about your needs, and our AI will suggest the best study methods for you.</CardDescription>
        </CardHeader>
        <form action={dispatch}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="course">Course Name</Label>
              <Input id="course" name="course" placeholder="e.g., Introduction to Psychology" />
              {state.errors?.course && <p className="text-sm text-destructive">{state.errors.course[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="learningStyle">Preferred Learning Style</Label>
              <Select name="learningStyle" defaultValue="visual">
                <SelectTrigger id="learningStyle">
                  <SelectValue placeholder="Select your style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visual">Visual (seeing)</SelectItem>
                  <SelectItem value="auditory">Auditory (hearing)</SelectItem>
                  <SelectItem value="kinesthetic">Kinesthetic (doing)</SelectItem>
                  <SelectItem value="reading-writing">Reading/Writing</SelectItem>
                </SelectContent>
              </Select>
              {state.errors?.learningStyle && <p className="text-sm text-destructive">{state.errors.learningStyle[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="studyGoals">Study Goals</Label>
              <Textarea id="studyGoals" name="studyGoals" placeholder="e.g., Pass my final exams with an A, understand core concepts..." />
              {state.errors?.studyGoals && <p className="text-sm text-destructive">{state.errors.studyGoals[0]}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bot /> AI Recommendations</CardTitle>
          <CardDescription>Your personalized study plan will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          {state.recommendations ? (
             <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap font-sans">
                {state.recommendations}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Fill out the form to get started!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
