import React from 'react';
import { motion } from 'motion/react';

export const BespokeMarquee = ({ data }: { data: any }) => {
  const words = data?.words || ["DATA", "ADMIN", "EFFICIENCY", "FUTURE", "CLARITY"];
  
  return (
    <div className="relative py-12 overflow-hidden">
        <section className="py-12 md:py-20 bg-brand-600 relative shadow-2xl rotate-1 scale-110">
          <div className="flex whitespace-nowrap">
            <motion.div 
              animate={{ x: [0, -1035] }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="flex items-center gap-16 px-8"
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <React.Fragment key={i}>
                  {words.map((word: string, j: number) => (
                    <span key={j} className="text-6xl md:text-9xl font-black text-white/20 italic tracking-tighter uppercase">
                      {word}
                    </span>
                  ))}
                </React.Fragment>
              ))}
            </motion.div>
          </div>
        </section>
    </div>
  );
};
