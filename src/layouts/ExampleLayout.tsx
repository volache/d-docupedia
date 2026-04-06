import React from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';

export const ExampleLayout = ({ content }: { content: any }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-900">使用說明</h3>
        <p className="text-slate-600 leading-relaxed text-lg">{content.description}</p>
        <div className="p-6 bg-brand-50 rounded-2xl border border-brand-100">
          <h4 className="font-bold text-brand-900 mb-2">適用場景</h4>
          <ul className="list-disc list-inside text-brand-800 space-y-2 opacity-80">
            {content.use_cases?.map((useCase: string, i: number) => (
              <li key={i}>{useCase}</li>
            ))}
          </ul>
        </div>
        <button className="w-full bg-slate-900 text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors">
          <Download size={20} />
          下載標準範本 (.docx)
        </button>
      </div>
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 aspect-[3/4] relative group">
        <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-3xl">
           <button className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
             <ExternalLink size={18} /> 全螢幕預覽
           </button>
        </div>
        <div className="w-full h-full border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 gap-4">
           <FileText size={64} className="opacity-20" />
           <p className="font-medium">文件內容預覽區域</p>
        </div>
      </div>
    </div>
  );
};
