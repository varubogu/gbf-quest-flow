import { test, expect } from '@playwright/test';
import { createButtonText } from '../utils/const';

test.describe('新規作成画面', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/'); // 新規作成画面に移動
    await Promise.all([
      page.waitForURL(/\/?mode=new/), // 新しいURLに遷移するのを待機
      page.click(`button:has-text("${createButtonText}")`), // ボタンをクリック
    ]);
  });

  test.describe('初期表示', () => {
    test('タイトルが初期設定で表示される', async ({ page }) => {
      const titleInput = page.locator('#flow-title-input');
      await expect(titleInput).toBeVisible();
      await expect(titleInput).toHaveValue('新しいフロー');
    });

    test('メモが空で表示される', async ({ page }) => {
      const memoInput = page.locator('#flow-memo-input');
      await expect(memoInput).toBeVisible();
      await expect(memoInput).toHaveValue('');
    });

    test('行動表が1行で空', async ({ page }) => {
      const actionTable = page.locator('#flow-action-table');
      await expect(actionTable).toBeVisible();
      await expect(actionTable).toHaveText('');
    });

    test('行動表が1行で空', async ({ page }) => {
      const actionTable = page.locator('#flow-action-table');
      await expect(actionTable).toBeVisible();
      await expect(actionTable).toHaveText('');
    });
  });

  test.describe('入力', () => {
    test('タイトルを入力できる', async ({ page }) => {
        const titleInput = page.locator('#flow-title-input');
        await expect(titleInput).toBeVisible();
        await expect(titleInput).toHaveValue('新しいフロー');
    });

    test('メモを入力できる', async ({ page }) => {
        const memoInput = page.locator('#flow-memo-input');
        await expect(memoInput).toBeVisible();
        await expect(memoInput).toHaveValue('');
    });
  });


});
