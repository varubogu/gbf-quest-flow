import { describe, it, expect } from 'vitest';
import {
  isUserSlug,
  isSlug,
  getSlugPath,
  splitSlugPath,
  slugUserPath,
  slugPath,
  getRoutingPaths,
  getRoutingPathSummaryList,
  type AstroContents,
  type SlugParameters,
  type SlugUsersParameter,
  type UserSlugDirectory
} from './routing';
import type { Flow } from '@/types/models';

describe('ルーティングに関するテスト', () => {
  describe('isUserSlug', () => {
    it('ユーザーの記事のパスが指定された場合はtrue', () => {
      const params: SlugUsersParameter = {
        userId: 'user1',
        userArticleId: 'article1'
      };
      expect(isUserSlug(params)).toBe(true);
    });

    it('ユーザーの記事のパスが指定されていない場合はfalse', () => {
      const params: SlugParameters = {
        articleId: 'article1'
      };
      expect(isUserSlug(params)).toBe(false);
    });
  });

  describe('isSlug', () => {
    it('記事のパスが指定された場合はtrue', () => {
      const params: SlugParameters = {
        articleId: 'article1'
      };
      expect(isSlug(params)).toBe(true);
    });

    it('記事のパスが指定されていない場合はfalse', () => {
      const params: SlugUsersParameter = {
        userId: 'user1',
        userArticleId: 'article1'
      };
      expect(isSlug(params)).toBe(false);
    });
  });

  describe('splitSlugPath', () => {
    it('パスが複数のセグメントで分割される', () => {
      const result = splitSlugPath('user1/article1');
      expect(result).toEqual(['user1', 'article1']);
    });

    it('単一のセグメントのパスが分割される', () => {
      const result = splitSlugPath('article1');
      expect(result).toEqual(['article1']);
    });

    it('空のパスが分割される', () => {
      const result = splitSlugPath('');
      expect(result).toEqual(['']);
    });

    it('未定義のパスが分割される', () => {
      const result = splitSlugPath(undefined as unknown as string);
      expect(result).toEqual([]);
    });
  });

  describe('getSlugPath', () => {
    it('ユーザーの記事のパスからslugパスが抽出される', () => {
      const result = getSlugPath('src/content/flows/user1/article1.json');
      expect(result).toBe('user1/article1');
    });

    it('記事のパスからslugパスが抽出される', () => {
      const result = getSlugPath('src/content/flows/article1.json');
      expect(result).toBe('article1');
    });

    it('未定義のパスが抽出される', () => {
      const result = getSlugPath(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('slugUserPath', () => {
    it('ユーザーの記事のパスとデータからFlowStaticPathが生成される', () => {
      const filePaths = ['user1', 'article1'];
      const flowData = { title: 'テスト記事' } as Flow;

      const result = slugUserPath(filePaths, flowData);

      expect(result).toEqual({
        params: { userId: 'user1', userArticleId: 'article1' },
        props: { flowData: { title: 'テスト記事' } }
      });
    });

    it('空のパスでも正しく処理される', () => {
      const filePaths: string[] = [];
      const flowData = { title: 'テスト記事' } as Flow;

      const result = slugUserPath(filePaths, flowData);

      expect(result).toEqual({
        params: { userId: '', userArticleId: '' },
        props: { flowData: { title: 'テスト記事' } }
      });
    });
  });

  describe('slugPath', () => {
    it('記事のパスとデータからFlowStaticPathが生成される', () => {
      const filePaths = ['article1'];
      const flowData = { title: 'テスト記事' } as Flow;

      const result = slugPath(filePaths, flowData);

      expect(result).toEqual({
        params: { articleId: 'article1' },
        props: { flowData: { title: 'テスト記事' } }
      });
    });

    it('空のパスでも正しく処理される', () => {
      const filePaths: string[] = [];
      const flowData = { title: 'テスト記事' } as Flow;

      const result = slugPath(filePaths, flowData);

      expect(result).toEqual({
        params: { articleId: '' },
        props: { flowData: { title: 'テスト記事' } }
      });
    });
  });

  describe('getRoutingPaths', () => {
    it('記事データからルーティングパスが生成される', async () => {
      const flows: AstroContents[] = [
        {
          id: 'article1',
          collection: 'flows',
          data: { title: '共通記事' } as Flow,
          filePath: 'src/content/flows/article1.json'
        },
        {
          id: 'article2',
          collection: 'flows',
          data: { title: 'ユーザー記事' } as Flow,
          filePath: 'src/content/flows/user1/article2.json'
        }
      ];

      const result = await getRoutingPaths(flows);

      expect(result).toEqual([
        {
          params: { articleId: 'article1' },
          props: { flowData: { title: '共通記事' } }
        },
        {
          params: { userId: 'user1', userArticleId: 'article2' },
          props: { flowData: { title: 'ユーザー記事' } }
        }
      ]);
    });

    it('無効なパスは除外される', async () => {
      const flows: AstroContents[] = [
        {
          id: 'invalid',
          collection: 'flows',
          data: { title: '無効な記事' } as Flow,
          filePath: 'src/content/flows/invalid/path/article.json'
        }
      ];

      const result = await getRoutingPaths(flows);

      expect(result).toEqual([]);
    });

    it('未定義のパスは空のarticleIdとして処理される', async () => {
      // AstroContentsのfilePathはオプショナルなので、未定義の場合
      const flows: AstroContents[] = [
        {
          id: 'undefined',
          collection: 'flows',
          data: { title: '未定義パス' } as Flow
        }
      ];

      const result = await getRoutingPaths(flows);

      expect(result).toEqual([
        {
          params: { articleId: '' },
          props: { flowData: { title: '未定義パス' } }
        }
      ]);
    });
  });

  describe('getRoutingPathSummaryList', () => {
    it('ユーザー毎の記事リストが生成される', async () => {
      const flows: AstroContents[] = [
        {
          id: 'article1',
          collection: 'flows',
          data: { title: '共通記事' } as Flow,
          filePath: 'src/content/flows/article1.json'
        },
        {
          id: 'article2',
          collection: 'flows',
          data: { title: 'ユーザー記事1' } as Flow,
          filePath: 'src/content/flows/user1/article2.json'
        },
        {
          id: 'article3',
          collection: 'flows',
          data: { title: 'ユーザー記事2' } as Flow,
          filePath: 'src/content/flows/user1/article3.json'
        },
        {
          id: 'article4',
          collection: 'flows',
          data: { title: '別ユーザー記事' } as Flow,
          filePath: 'src/content/flows/user2/article4.json'
        }
      ];

      const result = await getRoutingPathSummaryList(flows);

      expect(result).toHaveLength(2);
      expect(result).toEqual(expect.arrayContaining([
        {
          params: { userId: 'user1' },
          props: {
            flowList: expect.arrayContaining([
              { slug: 'user1/article2', title: 'ユーザー記事1' },
              { slug: 'user1/article3', title: 'ユーザー記事2' }
            ]) as UserSlugDirectory[]
          }
        },
        {
          params: { userId: 'user2' },
          props: {
            flowList: [
              { slug: 'user2/article4', title: '別ユーザー記事' }
            ]
          }
        }
      ]));

      // user1のflowListが2つの要素を持つことを確認
      const user1Result = result.find(item => item.params.userId === 'user1');
      expect(user1Result?.props.flowList).toHaveLength(2);
    });

    it('共通記事は除外される', async () => {
      const flows: AstroContents[] = [
        {
          id: 'article1',
          collection: 'flows',
          data: { title: '共通記事' } as Flow,
          filePath: 'src/content/flows/article1.json'
        }
      ];

      const result = await getRoutingPathSummaryList(flows);

      expect(result).toEqual([]);
    });

    it('無効なパスは除外される', async () => {
      const flows: AstroContents[] = [
        {
          id: 'invalid',
          collection: 'flows',
          data: { title: '無効な記事' } as Flow,
          filePath: 'src/content/flows/invalid/path/article.json'
        }
      ];

      const result = await getRoutingPathSummaryList(flows);

      expect(result).toEqual([]);
    });
  });
});
