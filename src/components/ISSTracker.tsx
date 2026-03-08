import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Satellite, MapPin, RefreshCw } from 'lucide-react';

interface ISSPosition {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
}

const ISSTracker = () => {
  const [pos, setPos] = useState<ISSPosition | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchISS = async () => {
    try {
      const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
      if (!res.ok) return;
      const data = await res.json();
      setPos({
        latitude: data.latitude,
        longitude: data.longitude,
        altitude: data.altitude,
        velocity: data.velocity,
      });
    } catch {
      // fail silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchISS();
    const interval = setInterval(fetchISS, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative z-10 max-w-5xl mx-auto px-4 mb-16"
    >
      <h2 className="font-heading text-xl md:text-2xl font-bold mb-6 text-center">
        <span className="text-accent">🛰</span> Live ISS Tracker
      </h2>
      <div className="glass-card rounded-2xl p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 text-accent animate-spin" />
          </div>
        ) : pos ? (
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Map embed */}
            <div className="md:w-1/2 w-full rounded-xl overflow-hidden h-64">
              <iframe
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${pos.longitude - 10},${pos.latitude - 5},${pos.longitude + 10},${pos.latitude + 5}&layer=mapnik&marker=${pos.latitude},${pos.longitude}`}
                className="w-full h-full border-0 rounded-xl"
                title="ISS Location"
                loading="lazy"
              />
            </div>
            {/* Stats */}
            <div className="md:w-1/2 w-full grid grid-cols-2 gap-4">
              <div className="glass-card rounded-xl p-4 text-center">
                <MapPin className="w-5 h-5 text-accent mx-auto mb-2" />
                <p className="text-xs text-muted-foreground font-accent mb-1">Latitude</p>
                <p className="font-heading text-lg font-bold text-foreground">{pos.latitude.toFixed(4)}°</p>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <MapPin className="w-5 h-5 text-accent mx-auto mb-2" />
                <p className="text-xs text-muted-foreground font-accent mb-1">Longitude</p>
                <p className="font-heading text-lg font-bold text-foreground">{pos.longitude.toFixed(4)}°</p>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <Satellite className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground font-accent mb-1">Altitude</p>
                <p className="font-heading text-lg font-bold text-foreground">{pos.altitude.toFixed(1)} km</p>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <Satellite className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground font-accent mb-1">Velocity</p>
                <p className="font-heading text-lg font-bold text-foreground">{pos.velocity.toFixed(0)} km/h</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground font-body">Unable to fetch ISS data</p>
        )}
        <p className="text-xs text-muted-foreground font-accent text-center mt-4">
          Updates every 5 seconds • Data from wheretheiss.at
        </p>
      </div>
    </motion.section>
  );
};

export default ISSTracker;
