import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => (
  <footer className="relative z-10 py-10 border-t border-border/50">
    <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4">
      <p className="text-sm text-muted-foreground font-accent">
        Built by <span className="text-foreground font-semibold">Abishek Xavier A</span>
      </p>
      <div className="flex items-center gap-4">
        <a
          href="https://www.linkedin.com/in/abishek-xavier-a-249b16256/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors"
          aria-label="LinkedIn"
        >
          <Linkedin size={20} />
        </a>
        <a
          href="https://github.com/AbishekAnand15/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors"
          aria-label="GitHub"
        >
          <Github size={20} />
        </a>
        <a
          href="mailto:abishekxaviera@gmail.com"
          className="text-muted-foreground hover:text-primary transition-colors"
          aria-label="Email"
        >
          <Mail size={20} />
        </a>
      </div>
      <p className="text-xs text-muted-foreground/60 font-accent">
        © {new Date().getFullYear()} Cosmic Nexus — Aggregating the universe, one headline at a time.
      </p>
    </div>
  </footer>
);

export default Footer;
