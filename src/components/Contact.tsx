import { Button } from '@/components/ui/button';
import { Mail, Linkedin } from 'lucide-react';

export const Contact = () => (
  <section id="contact" className="py-20 bg-muted/30">
    <div className="container mx-auto px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Let's Work Together</h2>
        <p className="text-lg text-muted-foreground mb-8">
          I'm always interested in discussing new opportunities, technical
          challenges, or just connecting with fellow engineers and leaders.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <a href="mailto:michael@michaelchoi.ca">
              <Mail className="h-5 w-5 mr-2" />
              Send Email
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a
              href="https://www.linkedin.com/in/michael-b-choi/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="h-5 w-5 mr-2" />
              Connect on LinkedIn
            </a>
          </Button>
        </div>
      </div>
    </div>
  </section>
);
