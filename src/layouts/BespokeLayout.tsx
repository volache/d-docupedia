import React from 'react';
import { BespokeHero } from '../components/bespoke/BespokeHero';
import { BespokeScrollytelling } from '../components/bespoke/BespokeScrollytelling';
import { BespokeQuote } from '../components/bespoke/BespokeQuote';
import { BespokeComparison } from '../components/bespoke/BespokeComparison';
import { BespokeStats } from '../components/bespoke/BespokeStats';
import { BespokeTimeline } from '../components/bespoke/BespokeTimeline';
import { BespokeGlitchText } from '../components/bespoke/BespokeGlitchText';
import { BespokeFeatureCard } from '../components/bespoke/BespokeFeatureCard';
import { BespokeMarquee } from '../components/bespoke/BespokeMarquee';

export const BespokeLayout = ({ content }: { content: any }) => {
  // Use sections if available, otherwise fallback to legacy dynamic data (for backward compatibility during migration)
  const sections = content?.sections || [
    { type: 'hero', title: content?.hero_title, subtitle: content?.hero_subtitle, image: content?.hero_image },
    { type: 'scrollytelling', items: content?.scrolly_sections },
    { type: 'quote', text: content?.quote, author: content?.quote_author },
    { 
       type: 'comparison', 
       title: content?.comparison_title, 
       subtitle: content?.comparison_description,
       left: content?.comparison_left,
       right: content?.comparison_right
    }
  ];

  return (
    <div className="relative bg-slate-950 text-white min-h-screen overflow-x-hidden">
      {sections.map((section: any, idx: number) => {
        switch (section.type) {
          case 'hero':
            return <BespokeHero key={idx} data={section} />;
          case 'scrollytelling':
            return <BespokeScrollytelling key={idx} data={section} />;
          case 'quote':
            return <BespokeQuote key={idx} data={section} />;
          case 'comparison':
            return <BespokeComparison key={idx} data={section} />;
          case 'stats':
            return <BespokeStats key={idx} data={section} />;
          case 'timeline':
            return <BespokeTimeline key={idx} data={section} />;
          case 'glitch_text':
            return <BespokeGlitchText key={idx} data={section} />;
          case 'feature_card':
            return <BespokeFeatureCard key={idx} data={section} />;
          case 'marquee':
            return <BespokeMarquee key={idx} data={section} />;
          case 'footer':
            return (
              <footer key={idx} className="py-20 text-center border-t border-white/5">
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">{section.text || "End of Visual Essay"}</p>
              </footer>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};
