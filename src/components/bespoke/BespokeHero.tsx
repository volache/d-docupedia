import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export const BespokeHero = ({ data }: { data: any }) => {
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const titleScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-brand-600/20 to-slate-950 z-10" />
          <img 
            src={data?.image || "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=2070"} 
            className="w-full h-full object-cover opacity-40"
            alt="Hero"
          />
        </motion.div>

        <motion.div 
          style={{ opacity: titleOpacity, scale: titleScale }}
          className="relative z-20 text-center px-6 max-w-4xl"
        >
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-400 text-xs font-black uppercase tracking-[0.3em] mb-8"
          >
            {data?.tag || "Special Visual Essay"}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tight"
          >
            {data?.title || "公文的靈魂：敘事藝術"}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto mb-12"
          >
            {data?.subtitle || "探索公文背後的邏輯與美學。"}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 2, repeat: Infinity, repeatType: 'reverse' }}
            className="flex flex-col items-center gap-2 text-slate-500"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest">向下捲動探索</span>
            <div className="w-px h-12 bg-gradient-to-b from-brand-500 to-transparent" />
          </motion.div>
        </motion.div>
      </section>
  );
};
