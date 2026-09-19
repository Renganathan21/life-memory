import React from 'react';
import { View, ViewProps } from 'react-native';
import { clsx } from 'clsx';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'glass';
  className?: string;
  children: React.ReactNode;
}

export function Card({
  variant = 'default',
  className,
  children,
  ...props
}: CardProps) {
  const baseClasses = 'rounded-2xl p-4.5 border';

  const variantClasses = {
    default: 'bg-slate-900/90 border-slate-800/80',
    elevated: 'bg-slate-900 border-slate-800 shadow-lg shadow-black/40',
    glass: 'bg-slate-900/60 border-slate-800/50 backdrop-blur-md',
  };

  return (
    <View
      className={clsx(baseClasses, variantClasses[variant], className)}
      {...props}
    >
      {children}
    </View>
  );
}
