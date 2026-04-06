import React from 'react';
import { motion } from 'motion/react';

export const BespokeQuote = ({ data }: { data: any }) => {
  return (
    <section className="py-32 bg-brand-600 text-white overflow-hidden relative">
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] border-[100px] border-white rounded-full"
            />
         </div>
         
         <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <h2 className="text-4xl md:text-6xl font-black mb-12 italic leading-tight" dangerouslySetInnerHTML={{ __html: data?.text || '好的公文是寫給未來的公務員參考的。' }} />
            <div className="w-20 h-1 bg-white mx-auto mb-12" />
            <p className="text-xl font-bold uppercase tracking-widest opacity-80">—— {data?.author || "匿名大師"}</p>
         </div>
      </section>
  );
};
