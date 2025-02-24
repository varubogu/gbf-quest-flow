import { test, expect } from '@playwright/test';

const createButtonText = '新しいデータを作る';
const loadButtonText = 'データ読み込み';

test.describe('インデックスページ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/'); // インデックスページに移動
  });

  test('初期表示でボタンが２つ表示される', async ({ page }) => {
    const createButton = page.getByRole('button', { name: createButtonText });
    const loadButton = page.getByRole('button', { name: loadButtonText });

    await expect(createButton).toBeVisible();
    await expect(loadButton).toBeVisible();
  });

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

    // ファイル選択イベントをハンドリング
    await page.evaluate(() => {
      window.addEventListener('change', (e) => {
        const input = e.target as HTMLInputElement;
        if (input?.files?.length) {
          console.log('File selected:', input.files[0]?.name);
        }
      }, { once: true });
    });

    // input[type="file"]要素が作成されるのを待つ
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click(`button:has-text("${loadButtonText}")`);
    const fileChooser = await fileChooserPromise;

    // ファイルを選択
    await fileChooser.setFiles(filePath);

    // データが反映されるのを待つ
    await expect(page.getByText('ルシゼロ火マナ')).toBeVisible();
  });
});
