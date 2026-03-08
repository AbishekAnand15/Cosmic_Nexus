import logo from '@/assets/logo.png';

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center">
      <span className="font-heading text-2xl font-bold tracking-wider text-foreground drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
        COSMIC NEXUS
      </span>
    </div>
  </nav>
);


export default Navbar;