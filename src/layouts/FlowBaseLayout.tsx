import React, { type ReactNode } from 'react';
import "@/styles/globals.css";
import useFlowStore from '@/stores/flowStore';

interface FlowBaseLayoutReactProps {
  children: ReactNode;
}

function FlowBaseLayoutReact({ children }: FlowBaseLayoutReactProps) {
  const flowData = useFlowStore((state) => state.flowData);
  const title = 'グラブル行動表' + (flowData ? ` - ${flowData.title}` : '');

  return (
    <html lang="ja">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <title>{title}</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

export default FlowBaseLayoutReact;