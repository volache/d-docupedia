import React from 'react';
import { motion } from 'motion/react';

export const BespokeFeatureCard = ({ data }: { data: any }) => {
  const isReversed = data?.variant === 'reverse';
  
  return (
    <section className="py-24 px-6">
      <div className={`max-w-7xl mx-auto flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-stretch gap-12 min-h-[500px]`}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex-1 rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl relative group"
        >
          <img src={data?.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={data?.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex-1 bg-slate-900/40 backdrop-blur-2xl p-12 rounded-[3.5rem] border border-white/5 flex flex-col justify-center gap-6"
        >
          <span className="text-xs font-black text-brand-500 uppercase tracking-widest">{data?.tag || "Spotlight"}</span>
          <h3 className="text-4xl md:text-5xl font-black text-white leading-tight">{data?.title}</h3>
          <p className="text-slate-400 text-lg leading-relaxed">{data?.content}</p>
          <div className="pt-4">
             <button className="px-8 py-3 bg-white text-slate-950 font-black rounded-full hover:bg-brand-500 hover:text-white transition-all transform active:scale-95">
                {data?.button_text || "了解更多"}
             </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
