import { test } from '@playwright/test';

test.describe('データを読み込んでいろんな操作をする', () => {
  test('データを読み込み、編集して保存', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("読み込み")');
  });

  test('データを読み込み、編集してキャンセル（元のデータに戻る）', async ({ page }) => {
    await page.goto('/');

  });

});


