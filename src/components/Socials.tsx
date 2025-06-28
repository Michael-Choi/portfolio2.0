import { Button } from '@/components/ui/button';
import { Github, Linkedin, Mail } from 'lucide-react';

export const Socials = () => (
  <>
    <Button variant="ghost" size="icon" asChild>
      <a
        href="https://github.com/Michael-Choi"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Github className="h-4 w-4" />
        <span className="sr-only">GitHub</span>
      </a>
    </Button>
    <Button variant="ghost" size="icon" asChild>
      <a
        href="https://www.linkedin.com/in/michael-b-choi/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Linkedin className="h-4 w-4" />
        <span className="sr-only">LinkedIn</span>
      </a>
    </Button>
    <Button variant="ghost" size="icon" asChild>
      <a href="mailto:michael@michaelchoi.ca">
        <Mail className="h-4 w-4" />
        <span className="sr-only">Email</span>
      </a>
    </Button>
  </>
);
