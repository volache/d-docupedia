import React from 'react';
import { cn } from '../../lib/utils';

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 overflow-hidden",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export const Callout = ({ 
  title, 
  children, 
  icon, 
  variant = 'default' 
}: { 
  title?: string; 
  children: React.ReactNode; 
  icon?: React.ReactNode;
  variant?: 'default' | 'warning' | 'tip' | 'info'
}) => {
  const variants = {
    default: 'bg-slate-50 text-slate-800 border-slate-200',
    warning: 'bg-orange-50 text-orange-900 border-orange-200',
    tip: 'bg-blue-50 text-blue-900 border-blue-200',
    info: 'bg-brand-50 text-brand-900 border-brand-200',
  };

  return (
    <div className={cn("p-6 rounded-2xl border", variants[variant])}>
      <div className="flex gap-4">
        {icon && <div className="shrink-0 mt-1">{icon}</div>}
        <div>
          {title && <h4 className="font-bold mb-2">{title}</h4>}
          <div className="text-sm leading-relaxed opacity-90">{children}</div>
        </div>
      </div>
    </div>
  );
};

export const Badge = ({ children, className, variant = 'default' }: { children: React.ReactNode, className?: string, variant?: 'default' | 'brand' | 'success' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    brand: 'bg-brand-100 text-brand-800',
    success: 'bg-green-100 text-green-800',
  };
  return (
    <span className={cn("px-3 py-1 rounded-full text-xs font-medium", variants[variant], className)}>
      {children}
    </span>
  );
};
