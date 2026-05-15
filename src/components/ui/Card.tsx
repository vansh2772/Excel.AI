import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, padding = 'md', glow = false }) => {
  return (
    <div
      className={clsx(
        'glass rounded-xl shadow-xl transition-all duration-300',
        'hover:shadow-2xl hover:border-indigo-500/40',
        glow && 'shadow-indigo-500/20',
        {
          'p-4': padding === 'sm',
          'p-6': padding === 'md',
          'p-8': padding === 'lg',
          'p-0': padding === 'none',
        },
        className
      )}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps { children: React.ReactNode; className?: string; }
export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => (
  <div className={clsx('mb-4', className)}>{children}</div>
);

interface CardTitleProps { children: React.ReactNode; className?: string; }
export const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => (
  <h3 className={clsx('text-lg font-semibold text-white', className)}>{children}</h3>
);

interface CardContentProps { children: React.ReactNode; className?: string; }
export const CardContent: React.FC<CardContentProps> = ({ children, className }) => (
  <div className={clsx('text-slate-300', className)}>{children}</div>
);