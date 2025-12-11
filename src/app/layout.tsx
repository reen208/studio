import type { Metadata } from 'next';
import { PT_Sans, Caveat } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster"

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-sans',
});

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-handwriting',
});


export const metadata: Metadata = {
  title: 'DuckieMind',
  description: 'A cute and calming psychology app for students.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Caveat:wght@400..700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased', ptSans.variable, caveat.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
