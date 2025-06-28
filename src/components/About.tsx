import { Badge } from '@/components/ui/badge';
import { MapPin, Code, Users } from 'lucide-react';

export const About = () => (
  <section id="about" className="py-20">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">About Me</h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-lg text-muted-foreground mb-6">
              With over 5 years of experience in software development and 3
              years in engineering management, I bridge the gap between
              technical excellence and team leadership.
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              I specialize in building scalable web applications using modern
              technologies while fostering collaborative environments where
              engineers can grow and deliver their best work.
            </p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Toronto, CA</span>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Code className="h-5 w-5" />
                Technical Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">TypeScript</Badge>
                <Badge variant="secondary">React</Badge>
                <Badge variant="secondary">Next.js</Badge>
                <Badge variant="secondary">Node.js</Badge>
                <Badge variant="secondary">Mongo</Badge>
                <Badge variant="secondary">Kubernetes</Badge>
                <Badge variant="secondary">PostgreSQL</Badge>
                <Badge variant="secondary">Python</Badge>
                <Badge variant="secondary">AWS</Badge>
                <Badge variant="secondary">Docker</Badge>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Leadership Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Team Building</Badge>
                <Badge variant="outline">Mentoring</Badge>
                <Badge variant="outline">Agile/Scrum</Badge>
                <Badge variant="outline">Technical Strategy</Badge>
                <Badge variant="outline">Code Reviews</Badge>
                <Badge variant="outline">Performance Management</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
