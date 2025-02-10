import React, { useState } from 'react';
import { HamburgerMenuItems } from '@/components/molecules/HamburgerMenuItems';
import { ActionTableContainer } from '@/components/organisms/ActionTableContainer';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
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
        <div className="h-[calc(100vh-3.5rem)]">
          <PanelGroup direction="vertical">
            <Panel defaultSize={50} minSize={10}>
              <div className="h-full overflow-auto">
                <div className="p-4">
                  <pre className="whitespace-pre-wrap">{data.always}</pre>
                </div>
              </div>
            </Panel>
            <PanelResizeHandle className="h-2 bg-gray-300 hover:bg-gray-400 transition-colors cursor-row-resize" />
            <Panel defaultSize={50} minSize={10}>
              <div className="h-full overflow-auto">
                <ActionTableContainer data={data.flow} buttonPosition="right" />
              </div>
            </Panel>
          </PanelGroup>
        </div>
      </main>
    </div>
  );
}

export default FlowBodyLayoutReact;