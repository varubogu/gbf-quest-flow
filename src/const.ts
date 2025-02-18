// @ts-ignore - 環境変数へのアクセスエラーを無視
const PUBLIC_SITE_URL = import.meta.env.PUBLIC_SITE_URL || process.env.PUBLIC_SITE_URL;

export const ENV = {
  PUBLIC_SITE_URL,
} as const;

// 型定義
export type ENV = typeof ENV;
