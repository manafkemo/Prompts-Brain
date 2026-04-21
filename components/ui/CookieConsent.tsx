'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';

const CONSENT_KEY = 'zanzora-cookie-consent';
const IS_DEV = process.env.NODE_ENV === 'development';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  // Helper for safe storage access
  const safeGet = () => {
    try {
      const value = localStorage.getItem(CONSENT_KEY);
      if (IS_DEV) console.log(`[CookieAudit] Reading storage:`, value);
      return value;
    } catch (err) {
      console.warn('[CookieAudit] localStorage blocked or unavailable:', err);
      return null;
    }
  };

  const safeSet = (value: string | null) => {
    try {
      if (value === null) {
        localStorage.removeItem(CONSENT_KEY);
        if (IS_DEV) console.log(`[CookieAudit] Storage cleared`);
      } else {
        localStorage.setItem(CONSENT_KEY, value);
        if (IS_DEV) console.log(`[CookieAudit] Storage saved:`, value);
      }
    } catch (err) {
      console.error('[CookieAudit] Failed to save to localStorage:', err);
    }
  };

  useEffect(() => {
    const consent = safeGet();
    if (!consent) {
      if (IS_DEV) console.log('[CookieAudit] No consent found, showing banner');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true);
    }
  }, []);

  const handleChoice = (choice: 'accepted' | 'rejected') => {
    if (IS_DEV) console.log(`[CookieAudit] User choice: ${choice}`);
    safeSet(choice);
    setIsVisible(false);
  };

  const handleReset = () => {
    if (IS_DEV) console.log('[CookieAudit] Manually resetting cookies...');
    safeSet(null);
    setIsVisible(true);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 z-[100] flex justify-center pointer-events-none"
        >
          <div className="glass-panel max-w-2xl w-full p-6 rounded-[2rem] border-violet-500/30 shadow-2xl pointer-events-auto flex flex-col md:flex-row items-center gap-6">
            <div className="h-12 w-12 rounded-2xl bg-violet-500/10 text-violet-400 flex items-center justify-center shrink-0">
              <Cookie className="h-6 w-6" />
            </div>
            
            <div className="flex-grow text-center md:text-left">
              <h4 className="text-white font-bold mb-1">We value your privacy</h4>
              <p className="text-slate-400 text-sm">
                We use cookies to improve your experience and analyze our traffic. By clicking &quot;Accept&quot;, you consent to our use of cookies.
              </p>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => handleChoice('rejected')}
                className="px-6 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                Reject
              </button>
              <button
                onClick={() => handleChoice('accepted')}
                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-violet-600 hover:bg-violet-700 text-white transition-all shadow-lg shadow-violet-500/20"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Dev-only Reset Button */}
      {IS_DEV && !isVisible && (
        <button
          onClick={handleReset}
          className="fixed bottom-4 left-4 z-[101] flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-400 hover:bg-red-500/20 transition-all opacity-50 hover:opacity-100"
        >
          <X size={12} />
          RESET COOKIES (DEV)
        </button>
      )}
    </AnimatePresence>
  );
}
