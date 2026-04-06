import React from 'react';
import { motion } from 'motion/react';

export const BespokeGlitchText = ({ data }: { data: any }) => {
  return (
    <section className="py-40 bg-slate-900 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 bottom-0 left-0 right-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-600/10 via-slate-900 to-slate-900 opacity-60 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 text-center z-10 relative">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
          viewport={{ once: true }}
          className="text-5xl md:text-8xl font-black text-white italic tracking-tighter leading-none mb-12 uppercase drop-shadow-2xl"
        >
          {data?.text || "The Future is Now"}
        </motion.h2>
        <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto italic opacity-80 underline underline-offset-8 decoration-brand-600 decoration-2">
           {data?.subtitle || "這是一個不可逆轉的行政改革趨勢。"}
        </p>
      </div>
    </section>
  );
};
