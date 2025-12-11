import { Header } from '@/components/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BreathingExercise } from '@/components/features/breathing-exercise';
import { MotivationCards } from '@/components/features/motivation-cards';
import { RelaxingMinigame } from '@/components/features/relaxing-minigame';
import { StudySchedule } from '@/components/features/study-schedule';
import { StudyMethods } from '@/components/features/study-methods';
import { StressConsultation } from '@/components/features/stress-consultation';
import { Heart, BrainCircuit, Calendar, Gamepad2, Wind, MessageCircleQuestion } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground main-container-bg">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Tabs defaultValue="breathe" className="w-full flex flex-col items-center">
          <TabsList className="grid w-full max-w-3xl grid-cols-3 sm:grid-cols-6 h-auto sm:h-14 p-2">
            <TabsTrigger value="breathe" className="flex flex-col sm:flex-row gap-2 h-12 text-xs sm:text-sm">
              <Wind className="w-5 h-5"/> Breathe
            </TabsTrigger>
            <TabsTrigger value="motivate" className="flex flex-col sm:flex-row gap-2 h-12 text-xs sm:text-sm">
              <Heart className="w-5 h-5"/> Motivate
            </TabsTrigger>
            <TabsTrigger value="relax" className="flex flex-col sm:flex-row gap-2 h-12 text-xs sm:text-sm">
              <Gamepad2 className="w-5 h-5" /> Relax
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex flex-col sm:flex-row gap-2 h-12 text-xs sm:text-sm">
              <Calendar className="w-5 h-5"/> Schedule
            </TabsTrigger>
            <TabsTrigger value="study" className="flex flex-col sm:flex-row gap-2 h-12 text-xs sm:text-sm">
              <BrainCircuit className="w-5 h-5"/> Study
            </TabsTrigger>
            <TabsTrigger value="consult" className="flex flex-col sm:flex-row gap-2 h-12 text-xs sm:text-sm">
              <MessageCircleQuestion className="w-5 h-5"/> Consult
            </TabsTrigger>
          </TabsList>
          <div className="w-full max-w-4xl mt-6">
            <TabsContent value="breathe">
              <BreathingExercise />
            </TabsContent>
            <TabsContent value="motivate">
              <MotivationCards />
            </TabsContent>
            <TabsContent value="relax">
              <RelaxingMinigame />
            </TabsContent>
            <TabsContent value="schedule">
              <StudySchedule />
            </TabsContent>
            <TabsContent value="study">
              <StudyMethods />
            </TabsContent>
            <TabsContent value="consult">
              <StressConsultation />
            </TabsContent>
          </div>
        </Tabs>
      </main>
      <footer className="text-center py-4 text-muted-foreground text-sm">
        <p>Made with ❤️ and a cute duckie.</p>
      </footer>
    </div>
  );
}
