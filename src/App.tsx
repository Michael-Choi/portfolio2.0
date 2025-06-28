import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Experience } from '@/components/Experience';
// import { Projects } from '@/components/Projects';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

export default function Component() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <About />
      <Experience />
      {/* <Projects /> */}
      <Contact />
      <Footer />
    </div>
  );
}
