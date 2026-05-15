import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        'hover:scale-105 active:scale-95 hover:shadow-xl focus:shadow-xl',
        {
          'bg-theme-primary text-theme-dark hover:bg-theme-primary/90 focus:ring-theme-primary shadow-lg hover:shadow-xl': variant === 'primary',
          'bg-theme-accent1 text-theme-light hover:bg-theme-accent1/90 focus:ring-theme-accent1 shadow-lg': variant === 'secondary',
          'border border-theme-accent1 bg-theme-accent2 text-theme-light hover:bg-theme-accent2/80 focus:ring-theme-primary backdrop-blur-sm': variant === 'outline',
          'text-theme-light hover:bg-theme-accent1/50 focus:ring-theme-accent1': variant === 'ghost',
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-sm': size === 'md',
          'px-6 py-3 text-base': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};