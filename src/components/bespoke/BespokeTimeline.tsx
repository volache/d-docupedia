import React from 'react';
import { motion } from 'motion/react';

export const BespokeTimeline = ({ data }: { data: any }) => {
  return (
    <section className="py-32 px-6 overflow-hidden relative">
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-brand-500/30 to-transparent hidden md:block" />
      
      <div className="max-w-5xl mx-auto flex flex-col gap-24 relative z-10">
        {(data?.items || []).map((item: any, i: number) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8 }}
            className={`flex flex-col md:flex-row items-center gap-12 ${i % 2 !== 0 ? 'md:flex-row-reverse text-right' : 'text-left'}`}
          >
            <div className="md:w-1/2 space-y-4">
              <span className="text-sm font-black text-brand-500 uppercase tracking-widest">{item.date}</span>
              <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight">{item.title}</h3>
              <p className="text-slate-400 text-lg leading-relaxed">{item.content}</p>
            </div>
            
            <div className="relative flex justify-center">
               <div className="w-12 h-12 rounded-full border-4 border-slate-900 bg-brand-600 shadow-xl shadow-brand-500/20 z-10" />
            </div>
            
            <div className="md:w-1/2" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};
