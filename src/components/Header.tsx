import { Button } from '@/components/ui/button';

export const Header = () => (
  <header className="border-b">
    <div className="container mx-auto px-4 py-4">
      <nav className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Michael Choi</h1>
        <div className="flex gap-4">
          <Button variant="ghost" size="sm" asChild>
            <a href="#about">About</a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href="#experience">Experience</a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href="#projects">Projects</a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href="#contact">Contact</a>
          </Button>
        </div>
      </nav>
    </div>
  </header>
);
