import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface CelestialObject {
  name: string;
  type: string;
  color: string;
  size: number;
  description: string;
  facts: { label: string; value: string }[];
  category: string;
  image: string;
}

const OBJECTS: CelestialObject[] = [
  // === Solar System Bodies ===
  {
    name: 'Meteoroid',
    type: 'Space Debris',
    color: 'hsl(20, 15%, 40%)',
    size: 48,
    category: 'Solar System',
    image: '/images/celestial/meteoroid.jpg',
    description: 'Small rocky or metallic particles in space. When they enter Earth\'s atmosphere, they become meteors ("shooting stars").',
    facts: [
      { label: 'Size Range', value: 'Dust to ~1m' },
      { label: 'Speed', value: 'Up to 72 km/s' },
      { label: 'In Atmosphere', value: 'Called Meteor' },
      { label: 'Hits Ground', value: 'Called Meteorite' },
    ],
  },
  {
    name: 'Asteroid',
    type: 'Minor Planet',
    color: 'hsl(30, 15%, 45%)',
    size: 52,
    category: 'Solar System',
    image: '/images/celestial/asteroid.jpg',
    description: 'Rocky bodies orbiting the Sun, mostly found in the belt between Mars and Jupiter.',
    facts: [
      { label: 'Largest', value: 'Ceres (940 km)' },
      { label: 'Belt Location', value: 'Mars–Jupiter' },
      { label: 'Known Count', value: '1.3 million+' },
      { label: 'Composition', value: 'Rock & metal' },
    ],
  },
  {
    name: 'Comet',
    type: 'Icy Body',
    color: 'hsl(190, 60%, 65%)',
    size: 52,
    category: 'Solar System',
    image: '/images/celestial/comet.jpg',
    description: 'Icy objects that develop glowing tails when approaching the Sun.',
    facts: [
      { label: 'Origin', value: 'Oort Cloud / Kuiper Belt' },
      { label: 'Famous', value: "Halley's Comet" },
      { label: 'Tail Length', value: 'Up to 150M km' },
      { label: 'Composition', value: 'Ice, dust, gas' },
    ],
  },
  {
    name: 'Dwarf Planet',
    type: 'Sub-Planetary',
    color: 'hsl(200, 25%, 50%)',
    size: 56,
    category: 'Solar System',
    image: '/images/celestial/dwarf-planet.jpg',
    description: 'Bodies large enough for gravity to make them round, but haven\'t cleared their orbital neighborhood.',
    facts: [
      { label: 'Known', value: '5 recognized (IAU)' },
      { label: 'Famous', value: 'Pluto, Eris, Ceres' },
      { label: 'Pluto Size', value: '2,377 km' },
      { label: 'Location', value: 'Asteroid & Kuiper Belt' },
    ],
  },
  {
    name: 'Moon',
    type: 'Natural Satellite',
    color: 'hsl(40, 10%, 65%)',
    size: 56,
    category: 'Solar System',
    image: '/images/celestial/moon.jpg',
    description: 'Natural satellites orbiting planets, ranging from tiny rocks to worlds with atmospheres.',
    facts: [
      { label: 'Our Moon', value: '3,474 km' },
      { label: 'Largest', value: 'Ganymede (5,268 km)' },
      { label: 'Total Known', value: '290+' },
      { label: 'Has Atmosphere', value: 'Titan (Saturn)' },
    ],
  },
  {
    name: 'Planet',
    type: 'Major Body',
    color: 'hsl(210, 60%, 50%)',
    size: 64,
    category: 'Solar System',
    image: '/images/celestial/planet.jpg',
    description: 'Large bodies that orbit a star, have cleared their orbit, and are in hydrostatic equilibrium.',
    facts: [
      { label: 'In Solar System', value: '8 planets' },
      { label: 'Largest', value: 'Jupiter (139,820 km)' },
      { label: 'Smallest', value: 'Mercury (4,879 km)' },
      { label: 'Types', value: 'Rocky & Gas/Ice Giant' },
    ],
  },
  // === Stellar Objects ===
  {
    name: 'Brown Dwarf',
    type: 'Failed Star',
    color: 'hsl(15, 50%, 35%)',
    size: 56,
    category: 'Stellar',
    image: '/images/celestial/brown-dwarf.jpg',
    description: 'Objects too massive to be planets but too small to sustain hydrogen fusion like true stars.',
    facts: [
      { label: 'Mass Range', value: '13–80× Jupiter' },
      { label: 'Temperature', value: '300–2,500 K' },
      { label: 'First Found', value: '1995 (Teide 1)' },
      { label: 'Fusion', value: 'Deuterium only' },
    ],
  },
  {
    name: 'Red Dwarf',
    type: 'Small Star',
    color: 'hsl(5, 60%, 40%)',
    size: 56,
    category: 'Stellar',
    image: '/images/celestial/red-dwarf.jpg',
    description: 'The smallest and coolest main-sequence stars, making up ~70% of all stars in the Milky Way.',
    facts: [
      { label: 'Nearest', value: 'Proxima Centauri' },
      { label: 'Lifespan', value: 'Trillions of years' },
      { label: 'Temperature', value: '2,500–3,500 K' },
      { label: 'Prevalence', value: '70% of all stars' },
    ],
  },
  {
    name: 'Star',
    type: 'Main Sequence',
    color: 'hsl(45, 90%, 55%)',
    size: 64,
    category: 'Stellar',
    image: '/images/celestial/star.jpg',
    description: 'Massive spheres of plasma powered by nuclear fusion, the building blocks of galaxies.',
    facts: [
      { label: 'Our Star', value: 'Sun (1.39M km)' },
      { label: 'Surface Temp', value: '5,778 K (Sun)' },
      { label: 'Types', value: 'O, B, A, F, G, K, M' },
      { label: 'Milky Way', value: '100–400 billion' },
    ],
  },
  {
    name: 'Giant Star',
    type: 'Evolved Star',
    color: 'hsl(25, 70%, 50%)',
    size: 72,
    category: 'Stellar',
    image: '/images/celestial/giant-star.jpg',
    description: 'Stars that have exhausted hydrogen in their cores and expanded enormously. Includes red and blue giants.',
    facts: [
      { label: 'Famous', value: 'Betelgeuse, Aldebaran' },
      { label: 'Size', value: '10–100× Sun radius' },
      { label: 'Stage', value: 'Late stellar evolution' },
      { label: 'Fate', value: 'Supernova or White Dwarf' },
    ],
  },
  {
    name: 'White Dwarf',
    type: 'Stellar Remnant',
    color: 'hsl(210, 20%, 80%)',
    size: 52,
    category: 'Stellar',
    image: '/images/celestial/white-dwarf.jpg',
    description: 'The dense, Earth-sized remnant of a low-to-medium mass star after it has shed its outer layers.',
    facts: [
      { label: 'Density', value: '~1 ton per cm³' },
      { label: 'Size', value: '≈ Earth' },
      { label: 'Mass', value: '≈ Sun' },
      { label: 'Temperature', value: '8,000–40,000 K' },
    ],
  },
  {
    name: 'Neutron Star',
    type: 'Collapsed Star',
    color: 'hsl(270, 50%, 60%)',
    size: 52,
    category: 'Stellar',
    image: '/images/celestial/neutron-star.jpg',
    description: 'Ultra-dense remnants of massive stars. A teaspoon would weigh a billion tons.',
    facts: [
      { label: 'Size', value: '~20 km diameter' },
      { label: 'Density', value: '10¹⁷ kg/m³' },
      { label: 'Spin Rate', value: 'Up to 716 rev/s' },
      { label: 'Subtype', value: 'Pulsars, Magnetars' },
    ],
  },
  {
    name: 'Pulsar',
    type: 'Rotating Neutron Star',
    color: 'hsl(180, 70%, 50%)',
    size: 52,
    category: 'Stellar',
    image: '/images/celestial/pulsar.jpg',
    description: 'Rapidly spinning neutron stars that emit beams of radiation, appearing to pulse like a lighthouse.',
    facts: [
      { label: 'First Found', value: '1967 (Jocelyn Bell)' },
      { label: 'Fastest', value: '716 rotations/sec' },
      { label: 'Known Count', value: '3,000+' },
      { label: 'Use', value: 'Cosmic GPS clocks' },
    ],
  },
  // === Extreme Objects ===
  {
    name: 'Black Hole',
    type: 'Singularity',
    color: 'hsl(260, 70%, 30%)',
    size: 64,
    category: 'Extreme',
    image: '/images/celestial/black-hole.jpg',
    description: 'Regions of spacetime where gravity is so extreme that nothing, not even light, can escape.',
    facts: [
      { label: 'Nearest', value: 'Gaia BH1 (1,560 ly)' },
      { label: 'Largest Known', value: 'TON 618 (66B M☉)' },
      { label: 'First Image', value: 'M87* (2019)' },
      { label: 'Types', value: 'Stellar & Supermassive' },
    ],
  },
  {
    name: 'Quasar',
    type: 'Active Galactic Nucleus',
    color: 'hsl(200, 80%, 55%)',
    size: 60,
    category: 'Extreme',
    image: '/images/celestial/quasar.jpg',
    description: 'Extremely luminous active galactic nuclei powered by supermassive black holes consuming matter.',
    facts: [
      { label: 'Brightest', value: '3C 273' },
      { label: 'Luminosity', value: 'Trillions of Suns' },
      { label: 'Farthest', value: '13.03 billion ly' },
      { label: 'First Found', value: '1963' },
    ],
  },
  {
    name: 'Magnetar',
    type: 'Magnetic Neutron Star',
    color: 'hsl(330, 60%, 45%)',
    size: 52,
    category: 'Extreme',
    image: '/images/celestial/magnetar.jpg',
    description: 'Neutron stars with extraordinarily powerful magnetic fields, the strongest magnets in the universe.',
    facts: [
      { label: 'Mag. Field', value: '10⁹–10¹¹ Tesla' },
      { label: 'Known Count', value: '~30' },
      { label: 'Lifespan', value: '~10,000 years' },
      { label: 'Emits', value: 'X-rays, gamma rays' },
    ],
  },
  // === Large-Scale Structures ===
  {
    name: 'Nebula',
    type: 'Gas Cloud',
    color: 'hsl(280, 50%, 55%)',
    size: 72,
    category: 'Large-Scale',
    image: '/images/celestial/nebula.jpg',
    description: 'Vast clouds of gas and dust — stellar nurseries where new stars are born.',
    facts: [
      { label: 'Famous', value: 'Orion, Eagle, Crab' },
      { label: 'Size Range', value: 'Light-years across' },
      { label: 'Types', value: 'Emission, Reflection, Dark' },
      { label: 'Composition', value: 'Hydrogen & Helium' },
    ],
  },
  {
    name: 'Supernova Remnant',
    type: 'Explosion Debris',
    color: 'hsl(0, 60%, 50%)',
    size: 72,
    category: 'Large-Scale',
    image: '/images/celestial/supernova-remnant.jpg',
    description: 'The expanding shell of gas and dust left behind after a massive star explodes as a supernova.',
    facts: [
      { label: 'Famous', value: 'Crab Nebula (1054 AD)' },
      { label: 'Expansion', value: '~1,500 km/s' },
      { label: 'Duration', value: 'Visible ~100,000 yrs' },
      { label: 'Creates', value: 'Heavy elements' },
    ],
  },
  {
    name: 'Star Cluster',
    type: 'Stellar Group',
    color: 'hsl(50, 60%, 55%)',
    size: 72,
    category: 'Large-Scale',
    image: '/images/celestial/star-cluster.jpg',
    description: 'Groups of stars bound together by gravity. Open clusters are young; globular clusters are ancient.',
    facts: [
      { label: 'Types', value: 'Open & Globular' },
      { label: 'Famous', value: 'Pleiades, Omega Centauri' },
      { label: 'Stars', value: '100 to millions' },
      { label: 'Age', value: 'Millions to billions yrs' },
    ],
  },
  {
    name: 'Galaxy',
    type: 'Star System',
    color: 'hsl(220, 50%, 55%)',
    size: 80,
    category: 'Large-Scale',
    image: '/images/celestial/galaxy.jpg',
    description: 'Massive systems of stars, gas, dust, and dark matter bound together by gravity.',
    facts: [
      { label: 'Our Galaxy', value: 'Milky Way' },
      { label: 'Nearest', value: 'Andromeda (2.5M ly)' },
      { label: 'Observable', value: '2 trillion+' },
      { label: 'Types', value: 'Spiral, Elliptical, Irregular' },
    ],
  },
  {
    name: 'Galaxy Cluster',
    type: 'Cosmic Structure',
    color: 'hsl(240, 40%, 50%)',
    size: 80,
    category: 'Large-Scale',
    image: '/images/celestial/galaxy-cluster.jpg',
    description: 'Collections of hundreds to thousands of galaxies bound by gravity, among the largest structures in the universe.',
    facts: [
      { label: 'Our Cluster', value: 'Virgo Supercluster' },
      { label: 'Largest', value: 'El Gordo (~2M billion M☉)' },
      { label: 'Size', value: '10–30 million ly' },
      { label: 'Contains', value: 'Dark matter ~80%' },
    ],
  },
  {
    name: 'Cosmic Web',
    type: 'Universe Structure',
    color: 'hsl(170, 40%, 45%)',
    size: 80,
    category: 'Large-Scale',
    image: '/images/celestial/cosmic-web.jpg',
    description: 'The largest known structure — a vast network of filaments connecting galaxy clusters across the observable universe.',
    facts: [
      { label: 'Filaments', value: 'Billions of ly long' },
      { label: 'Voids', value: '100–300 million ly' },
      { label: 'Composition', value: 'Dark matter filaments' },
      { label: 'Observable', value: '93 billion ly diameter' },
    ],
  },
];

const CATEGORIES = ['All', 'Solar System', 'Stellar', 'Extreme', 'Large-Scale'];

const PlanetComparison = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredObjects = activeCategory === 'All'
    ? OBJECTS
    : OBJECTS.filter((o) => o.category === activeCategory);

  useEffect(() => {
    if (selected !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selected]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative z-10 max-w-5xl mx-auto px-4 mb-16"
    >
      <h2 className="font-heading text-xl md:text-2xl font-bold mb-2 text-center">
        <span className="text-accent">✨</span> Celestial Objects
      </h2>
      <p className="text-sm text-muted-foreground font-accent text-center mb-6">
        From meteoroids to the cosmic web — tap to explore
      </p>

      {/* Category filter */}
      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setSelected(null); }}
            className={`px-3 py-1.5 rounded-full text-xs font-accent transition-all duration-300 ${
              activeCategory === cat
                ? 'glow-button text-foreground'
                : 'glass-card text-muted-foreground hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="glass-card rounded-2xl p-6">
        {/* Objects grid */}
        <div className="flex items-end justify-center gap-3 md:gap-4 py-6 overflow-x-auto flex-wrap">
          {filteredObjects.map((obj, i) => {
            const globalIndex = OBJECTS.indexOf(obj);
            const isSelected = selected === globalIndex;
            return (
              <motion.div
                key={obj.name}
                className="flex flex-col items-center gap-2 cursor-pointer shrink-0"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 200 }}
                onClick={() => setSelected(isSelected ? null : globalIndex)}
              >
                <div className="relative flex items-center justify-center" style={{ width: obj.size + 16, height: obj.size + 16 }}>
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ border: `1.5px solid ${obj.color}40` }}
                    animate={isSelected ? { scale: [1, 1.25, 1], opacity: [0.3, 0.7, 0.3] } : { scale: 1, opacity: 0.2 }}
                    transition={isSelected ? { duration: 2, repeat: Infinity } : { duration: 0.3 }}
                  />
                  <motion.div
                    className="rounded-full overflow-hidden"
                    style={{
                      width: obj.size,
                      height: obj.size,
                      boxShadow: `0 0 ${obj.size / 2.5}px ${obj.color}50`,
                    }}
                    whileHover={{ scale: 1.15 }}
                    animate={isSelected ? { boxShadow: `0 0 ${obj.size}px ${obj.color}80` } : {}}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <img
                      src={obj.image}
                      alt={obj.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </motion.div>
                </div>
                <span className={`text-[10px] md:text-xs font-accent text-center transition-colors duration-300 max-w-[70px] leading-tight ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                  {obj.name}
                </span>
                <span className="text-[8px] md:text-[9px] text-muted-foreground/50 font-accent max-w-[70px] text-center leading-tight">
                  {obj.type}
                </span>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Full-screen modal overlay - rendered via portal to escape stacking context */}
      {createPortal(
        <AnimatePresence>
          {selected !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setSelected(null)}
            >
              {/* Backdrop */}
              <div className="absolute inset-0 bg-background" style={{ backgroundColor: 'hsl(230, 60%, 3%)' }} />

            {/* Modal content */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative glass-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10"
              >
                <X size={20} />
              </button>

              {/* Image */}
              <div className="flex justify-center mb-6">
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden"
                  style={{ boxShadow: `0 0 40px ${OBJECTS[selected].color}60, 0 0 80px ${OBJECTS[selected].color}20` }}
                >
                  <img src={OBJECTS[selected].image} alt={OBJECTS[selected].name} className="w-full h-full object-cover" />
                </motion.div>
              </div>

              {/* Title */}
              <div className="text-center mb-4">
                <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-1">{OBJECTS[selected].name}</h3>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-accent text-muted-foreground">{OBJECTS[selected].type}</span>
                  <span className="text-xs font-accent text-muted-foreground px-2 py-0.5 rounded-full glass-card">{OBJECTS[selected].category}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm md:text-base text-muted-foreground font-body mb-6 text-center max-w-lg mx-auto leading-relaxed">
                {OBJECTS[selected].description}
              </p>

              {/* Facts grid */}
              <div className="grid grid-cols-2 gap-3">
                {OBJECTS[selected].facts.map((fact, i) => (
                  <motion.div
                    key={fact.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="text-center p-4 rounded-xl"
                    style={{ background: `${OBJECTS[selected].color}10`, border: `1px solid ${OBJECTS[selected].color}20` }}
                  >
                    <span className="text-[10px] md:text-xs text-muted-foreground font-accent block mb-1">{fact.label}</span>
                    <span className="text-sm md:text-base font-semibold text-foreground font-body">{fact.value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
      )}
    </motion.section>
  );
};

export default PlanetComparison;
