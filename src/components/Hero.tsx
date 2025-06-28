import { Button } from '@/components/ui/button';
import { Socials } from './Socials';

export const Hero = () => (
  <section className="py-20 bg-muted/30">
    <div className="container mx-auto px-4 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Fullstack Engineer & Engineering Manager
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Building scalable web applications and leading high-performing
          engineering teams. Passionate about clean code, system architecture,
          and team growth.
        </p>
        <div className="flex justify-center gap-4 mb-8">
          <Button asChild>
            <a href="#contact">Get In Touch</a>
          </Button>
          {/* finish some fun projects before adding this in */}
          {/* <Button variant="outline" asChild>
            <a href="#projects">View Projects</a>
          </Button> */}
        </div>
        <div className="flex justify-center gap-6">
          <Socials />
        </div>
      </div>
    </div>
  </section>
);
