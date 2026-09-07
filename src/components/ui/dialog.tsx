import * as React from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { cn } from '@/lib/utils/cn';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * shadcn 互換のダイアログ。Base UI Dialog をラップする。
 */
export function Dialog({
  open,
  onClose,
  children,
  className,
}: DialogProps): React.ReactElement | null {
  return (
    <BaseDialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <BaseDialog.Portal>
        <div className={cn('fixed inset-0 z-50', className)} data-testid="dialog">
          {children}
        </div>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

interface DialogBackdropProps {
  className?: string;
  onClick?: () => void;
}

export function DialogBackdrop({ className, onClick }: DialogBackdropProps): React.ReactElement {
  return (
    <BaseDialog.Backdrop
      className={cn('fixed inset-0 bg-black/40', className)}
      onClick={onClick}
      data-testid="dialog-backdrop"
    />
  );
}

interface DialogPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function DialogPanel({
  children,
  className,
  ...props
}: DialogPanelProps): React.ReactElement {
  return (
    <BaseDialog.Viewport className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
      <BaseDialog.Popup
        className={cn(
          'relative bg-card text-card-foreground rounded-lg shadow-xl outline-none',
          className
        )}
        data-testid="dialog-panel"
        {...props}
      >
        {children}
      </BaseDialog.Popup>
    </BaseDialog.Viewport>
  );
}

interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function DialogTitle({
  children,
  className,
  ...props
}: DialogTitleProps): React.ReactElement {
  return (
    <BaseDialog.Title
      className={cn('text-lg font-semibold', className)}
      data-testid="dialog-title"
      {...props}
    >
      {children}
    </BaseDialog.Title>
  );
}

export function DialogClose({
  className,
  label,
}: {
  className?: string;
  label: string;
}): React.ReactElement {
  return (
    <BaseDialog.Close
      className={cn(
        'rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground min-h-11 min-w-11',
        className
      )}
      aria-label={label}
    >
      ✕
    </BaseDialog.Close>
  );
}
