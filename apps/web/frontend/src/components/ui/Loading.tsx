import React from 'react';
import { clsx } from 'clsx';

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'gray';
  fullScreen?: boolean;
  text?: string;
}

/**
 * Loading Component
 * 
 * A versatile loading spinner with multiple sizes and colors.
 * Can be used inline or as a full-screen overlay.
 * 
 * @example
 * ```tsx
 * <Loading size="md" text="Loading..." />
 * <Loading fullScreen text="Please wait..." />
 * ```
 */
export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  color = 'primary',
  fullScreen = false,
  text,
}) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const colorStyles = {
    primary: 'text-blue',
    white: 'text-white',
    gray: 'text-gray-500',
  };

  const textSizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <svg
        className={clsx(
          'animate-spin',
          sizeStyles[size],
          colorStyles[color]
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        role="status"
        aria-label="Loading"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && (
        <p
          className={clsx(
            'font-medium',
            textSizeStyles[size],
            colorStyles[color]
          )}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
};

/**
 * Skeleton Component
 * 
 * A placeholder component for loading states that mimics the shape of content.
 * 
 * @example
 * ```tsx
 * <Skeleton className="h-4 w-full" />
 * <Skeleton className="h-10 w-10 rounded-full" />
 * ```
 */
export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'text',
}) => {
  const variantStyles = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={clsx(
        'animate-pulse bg-gray-200 dark:bg-gray-700',
        variantStyles[variant],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Loading;

