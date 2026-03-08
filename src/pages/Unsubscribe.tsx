import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import logo from '@/assets/logo.png';

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!email) {
      setStatus('error');
      return;
    }

    supabase
      .from('subscribers')
      .delete()
      .eq('email', email)
      .then(({ error }) => {
        setStatus(error ? 'error' : 'success');
      });
  }, [email]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <img src={logo} alt="Cosmic Nexus" className="mx-auto mb-4 h-10 w-10 rounded-full" />
        {status === 'loading' && (
          <p className="text-muted-foreground font-accent">Unsubscribing...</p>
        )}
        {status === 'success' && (
          <>
            <h1 className="font-heading text-2xl font-bold mb-2">You've been unsubscribed</h1>
            <p className="text-muted-foreground font-accent text-sm">
              You'll no longer receive daily APOD emails from Cosmic Nexus. We'll miss you! 🌌
            </p>
          </>
        )}
        {status === 'error' && (
          <>
            <h1 className="font-heading text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-muted-foreground font-accent text-sm">
              We couldn't process your request. Please try again or contact support.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Unsubscribe;
