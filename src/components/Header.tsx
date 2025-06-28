import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Michael Choi</h1>
          {/* Desktop nav */}
          <div className="hidden md:flex gap-4">
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
          {/* Mobile nav */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X /> : <Menu />}
            </Button>
            {menuOpen && (
              <div className="absolute top-16 right-4 bg-background rounded-lg shadow-lg flex flex-col gap-2 p-4 z-50 min-w-[150px] border">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  onClick={() => setMenuOpen(false)}
                >
                  <a href="#about">About</a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  onClick={() => setMenuOpen(false)}
                >
                  <a href="#experience">Experience</a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  onClick={() => setMenuOpen(false)}
                >
                  <a href="#projects">Projects</a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  onClick={() => setMenuOpen(false)}
                >
                  <a href="#contact">Contact</a>
                </Button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
