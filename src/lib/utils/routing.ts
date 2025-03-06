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

export interface UserSlugListParameter {
  userId: string;
}

/**
 * ユーザーの記事のパスを生成
 */
export interface UserSlugDirectory {
  slug: string;
  title: string;
}

/**
 * src/pagesのルーティングを行うためのインターフェース
 * src/pages/[articleId].astro と src/pages/[userId]/[articleId].astro 用のインターフェース
 */
export interface FlowStaticPath {
  params: SlugParameters | SlugUsersParameter;
  props: { flowData: Flow };
};

export interface FlowStaticUserOnlyPath {
  params: SlugUsersParameter;
  props: { flowData: Flow };
}

/**
 * ユーザーの記事のパスを生成
 * src/pages/[userId]/index.astro 用のインターフェース
 */
export interface FlowStaticSummary {
  params: UserSlugListParameter;
  props: { flowList: UserSlugDirectory[] };
}


/**
 * ユーザーの記事のパスかどうかを判定
 * @param params パラメータ
 * @returns ユーザーの記事のパスかどうか
 */
export function isUserSlug(params: SlugParameters | SlugUsersParameter): params is SlugUsersParameter {
  return 'userArticleId' in params;
}

/**
 * ユーザーでない記事のパスかどうかを判定
 * @param params パラメータ
 * @returns ユーザーでない記事のパスかどうか
 */
export function isSlug(params: SlugParameters | SlugUsersParameter): params is SlugParameters {
  return 'articleId' in params;
}

/**
 * 有効な記事（共通記事、ユーザー記事）のパスとデータを生成
 * @param {AstroContents[]} flows 記事データ
 * @returns {FlowStaticPath[]} パスと記事データ
 * @example
 *
 * パラメータ:
 *   flows = [
 *     {
 *         id: "article1";
 *         body?: "...";
 *         collection: "flows";
 *         data: {...};
 *         rendered?: "...";
 *         filePath?: "src/content/flows/article1.json";
 *     },
 *     {
 *         id: "article2";
 *         body?: "...";
 *         collection: "flows";
 *         data: {...};
 *         rendered?: "...";
 *         filePath?: "src/content/flows/user1/article2.json";
 *     },
 *     {
 *         id: "article3";
 *         body?: "...";
 *         collection: "flows";
 *         data: {...};
 *         rendered?: "...";
 *         filePath?: "src/content/flows/user1/article3.json";
 *   ]
 * 返却値:
 *   [
 *     {
 *       params: {
 *         articleId: "article1"
 *       },
 *       props: {
 *         flowData: {...} // flows[0].data
 *       }
 *     },
 *     {
 *       params: {
 *         userId: "user1",
 *         userArticleId: "article2"
 *       },
 *       props: {
 *         flowData: {...} // flows[1].data
 *       }
 *     },
 *     {
 *       params: {
 *         userId: "user1",
 *         userArticleId: "article3"
 *       },
 *       props: {
 *         flowData: {...} // flows[2].data
 *       }
 *   ]
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
 * ユーザー毎のまとめページのパスとデータを生成
 * @param flows 記事データ
 * @returns パスと記事データ
 * @example
 *
 * パラメータ:
 *   flows = [
 *     {
 *         id: "article1";
 *         body?: "...";
 *         collection: "flows";
 *         data: {...};
 *         rendered?: "...";
 *         filePath?: "src/content/flows/article1.json";
 *     },
 *     {
 *         id: "article2";
 *         body?: "...";
 *         collection: "flows";
 *         data: {...};
 *         rendered?: "...";
 *         filePath?: "src/content/flows/user1/article2.json";
 *     },
 *     {
 *         id: "article3";
 *         body?: "...";
 *         collection: "flows";
 *         data: {...};
 *         rendered?: "...";
 *         filePath?: "src/content/flows/user1/article3.json";
 *   ]
 * 返却値:
 *   [
 *     {
 *       params: {
 *         userId: "user1"
 *       },
 *       props: {
 *         flowList: [
 *           {
 *             slug: "article2",
 *             title: "..." // flows[1].data.title
 *           },
 *           {
 *             slug: "article3",
 *             title: "..." // flows[2].data.title
 *           },
 *           ...
 *         ]
 *       }
 */
export async function getRoutingPathSummaryList(flows: AstroContents[]): Promise<FlowStaticSummary[]> {

  // ユーザー記事のみを抽出してパスを作成
  const result = flows.map((flow: AstroContents): FlowStaticUserOnlyPath | null => {
    const filePath = getSlugPath(flow.filePath);
    const filePaths = splitSlugPath(filePath ?? '');
    if (filePaths.length == 2) {
      // src/content/flows/user1/article1.json
      return slugUserPath(filePaths, flow.data as Flow) as FlowStaticUserOnlyPath;
    }
    return null;
  }).filter((item) => item !== null);

  // ユーザー毎にGroupByしてパスを作成
  const result2 =  result.reduce((acc: Record<string, FlowStaticSummary>, curr: FlowStaticUserOnlyPath) => {
    // ユーザー毎に最初か判定
    if (!acc[curr.params.userId]) {
      // 最初なら初期データを作成
      acc[curr.params.userId] = {
        params: { userId: curr.params.userId } as UserSlugListParameter,
        props: { flowList: [] },
      };
    }
    // ユーザー毎の記事を追加
    acc[curr.params.userId]?.props.flowList.push({
      slug: [curr.params.userId, curr.params.userArticleId].join('/').replace(/\/\//, '/'),
      title: curr.props.flowData.title,
    });
    return acc;
  }, {} as Record<string, FlowStaticSummary>);

  return Object.values(result2);
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
