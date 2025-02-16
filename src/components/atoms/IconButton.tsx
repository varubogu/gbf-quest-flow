import * as React from 'react';
import { Button } from './Button';
import { cn } from '@/utils/cn';
import type { LucideIcon } from 'lucide-react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string;
  variant?: 'default' | 'ghost';
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon: Icon, label, className, variant = 'default', ...props }, ref) => {
    return (
      <Button
        variant={variant}
        size="icon"
        className={cn('', className)}
        ref={ref}
        aria-label={label}
        {...props}
      >
        <Icon className="h-5 w-5" />
      </Button>
    );
  }
);
IconButton.displayName = 'IconButton';
