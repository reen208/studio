import { DuckIcon } from '@/components/icons/duck-icon';

export function Header() {
  return (
    <header className="py-6">
      <div className="container mx-auto flex items-center justify-center gap-4">
        <DuckIcon className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground font-headline">
          DuckieMind
        </h1>
      </div>
    </header>
  );
}
