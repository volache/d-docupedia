import React from 'react';
import { motion } from 'motion/react';

export const BespokeStats = ({ data }: { data: any }) => {
  return (
    <section className="py-32 px-6 bg-slate-900/30">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-around gap-16 text-center">
        {(data?.items || []).map((stat: any, i: number) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col gap-2"
          >
            <span className="text-sm font-black text-brand-500 uppercase tracking-[0.2em]">{stat.label}</span>
            <span className="text-6xl md:text-8xl font-black text-white tabular-nums tracking-tighter">
              {stat.value}
            </span>
            <p className="text-slate-500 text-sm font-medium max-w-[200px] mx-auto leading-relaxed mt-2">
              {stat.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
