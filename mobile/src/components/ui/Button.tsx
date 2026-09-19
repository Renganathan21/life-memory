import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, ActivityIndicator, View } from 'react-native';
import { clsx } from 'clsx';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'flex-row items-center justify-center rounded-2xl active:opacity-80';

  const variantClasses = {
    primary: 'bg-indigo-600 shadow-sm shadow-indigo-500/30',
    secondary: 'bg-slate-800 border border-slate-700',
    outline: 'bg-transparent border border-slate-700',
    ghost: 'bg-transparent',
    danger: 'bg-rose-600 shadow-sm shadow-rose-500/30',
  };

  const sizeClasses = {
    sm: 'px-3 py-2',
    md: 'px-5 py-3.5',
    lg: 'px-6 py-4',
  };

  const textVariantClasses = {
    primary: 'text-white font-semibold',
    secondary: 'text-slate-100 font-medium',
    outline: 'text-slate-200 font-medium',
    ghost: 'text-slate-300 font-medium',
    danger: 'text-white font-semibold',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base font-semibold',
  };

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabled && 'opacity-50',
        className
      )}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <>
          {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
          <Text className={clsx(textVariantClasses[variant], textSizeClasses[size])}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
