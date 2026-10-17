import { useEffect } from 'react';
import { Contact } from '@/components/Contact';
import { Experience } from '@/components/Experience';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { HeroConstellation } from '@/components/HeroConstellation';
import { HeroGlobe } from '@/components/HeroGlobe';
import { HeroPaper } from '@/components/HeroPaper';
import { LookPicker } from '@/components/LookPicker';
import { Principles } from '@/components/Principles';
import { Stats } from '@/components/Stats';
import { Timeline } from '@/components/Timeline';
import { Work } from '@/components/Work';
import { readLook } from '@/look';

const look = readLook();

const heroes = {
  constellation: HeroConstellation,
  globe: HeroGlobe,
  paper: HeroPaper,
};

export default function App() {
  const Hero = heroes[look];

  // The sections render after the browser handles the URL hash, so a shared
  // link such as /#work scrolls to its section here.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen">
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <Header themeToggle={look === 'paper'} />
      <main>
        <Hero />
        <Stats />
        <Work />
        <Timeline />
        <Experience />
        <Principles />
        <Contact />
      </main>
      <Footer />
      <LookPicker current={look} />
    </div>
  );
}
