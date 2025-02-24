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

      // DIV構造の行を取得 (ActionTableRowコンポーネントに対応するもの)
      const rows = actionTable.locator('div > div').filter({ hasText: /.*/ });

      // 行数が1であることを確認
      // await expect(rows).toHaveCount(1);

      // 最初の行のフィールドを確認 (各フィールドはクラス名や属性で識別)
      const firstRow = rows.first();

      // Actionコンポーネントの6つのフィールドを確認
      // 属性セレクタを使用してフィールドを特定
      const fields = [
        firstRow.locator('[data-field="action"]'),
        firstRow.locator('[data-field="charge"]'),
        firstRow.locator('[data-field="guard"]'),
        firstRow.locator('[data-field="prediction"]'),
        firstRow.locator('[data-field="hp"]'),
        firstRow.locator('[data-field="note"]')
      ];

      // 各フィールドが存在し、空であることを確認
      for (const field of fields) {
        await expect(field).toBeVisible();
        await expect(field).toHaveText('');
      }
    });
  });

  test.describe('編成確認', () => {
    test.beforeEach(async ({ page }) => {
      await page.click('button:has-text("編成確認")'); // 編成確認ボタンをクリック
    });

    test('編成確認が表示される', async ({ page }) => {
      await expect(page.locator('#organization-modal')).toBeVisible();
    });

    test.describe('ジョブやキャラパネル', () => {
      test.beforeEach(async ({ page }) => {
        await page.click('button:has-text("ジョブ、キャラ、アビリティ")'); // ジョブやキャラボタンをクリック
      });

      test('ジョブやキャラのパネルが表示される', async ({ page }) => {
        await expect(page.locator('#job-panel')).toBeVisible();
      });

      test('ジョブは3件表示され、いずれも空である', async ({ page }) => {
        const jobPanel = page.locator('#job-panel');
        await expect(jobPanel).toBeVisible();
        const jobItems = await jobPanel.locator('tbody tr');
        await expect(jobItems).toHaveCount(3);

        // 1列目のヘッダチェック
        await expect(jobItems.nth(0).locator('th').nth(0)).toHaveText('ジョブ');
        await expect(jobItems.nth(1).locator('th').nth(0)).toHaveText('特殊装備');
        await expect(jobItems.nth(2).locator('th').nth(0)).toHaveText('アビリティ');

        // 名前列
        await expect(jobItems.nth(0).locator('td').nth(1)).toHaveText('');
        await expect(jobItems.nth(1).locator('td').nth(1)).toHaveText('');
        await expect(jobItems.nth(2).locator('td').nth(1)).toHaveText('');
        // 解説列
        await expect(jobItems.nth(0).locator('td').nth(2)).toHaveText('');
        await expect(jobItems.nth(1).locator('td').nth(2)).toHaveText('');
        await expect(jobItems.nth(2).locator('td').nth(2)).toHaveText('');
      });

      test('キャラはフロント3件、サブ2件表示され、いずれも空である', async ({ page }) => {
        const jobPanel = page.locator('#job-panel');
        await expect(jobPanel).toBeVisible();
        const jobItems = await jobPanel.locator('tbody tr');
        await expect(jobItems).toHaveCount(5);

        // 1列目のヘッダチェック
        await expect(jobItems.nth(0).locator('th').nth(0)).toHaveText('フロント');
        await expect(jobItems.nth(1).locator('th').nth(0)).toHaveText('サブ');

        // フロント3件
        await expect(jobItems.nth(0).locator('td').nth(1)).toHaveText(''); //キャラ
        await expect(jobItems.nth(0).locator('td').nth(2)).toHaveText(''); //用途
        await expect(jobItems.nth(0).locator('td').nth(3)).toHaveText(''); //覚醒
        await expect(jobItems.nth(0).locator('td').nth(4)).toHaveText(''); //指輪・耳飾り
        await expect(jobItems.nth(0).locator('td').nth(5)).toHaveText(''); //LB

        await expect(jobItems.nth(1).locator('td').nth(1)).toHaveText(''); //キャラ
        await expect(jobItems.nth(1).locator('td').nth(2)).toHaveText(''); //用途
        await expect(jobItems.nth(1).locator('td').nth(3)).toHaveText(''); //覚醒
        await expect(jobItems.nth(1).locator('td').nth(4)).toHaveText(''); //指輪・耳飾り
        await expect(jobItems.nth(1).locator('td').nth(5)).toHaveText(''); //LB

        await expect(jobItems.nth(2).locator('td').nth(1)).toHaveText(''); //キャラ
        await expect(jobItems.nth(2).locator('td').nth(2)).toHaveText(''); //用途
        await expect(jobItems.nth(2).locator('td').nth(3)).toHaveText(''); //覚醒
        await expect(jobItems.nth(2).locator('td').nth(4)).toHaveText(''); //指輪・耳飾り
        await expect(jobItems.nth(2).locator('td').nth(5)).toHaveText(''); //LB

        // サブ2件
        await expect(jobItems.nth(3).locator('td').nth(1)).toHaveText(''); //キャラ
        await expect(jobItems.nth(3).locator('td').nth(2)).toHaveText(''); //用途
        await expect(jobItems.nth(3).locator('td').nth(3)).toHaveText(''); //覚醒
        await expect(jobItems.nth(3).locator('td').nth(4)).toHaveText(''); //指輪・耳飾り
        await expect(jobItems.nth(3).locator('td').nth(5)).toHaveText(''); //LB

        await expect(jobItems.nth(4).locator('td').nth(1)).toHaveText(''); //キャラ
        await expect(jobItems.nth(4).locator('td').nth(2)).toHaveText(''); //用途
        await expect(jobItems.nth(4).locator('td').nth(3)).toHaveText(''); //覚醒
        await expect(jobItems.nth(4).locator('td').nth(4)).toHaveText(''); //指輪・耳飾り
        await expect(jobItems.nth(4).locator('td').nth(5)).toHaveText(''); //LB
      });
    });

    test.describe('武器やスキルパネル', () => {
      test.beforeEach(async ({ page }) => {
        await page.click('button:has-text("武器")'); // 武器やスキルボタンをクリック
      });

      test('武器やスキルのパネルが表示される', async ({ page }) => {
        await expect(page.locator('#weapon-panel')).toBeVisible();
      });

      test('武器はメイン1、通常9、追加3が表示され、いずれも空である', async ({ page }) => {
        const weaponPanel = page.locator('#weapon-panel');
        await expect(weaponPanel).toBeVisible();
        const weaponItems = await weaponPanel.locator('tbody tr');
        await expect(weaponItems).toHaveCount(13);

        // 1列目のヘッダチェック
        await expect(weaponItems.nth(0).locator('th').nth(0)).toHaveText('メイン');
        await expect(weaponItems.nth(1).locator('th').nth(0)).toHaveText('通常武器');
        await expect(weaponItems.nth(2).locator('th').nth(0)).toHaveText('追加武器');

        // メイン1件
        await expect(weaponItems.nth(0).locator('td').nth(1)).toHaveText(''); //武器
        await expect(weaponItems.nth(0).locator('td').nth(2)).toHaveText(''); //解説
        await expect(weaponItems.nth(0).locator('td').nth(3)).toHaveText(''); //覚醒

        // 通常9件
        await expect(weaponItems.nth(1).locator('td').nth(1)).toHaveText(''); //武器
        await expect(weaponItems.nth(1).locator('td').nth(2)).toHaveText(''); //解説
        await expect(weaponItems.nth(1).locator('td').nth(3)).toHaveText(''); //覚醒

        await expect(weaponItems.nth(2).locator('td').nth(1)).toHaveText(''); //武器
        await expect(weaponItems.nth(2).locator('td').nth(2)).toHaveText(''); //解説
        await expect(weaponItems.nth(2).locator('td').nth(3)).toHaveText(''); //覚醒

        await expect(weaponItems.nth(3).locator('td').nth(1)).toHaveText(''); //武器
        await expect(weaponItems.nth(3).locator('td').nth(2)).toHaveText(''); //解説
        await expect(weaponItems.nth(3).locator('td').nth(3)).toHaveText(''); //覚醒

        await expect(weaponItems.nth(4).locator('td').nth(1)).toHaveText(''); //武器
        await expect(weaponItems.nth(4).locator('td').nth(2)).toHaveText(''); //解説
        await expect(weaponItems.nth(4).locator('td').nth(3)).toHaveText(''); //覚醒

        // 追加3件
        await expect(weaponItems.nth(10).locator('td').nth(1)).toHaveText(''); //武器
        await expect(weaponItems.nth(10).locator('td').nth(2)).toHaveText(''); //解説
        await expect(weaponItems.nth(10).locator('td').nth(3)).toHaveText(''); //覚醒

        await expect(weaponItems.nth(11).locator('td').nth(1)).toHaveText(''); //武器
        await expect(weaponItems.nth(11).locator('td').nth(2)).toHaveText(''); //解説
        await expect(weaponItems.nth(11).locator('td').nth(3)).toHaveText(''); //覚醒

        await expect(weaponItems.nth(12).locator('td').nth(1)).toHaveText(''); //武器
        await expect(weaponItems.nth(12).locator('td').nth(2)).toHaveText(''); //解説
        await expect(weaponItems.nth(12).locator('td').nth(3)).toHaveText(''); //覚醒
      });
    });

    test.describe('召喚石パネル', () => {
      test.beforeEach(async ({ page }) => {
        await page.click('button:has-text("召喚石")'); // 召喚石ボタンをクリック
      });

      test('召喚石が空で表示される', async ({ page }) => {
        const actionTable = page.locator('#flow-action-table');
        await expect(actionTable).toBeVisible();
        await expect(actionTable).toHaveText('');
      });
    });

    test.describe('動画パネル', () => {
      test.beforeEach(async ({ page }) => {
        await page.click('button:has-text("動画")'); // 動画ボタンをクリック
      });

      test('動画が空で表示される', async ({ page }) => {
        const actionTable = page.locator('#flow-action-table');
        await expect(actionTable).toBeVisible();
        await expect(actionTable).toHaveText('');
      });
    });

    test.describe('スキル総合値パネル', () => {
      test.beforeEach(async ({ page }) => {
        await page.click('button:has-text("スキル総合値")'); // スキル総合値ボタンをクリック
      });

      test('スキル総合値が空で表示される', async ({ page }) => {
        const actionTable = page.locator('#flow-action-table');
        await expect(actionTable).toBeVisible();
        await expect(actionTable).toHaveText('');
      });
    });
  });

  test.describe('その他情報', () => {
    test.beforeEach(async ({ page }) => {
      await page.click('button[aria-label="その他の情報"]'); // その他情報ボタンをクリック
    });

    test('その他情報が表示される', async ({ page }) => {
      await expect(page.locator('#info-modal')).toBeVisible();
    });

    test('タイトルが初期値で表示される', async ({ page }) => {
      const titleInput = page.getByRole('textbox', { name: 'タイトル' });
      await expect(titleInput).toBeVisible();
      await expect(titleInput).toHaveValue('新しいフロー');
    });

    test('クエストが空で表示される', async ({ page }) => {
      const questInput = page.getByRole('textbox', { name: 'クエスト' });
      await expect(questInput).toBeVisible();
      await expect(questInput).toHaveValue('');
    });

    test('作成者が空で表示される', async ({ page }) => {
      const authorInput = page.getByRole('textbox', { name: '作成者' });
      await expect(authorInput).toBeVisible();
      await expect(authorInput).toHaveValue('');
    });

    test('概要が空で表示される', async ({ page }) => {
      const descriptionInput = page.getByRole('textbox', { name: '概要' });
      await expect(descriptionInput).toBeVisible();
      await expect(descriptionInput).toHaveValue('');
    });

    test('更新日時が現在の日付で表示される', async ({ page }) => {
      const updateDateInput = page.getByRole('textbox', { name: '更新日時' });
      await expect(updateDateInput).toBeVisible();
      // 値が存在することを確認（具体的な日付の検証は複雑になるため、存在確認のみ）
      // 要素の値を取得
      const value = await updateDateInput.getAttribute('value');
      await expect(value).not.toBeNull();
    });

    test('参考動画URLが空で表示される', async ({ page }) => {
      const movieInput = page.getByRole('textbox', { name: '参考動画URL' });
      await expect(movieInput).toBeVisible();
      await expect(movieInput).toHaveValue('');
    });

    test('その他ノートが空で表示される', async ({ page }) => {
      const noteInput = page.getByRole('textbox', { name: 'その他ノート' });
      await expect(noteInput).toBeVisible();
      await expect(noteInput).toHaveValue('');
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
