import React from 'react';
import { clsx } from 'clsx';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Badge Component
 * 
 * A small status indicator or label for displaying categories, statuses, or counts.
 * Supports multiple variants and sizes with optional icons.
 * 
 * @example
 * ```tsx
 * <Badge variant="success">In Stock</Badge>
 * <Badge variant="warning" icon={<AlertIcon />}>Low Stock</Badge>
 * ```
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      size = 'md',
      rounded = true,
      icon,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors';

    const variantStyles = {
      success: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
      warning: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      info: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
      default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    };

    const sizeStyles = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-1.5 text-base',
    };

    const roundedStyles = rounded ? 'rounded-full' : 'rounded-md';

    const iconSizeStyles = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    };

    return (
      <span
        ref={ref}
        className={clsx(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          roundedStyles,
          className
        )}
        {...props}
      >
        {icon && (
          <span className={clsx(iconSizeStyles[size], 'mr-1')}>
            {icon}
          </span>
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;

