import { test, expect } from '@playwright/test';

test.describe('編成確認画面', () => {
  test.beforeEach(async ({ page }) => {
    // テスト用のフローデータをロード
    await page.goto('/flows/test-flow');
    // 編成確認画面を開く
    await page.click('button[title="編成情報"]');
  });

  test('編成情報が正しく表示される', async ({ page }) => {
    // ジョブ情報の確認
    await expect(page.getByRole('cell', { name: 'テストジョブ' })).toBeVisible();

    // キャラクター情報の確認
    await expect(page.getByRole('cell', { name: 'テストキャラ1' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'テストキャラ2' })).toBeVisible();

    // 武器情報の確認
    await expect(page.getByRole('cell', { name: 'テスト武器' })).toBeVisible();
  });

  test('編集モードで情報を更新できる', async ({ page }) => {
    // 編集モードに切り替え
    await page.click('button:has-text("編集")');

    // ジョブ名を更新
    const jobInput = page.getByRole('textbox').filter({ hasText: 'テストジョブ' });
    await jobInput.fill('新しいジョブ');

    // 保存
    await page.click('button:has-text("保存")');

    // 更新された情報が表示されることを確認
    await expect(page.getByRole('cell', { name: '新しいジョブ' })).toBeVisible();
  });

  test('タブ切り替えが正しく動作する', async ({ page }) => {
    // 武器タブに切り替え
    await page.click('button:has-text("武器")');
    await expect(page.getByText('武器情報')).toBeVisible();

    // 召喚石タブに切り替え
    await page.click('button:has-text("召喚石")');
    await expect(page.getByText('召喚石情報')).toBeVisible();
  });
});