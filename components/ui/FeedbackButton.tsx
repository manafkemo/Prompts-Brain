'use client';

import { useState } from 'react';
import { MessageSquareReply } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FeedbackModal } from './FeedbackModal';

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <div className="relative group">
          {/* Label tooltip */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute right-full mr-4 top-1/2 -translate-y-1/2 whitespace-nowrap hidden md:block"
              >
                <div className="bg-slate-900 border border-violet-500/20 px-4 py-2 rounded-xl text-sm font-medium text-white shadow-xl backdrop-blur-md">
                  Have a suggestion?
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Button */}
          <motion.button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-xl shadow-violet-900/30 ring-1 ring-white/20 transition-all hover:shadow-violet-900/50"
            aria-label="Open feedback modal"
          >
            <MessageSquareReply size={24} />
          </motion.button>

          {/* Status Indicator */}
          <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full border-2 border-slate-950 bg-green-500 shadow-sm animate-pulse" />
        </div>
      </div>

      <FeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
