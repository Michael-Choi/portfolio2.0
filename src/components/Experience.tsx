import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const Experience = () => (
  <section id="experience" className="py-20 bg-muted/30">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">Experience</h2>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Technical Lead/Engineering Manager</CardTitle>
                  <CardDescription className="text-base">
                    TravelBank Inc. • 2022 - Present (Acquired By U.S. Bank)
                  </CardDescription>
                </div>
                <Badge>Current</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>
                  Built and manage a reliable booking platform integrating with
                  multiple external reservation systems
                </li>
                <li>
                  Designed a fault-tolerant architecture with 99.99% uptime for
                  critical booking services
                </li>
                <li>
                  Optimized MongoDB performance by applying cursor-based
                  pagination, indexing, reducing query times by 40%
                </li>
                <li>
                  Spearheaded the Global Distribution System migration from
                  Apollo to Galileo, enhancing travel features and system
                  performance
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Full Stack Software Engineer</CardTitle>
              <CardDescription className="text-base">
                TravelBank Inc. • 2021 - 2022 (Acquired By U.S. Bank)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>
                  Automated hotel passive booking processes, saving travel
                  agents 500+ hours monthly
                </li>
                <li>
                  Reduced DataDog expenses by $500K annually through targeted
                  exclusion filters
                </li>
                <li>
                  Upgraded old hotel XML API to a modern REST API while
                  maintaining backward compatibility
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Full Stack Software Engineer</CardTitle>
              <CardDescription className="text-base">
                BrokerBay • 2019 - 2021 (Acquired By Carrier)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>
                  Architected job scheduling system using GCP PubSub with
                  leader/worker pattern supporting horizontal scaling
                </li>
                <li>
                  Developed WebRTC virtual tour feature enabling real estate
                  agents to host property showings during COVID-19
                </li>
                <li>
                  Refactored multiple 2000+ line AngularJS pages to React,
                  significantly improving maintainability and development
                  velocity
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </section>
);
