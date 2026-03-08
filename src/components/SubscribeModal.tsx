import { useState } from 'react';
import { Mail, Send, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

const SubscribeModal = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    const { error } = await supabase.from('subscribers').insert({ email });

    setLoading(false);

    if (error) {
      if (error.code === '23505') {
        toast({ title: '✨ Already subscribed!', description: "You're already part of the cosmos." });
      } else {
        toast({ title: 'Error', description: 'Something went wrong. Please try again.', variant: 'destructive' });
      }
      return;
    }

    toast({ title: '🚀 Welcome aboard!', description: "You're now part of the cosmos!" });
    setEmail('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-2 rounded-lg hover:bg-accent/50 transition-colors" aria-label="Subscribe to newsletter">
          <Mail className="text-primary" size={18} />
        </button>
      </DialogTrigger>
      <DialogContent className="glass-card border-border/30 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            Subscribe to the <span className="text-primary">Universe</span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-accent text-sm">
            Get NASA's Astronomy Picture of the Day delivered to your inbox every morning.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubscribe} className="flex gap-3 mt-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 px-4 py-3 rounded-xl glow-input text-foreground font-body placeholder:text-muted-foreground outline-none text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="glow-button px-5 py-3 rounded-xl flex items-center gap-2 text-sm disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            Subscribe
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubscribeModal;
