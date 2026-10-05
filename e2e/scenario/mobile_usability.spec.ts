import { test, expect } from '@playwright/test';
import { createButtonText, loadButtonText } from '../utils/const';

test.describe('スマホ縦画面', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('空画面から URL / ID で行動表を開ける', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('データが読み込まれていません')).toBeVisible();
    await expect(page.getByRole('button', { name: createButtonText })).toBeVisible();
    await expect(page.getByRole('button', { name: loadButtonText })).toBeVisible();

    const urlInput = page.getByLabel('URLから開く');
    await expect(urlInput).toBeVisible();
    await urlInput.fill('sample');
    await page.getByRole('button', { name: 'URLから開く' }).click();

    await expect(page.getByTestId('flow-title')).toHaveText('ルシゼロ火マナ');
  });

  test('新規作成して編成モーダルを開閉できる', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: createButtonText }).click();
    await expect(page.getByTestId('flow-title-input')).toHaveValue('新しいフロー');
    await expect(page).toHaveURL(/mode=new/);

    await page.getByRole('button', { name: '編成確認' }).click();
    await expect(page.locator('#organization-modal')).toBeVisible();
    await expect(page.getByTestId('tab-list')).toBeVisible();
    await expect(page.getByRole('tab', { name: 'ジョブ、キャラ、アビリティ' })).toBeVisible();

    await page.getByRole('button', { name: '閉じる' }).click();
    await expect(page.locator('#organization-modal')).toBeHidden();
  });

  test('?d=sample で読み込み、編成モーダルを開ける', async ({ page }) => {
    await page.goto('/?d=sample');

    await expect(page.getByTestId('flow-title')).toHaveText('ルシゼロ火マナ');

    const menuButton = page.getByRole('button', { name: 'メニューを開く' });
    await expect(menuButton).toBeVisible();

    await page.getByRole('button', { name: '編成確認' }).click();
    await expect(page.locator('#organization-modal')).toBeVisible();
    await expect(page.getByTestId('tab-list')).toBeVisible();
    await expect(page.getByRole('tab', { name: 'ジョブ、キャラ、アビリティ' })).toBeVisible();

    await page.getByRole('button', { name: '閉じる' }).click();
    await expect(page.locator('#organization-modal')).toBeHidden();
  });
});
