import React from 'react';
import { MousePointer, Keyboard, Monitor } from 'lucide-react';

export const SystemTutorialLayout = ({ content }: { content: any }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {content.steps?.map((step: any, i: number) => (
        <div key={i} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="text-xs text-slate-400 font-mono tracking-wider uppercase">Operation Step 0{i + 1}</div>
          </div>
          <div className="p-8 space-y-6">
            <h4 className="text-2xl font-bold text-slate-900">{step.title}</h4>
            <p className="text-slate-600 leading-relaxed text-lg">{step.description}</p>
            <div className="relative aspect-video bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 group">
               <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                  <Monitor size={80} strokeWidth={1} />
               </div>
               <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-xl border border-white shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-600 text-white rounded-lg flex items-center justify-center shrink-0">
                      <MousePointer size={20} />
                    </div>
                    <p className="text-brand-900 font-medium">{step.action}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
