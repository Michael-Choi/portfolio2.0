import { Socials } from './Socials';

export const Footer = () => (
  <footer className="border-t py-8">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-muted-foreground">© 2024 Michael Choi.</p>
        <div className="flex gap-4">
          <Socials />
        </div>
      </div>
    </div>
  </footer>
);
