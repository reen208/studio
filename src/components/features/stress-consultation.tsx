"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { generateStressCopingFeedbackAction } from "@/app/actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Bot, Loader2 } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Getting Feedback...
        </>
      ) : "Get Feedback"}
    </Button>
  );
}

export function StressConsultation() {
  const initialState = { message: null, errors: null, feedback: null };
  const [state, dispatch] = useActionState(generateStressCopingFeedbackAction, initialState);
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
          <CardTitle>Consult with Duckie</CardTitle>
          <CardDescription>Share what's on your mind. Our AI friend is here to listen and offer a kind word.</CardDescription>
        </CardHeader>
        <form action={dispatch}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="situation">What's making you feel stressed?</Label>
              <Textarea 
                id="situation" 
                name="situation" 
                placeholder="e.g., I have three exams next week and I feel overwhelmed..."
                rows={8}
              />
              {state.errors?.situation && <p className="text-sm text-destructive">{state.errors.situation[0]}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bot /> Duckie's Feedback</CardTitle>
          <CardDescription>A little support to help you through.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          {state.feedback ? (
             <div className="prose prose-sm max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: state.feedback.replace(/\n/g, '<br />') }} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Share your thoughts to get some feedback.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
