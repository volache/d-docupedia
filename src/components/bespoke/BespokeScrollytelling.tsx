import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export const BespokeScrollytelling = ({ data }: { data: any }) => {
  return (
    <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">
          <div className="lg:w-1/2 space-y-[50vh] pb-[50vh]">
            {(data?.items || []).map((sec: any, i: number) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ margin: "-20%" }}
                className="bg-slate-900/50 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl relative group hover:border-brand-500/30 transition-all"
              >
                <span className="absolute -top-6 -left-6 w-16 h-16 rounded-full bg-brand-600 flex items-center justify-center text-2xl font-black shadow-xl shadow-brand-600/40">
                  {i + 1}
                </span>
                <h3 className="text-3xl font-bold mb-6 text-white group-hover:text-brand-400 transition-colors uppercase tracking-tight">
                  {sec.title}
                </h3>
                <div className="text-slate-400 text-lg leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: sec.content }} />
                {sec.link && (
                  <div className="flex items-center gap-3 text-brand-400 font-bold text-sm uppercase tracking-widest cursor-pointer">
                    {sec.link_text || "查看詳情"} <ArrowRight size={18} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="lg:w-1/2 sticky top-[20vh] h-[60vh] hidden lg:block">
            <div className="relative w-full h-full rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl">
              {(data?.items || []).map((sec: any, i: number) => {
                return (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 1.1 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ margin: "-45% 0px -45% 0px" }}
                    className="absolute inset-0"
                  >
                    <img src={sec.image} className="w-full h-full object-cover" alt={sec.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
  );
};
