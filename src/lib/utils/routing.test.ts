import { describe, it, expect } from 'vitest';
import {
  isUserSlug,
  isSlug,
  getSlugPath,
  splitSlugPath,
} from './routing';
import type { SlugParameters, SlugUsersParameter } from './routing';

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
});
