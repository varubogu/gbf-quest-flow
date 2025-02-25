import * as React from 'react';
import { cn } from '@/utils/cn';
import type { TextVariant } from '@/types/types';


interface TextProps extends React.HTMLAttributes<HTMLPreElement> {
  variant?: TextVariant;
}

export const Text = React.forwardRef<HTMLPreElement, TextProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <pre
        ref={ref}
        className={cn(
          'text-sm',
          'm-0',
          'font-sans',
          'whitespace-pre-line',
          {
            'text-foreground': variant === 'default',
            'text-muted-foreground': variant === 'muted',
            'text-muted-foreground/60': variant === 'dimmed',
          },
          className
        )}
        {...props}
      >
        {children}
      </pre>
    );
  }
);
Text.displayName = 'Text';
