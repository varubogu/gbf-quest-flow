import * as React from 'react';
import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { cn } from '@/lib/utils/cn';

interface TabsProps {
  value: string;
  onValueChange: (_value: string) => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * shadcn 互換のタブ。Base UI Tabs をラップする。
 */
export function Tabs({ value, onValueChange, children, className }: TabsProps): React.ReactElement {
  return (
    <BaseTabs.Root
      value={value}
      onValueChange={(next) => {
        onValueChange(String(next));
      }}
      className={className}
    >
      {children}
    </BaseTabs.Root>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps): React.ReactElement {
  return (
    <BaseTabs.List
      className={cn('flex gap-1 overflow-x-auto overscroll-x-contain pb-px', className)}
      data-testid="tab-list"
    >
      {children}
    </BaseTabs.List>
  );
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps): React.ReactElement {
  return (
    <BaseTabs.Tab
      value={value}
      data-testid="tab"
      className={cn(
        'shrink-0 rounded-t-lg px-3 py-2 text-sm sm:px-4 sm:text-base',
        'text-muted-foreground hover:bg-accent',
        'data-[selected]:bg-primary data-[selected]:text-primary-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
    >
      {children}
    </BaseTabs.Tab>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className }: TabsContentProps): React.ReactElement {
  return (
    <BaseTabs.Panel
      value={value}
      className={cn('h-full overflow-auto', className)}
      data-testid="tab-panel"
    >
      {children}
    </BaseTabs.Panel>
  );
}
