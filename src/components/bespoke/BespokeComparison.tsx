import React from 'react';

export const BespokeComparison = ({ data }: { data: any }) => {
  return (
    <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black mb-6">{data?.title || "視覺化對照"}</h2>
            <p className="text-slate-500">{data?.subtitle || "左側為傳統公文，右側為現代化行政溝通。"}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-red-500/30 transition-all">
                <div className="text-red-500 font-black text-[10px] uppercase tracking-widest mb-4">{data?.left?.title || "Old Paradigm"}</div>
                <div className="text-slate-500 font-mono text-sm space-y-2">
                   {(data?.left?.items || []).map((item: string, i: number) => (
                     <p key={i} className="line-through opacity-50">{item}</p>
                   ))}
                </div>
             </div>
             <div className="p-8 rounded-3xl bg-brand-950 border border-brand-800 hover:border-brand-400 transition-all">
                <div className="text-brand-400 font-black text-[10px] uppercase tracking-widest mb-4">{data?.right?.title || "Modern Approach"}</div>
                <div className="text-white font-bold text-lg space-y-4">
                   {(data?.right?.items || []).map((item: string, i: number) => (
                     <p key={i}>{item}</p>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>
  );
};
