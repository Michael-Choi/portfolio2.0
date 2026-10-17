import { useEffect } from 'react';
import { Contact } from '@/components/Contact';
import { Experience } from '@/components/Experience';
import { Focus } from '@/components/Focus';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Principles } from '@/components/Principles';
import { Timeline } from '@/components/Timeline';
import { Work } from '@/components/Work';

export default function App() {
  // The sections render after the browser handles the URL hash, so a shared
  // link such as /#work scrolls to its section here.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen">
      <a
        href="#focus"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <Header />
      <main>
        <Hero />
        <Focus />
        <Work />
        <Timeline />
        <Experience />
        <Principles />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
