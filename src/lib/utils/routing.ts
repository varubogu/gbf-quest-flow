import type { Flow } from '@/types/models';

export interface AstroContents {
  id: string;
  body?: string;
  collection: "flows";
  data: unknown;
  rendered?: unknown;
  filePath?: string;
}

/**
 * src/pages/[articleId].astro 用のインターフェース
 */
export interface SlugParameters {
  articleId: string;
}

/**
 * src/pages/[userId]/[userArticleId].astro 用のインターフェース
 */
export interface SlugUsersParameter {
  userId: string;
  userArticleId: string;
}

/**
 * src/pagesのルーティングを行うためのインターフェース
 */
export interface FlowStaticPath {
  params: SlugParameters | SlugUsersParameter;
  props: { flowData: Flow };
};

export function isUserSlug(params: SlugParameters | SlugUsersParameter): params is SlugUsersParameter {
  return 'userArticleId' in params;
}

export function isSlug(params: SlugParameters | SlugUsersParameter): params is SlugParameters {
  return 'articleId' in params;
}

/**
 * 有効なパスを生成
 * @param flows 記事データ
 * @returns パスと記事データ
 */
export async function getRoutingPaths(flows: AstroContents[]): Promise<FlowStaticPath[]> {
  return flows.map((flow: AstroContents): FlowStaticPath | null => {
    const filePath = getSlugPath(flow.filePath);
    const filePaths = splitSlugPath(filePath ?? '');
    if (filePaths.length == 2) {
      // src/content/flows/user1/article1.json
      return slugUserPath(filePaths, flow.data as Flow);
    }
    if (filePaths.length == 1) {
      // src/content/flows/article1.json
      return slugPath(filePaths, flow.data as Flow);
    }
    return null;
  }).filter((item) => item !== null);
}

/**
 * ユーザーの記事のパスを生成
 * @param filePaths パスを分割した配列
 * @param flow 記事データ
 * @returns パスと記事データ
 * @example
 *
 * パラメータ:
 *   filePaths[0] = 'user1',
 *   filePaths[1] = 'article1'
 * 返却値:
 *  {
 *    params: {
 *      userId: 'user1',
 *      userArticleId: 'article1'
 *    },
 *    props: {
 *      flowData: {
 *        ...
 *      }
 *    }
 *  }
 */
export function slugUserPath(filePaths: string[], data: Flow): FlowStaticPath | null {
  return {
    params: { userId: filePaths[0] || '', userArticleId: filePaths[1] || '' } as SlugUsersParameter,
    props: { flowData: data },
  };
}

/**
 * 記事のパスを生成
 * @param filePaths パスを分割した配列
 * @param flow 記事データ
 * @returns パスと記事データ
 * @example
 *
 * パラメータ:
 *   filePaths[0] = 'article1'
 * 返却値:
 *  {
 *    params: {
 *      articleId: 'article1'
 *    },
 *    props: {
 *      flowData: {
 *        ...
 *      }
 *    }
 *  }
 */
export function slugPath(filePaths: string[], data: Flow): FlowStaticPath | null {
  return {
    params: { articleId: filePaths[0] || '' } as SlugParameters,
    props: { flowData: data },
  };
}

/**
 * パスからユーザーの記事のパスを生成
 * @param filePath パス
 * @returns パス
 * @example
 *
 * パラメータ:
 *   filePath = 'src/content/flows/user1/article1.json'
 * 返却値:
 *   'user1/article1'
 *
 * パラメータ:
 *   filePath = 'src/content/flows/article1.json'
 * 返却値:
 *   'article1'
 */
export function getSlugPath(filePath: string | undefined): string | undefined {
  return filePath?.replace('src/content/flows/', '').replace('.json', '');
}

/**
 * パスを分割した配列を返す
 * @param slugPath パス
 * @returns パスを分割した配列
 * @example
 *
 * パラメータ:
 *   slugPath = 'user1/article1'
 * 返却値:
 *   ['user1', 'article1']
 *
 * パラメータ:
 *   slugPath = 'article1'
 * 返却値:
 *   ['article1']
 *
 * パラメータ:
 *   slugPath = ''
 * 返却値:
 *   []
 */
export function splitSlugPath(slugPath: string): string[] {
  return slugPath?.split('/') ?? [];
}
