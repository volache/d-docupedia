import React from 'react';
import { StepItem } from '../components/article/ArticleBlocks';

export const WorkflowLayout = ({ content }: { content: any }) => {
  return (
    <div className="max-w-5xl mx-auto divide-y divide-slate-100">
      {content?.steps?.map((step: any, i: number) => (
        <StepItem 
          key={i} 
          index={i} 
          title={step.title} 
          description={step.description} 
          pro_tip={step.pro_tip} 
          icon={step.icon} 
        />
      ))}
      {!content?.steps?.length && (
        <div className="py-20 text-center text-slate-400">目前尚無步驟內容</div>
      )}
    </div>
  );
};
