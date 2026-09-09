import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';

describe('Tabs', () => {
  it('選択中のパネルを表示する', () => {
    const onValueChange = vi.fn();
    render(
      <Tabs value="job" onValueChange={onValueChange}>
        <TabsList>
          <TabsTrigger value="job">ジョブ</TabsTrigger>
          <TabsTrigger value="weapons">武器</TabsTrigger>
        </TabsList>
        <TabsContent value="job">ジョブ内容</TabsContent>
        <TabsContent value="weapons">武器内容</TabsContent>
      </Tabs>
    );

    expect(screen.getByTestId('tab-list')).toBeInTheDocument();
    expect(screen.getByText('ジョブ内容')).toBeInTheDocument();
  });

  it('タブをクリックすると onValueChange が呼ばれる', () => {
    const onValueChange = vi.fn();
    render(
      <Tabs value="job" onValueChange={onValueChange}>
        <TabsList>
          <TabsTrigger value="job">ジョブ</TabsTrigger>
          <TabsTrigger value="weapons">武器</TabsTrigger>
        </TabsList>
        <TabsContent value="job">ジョブ内容</TabsContent>
        <TabsContent value="weapons">武器内容</TabsContent>
      </Tabs>
    );

    fireEvent.click(screen.getByText('武器'));
    expect(onValueChange).toHaveBeenCalledWith('weapons');
  });
});
