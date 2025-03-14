import { test, expect } from '@playwright/test';
import { createButtonText, loadButtonText } from '../utils/const';

test.describe('初期ページ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/'); // インデックスページに移動
  });

  test.describe('初期表示', () => {

    test('ボタンが２つ表示される', async ({ page }) => {
      const createButton = page.getByRole('button', { name: createButtonText });
      const loadButton = page.getByRole('button', { name: loadButtonText });

      await expect(createButton).toBeVisible();
      await expect(loadButton).toBeVisible();
    });
  });

  test.describe('イベント', () => {

    test('新規作成を押すと新しいデータの編集画面が開く', async ({ page }) => {
      await Promise.all([
        page.waitForURL(/\/?mode=new/), // 新しいURLに遷移するのを待機
        page.click(`button:has-text("${createButtonText}")`), // ボタンをクリック
      ]);

      // 編集画面のタイトル入力フィールドを確認
      const titleInput = page.locator('#flow-title-input');
      await expect(titleInput).toBeVisible();
      await expect(titleInput).toHaveValue('新しいフロー');
    });

    test('データ読み込みを押すとファイルを選択できる', async ({ page }) => {
      const filePath = 'e2e/test-data/sample.json';

      // input[type="file"]要素が作成されるのを待つ
      const fileChooserPromise = page.waitForEvent('filechooser');
      await page.click(`button:has-text("${loadButtonText}")`);
      const fileChooser = await fileChooserPromise;

      // ファイルを選択
      await fileChooser.setFiles(filePath);

      // データが反映されるのを待つ（タイトルが表示されたら反映されたとみなす）
      await expect(page.getByText('ルシゼロ火マナ')).toBeVisible();
    });
  });
});
