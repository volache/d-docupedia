import React from 'react';
import { SummaryBox, Callout, ExampleBlock } from '../components/article/ArticleBlocks';

export const GuideLayout = ({ content }: { content: any }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
      {/* Support for legacy block-based content */}
      {content?.blocks?.map((block: any, i: number) => {
        switch (block.type) {
          case 'summary':
            return <SummaryBox key={i} content={block.content} />;
          case 'text':
            return <p key={i} className="text-slate-700 text-lg leading-relaxed">{block.content}</p>;
          case 'callout':
            return <Callout key={i} type={block.style} title={block.title} content={block.content} />;
          case 'example':
            return <ExampleBlock key={i} title={block.title} items={block.items} />;
          default:
            return null;
        }
      })}

      {/* Support for new section-based content from Admin Editor */}
      {content?.sections?.map((section: any, i: number) => (
        <section key={i} className="space-y-4">
           <h3 className="text-2xl font-bold text-slate-800 border-l-4 border-brand-500 pl-4">{section.title}</h3>
           <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">{section.content}</div>
        </section>
      ))}
    </div>
  );
};
