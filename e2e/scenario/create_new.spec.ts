import { test, expect } from '@playwright/test';

test.describe('データを新規作成', () => {
  test('初期ページから新規作成～保存', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("新規作成")');
    expect(page.locator('#flow-title-input')).toBeVisible();
  });

  test('初期ページから新規作成～キャンセル', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("新規作成")');
    expect(page.locator('#flow-title-input')).toBeVisible();
  });

  test('データを読込済で新規作成～保存', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("新規作成")');
    expect(page.locator('#flow-title-input')).toBeVisible();
  });

  test('データを読込済で新規作成～キャンセル（直前のデータに戻る）', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("新規作成")');
    expect(page.locator('#flow-title-input')).toBeVisible();
  });

  test('新規作成中に新規作成するとキャンセル扱いになる', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("新規作成")');
    expect(page.locator('#flow-title-input')).toBeVisible();
  });
});

