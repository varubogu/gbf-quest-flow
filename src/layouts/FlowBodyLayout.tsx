import React, { useState } from 'react';
import { HamburgerMenuItems } from '@/components/molecules/HamburgerMenuItems';
import { ActionTableContainer } from '@/components/organisms/ActionTableContainer';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import type { Flow } from '@/types/models';

interface FlowBodyLayoutReactProps {
  data: Flow | null;
}

function FlowBodyLayoutReact({ data }: FlowBodyLayoutReactProps) {
  const [_data, _setData] = useState<Flow | null>(data);
  const [isLoading, setIsLoading] = useState(true);

  if (_data === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
      <button
        onClick={() => {
          
          _setData(data);
        }}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        データを読み込み
      </button>
      </div>
    );
  }

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
        <HamburgerMenuItems data={_data} />
        <h1 className="ml-4 text-lg font-medium">{_data.title}</h1>
      </header>
      <main className="flex-1 pt-14">
        <div className="h-[calc(100vh-3.5rem)]">
          <PanelGroup direction="vertical">
            <Panel defaultSize={50} minSize={10}>
              <div className="h-full overflow-auto">
                <div className="p-4">
                  <pre className="whitespace-pre-wrap">{_data.always}</pre>
                </div>
              </div>
            </Panel>
            <PanelResizeHandle className="h-2 bg-gray-300 hover:bg-gray-400 transition-colors cursor-row-resize" />
            <Panel defaultSize={50} minSize={10}>
              <div className="h-full overflow-auto">
                <ActionTableContainer data={_data.flow} buttonPosition="right" />
              </div>
            </Panel>
          </PanelGroup>
        </div>
      </main>
    </div>
  );
}

export default FlowBodyLayoutReact;