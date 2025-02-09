import React, { type ReactNode } from 'react';
import "@/styles/globals.css";
import type { Flow } from '@/types/models';

interface FlowBaseLayoutReactProps {
  data: Flow;
  children: ReactNode;
}

function FlowBaseLayoutReact({ data, children }: FlowBaseLayoutReactProps) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <title>{data.title}</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

export default FlowBaseLayoutReact;