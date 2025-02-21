
const PUBLIC_SITE_URL: string =
  (import.meta.env.PUBLIC_SITE_URL as string) ||
  (process.env.PUBLIC_SITE_URL as string) ||
  '';

export const ENV = {
  PUBLIC_SITE_URL,
} as const;

// 型定義
export type EnvType = typeof ENV;
