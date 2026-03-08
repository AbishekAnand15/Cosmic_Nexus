import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    const { error } = await supabase.from('subscribers').insert({ email });
    setLoading(false);

    if (error) {
      if (error.code === '23505') {
        toast({ title: '✨ Already subscribed!', description: "You're already part of the cosmos." });
      } else {
        toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' });
      }
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail('');
    }, 5000);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative z-10 max-w-2xl mx-auto px-4 mb-20 text-center"
    >
      <h2 className="font-heading text-xl md:text-2xl font-bold mb-3">
        Stay in <span className="text-primary">Orbit</span>
      </h2>
      <p className="text-muted-foreground font-accent text-sm mb-6">
        Get daily NASA Astronomy Picture of the Day highlights delivered to your inbox every morning.
      </p>
      {submitted ? (
        <p className="text-primary font-accent">🚀 You're subscribed! Welcome aboard.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 px-4 py-3 rounded-xl glow-input text-foreground font-body placeholder:text-muted-foreground outline-none text-sm"
          />
          <button type="submit" disabled={loading} className="glow-button px-5 py-3 rounded-xl flex items-center gap-2 text-sm disabled:opacity-50">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Subscribe
          </button>
        </form>
      )}
    </motion.section>
  );
};

export default NewsletterSection;
