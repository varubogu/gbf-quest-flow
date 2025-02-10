import React, { useState } from 'react';
import { HamburgerMenuItems } from '@/components/molecules/HamburgerMenuItems';
import { ActionTableContainer } from '@/components/organisms/ActionTableContainer';
import { ResizablePanel } from '@/components/organisms/ResizablePanel';
import type { Flow } from '@/types/models';

interface FlowBodyLayoutReactProps {
  data: Flow;
}

function FlowBodyLayoutReact({ data }: FlowBodyLayoutReactProps) {
  const [isLoading, setIsLoading] = useState(true);

  // 初期ロード完了時にローディングを解除
  React.useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="h-14 border-b flex items-center px-4 fixed w-full bg-background z-50">
        <HamburgerMenuItems data={data} />
        <h1 className="ml-4 text-lg font-medium">{data.title}</h1>
      </header>
      <main className="flex-1 pt-14">
        <div className="h-[calc(100vh-3.5rem)] grid" style={{ gridTemplateRows: "1fr 8px 1fr" }}>
          <div className="overflow-auto">
            <div className="p-4">
              <pre className="whitespace-pre-wrap">{data.always}</pre>
            </div>
          </div>
          <div className="bg-gray-300 cursor-row-resize"></div>
          <div className="overflow-hidden">
            <ActionTableContainer data={data.flow} buttonPosition="right" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default FlowBodyLayoutReact;