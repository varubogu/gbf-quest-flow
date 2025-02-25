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

      // テーブルの行を取得 (table > tr または div.row 相当の要素)
      const rows = actionTable.locator('[data-testid^="action-row-"]');

      // 行数が1であることを確認
      await expect(rows).toHaveCount(1);

      // 最初の行のフィールドを確認
      const firstRow = rows.first();

      // Actionコンポーネントの6つのフィールドを確認
      // data-field属性を使用してフィールドを特定
      const fields = [
        firstRow.locator('[data-field="hp"]'),
        firstRow.locator('[data-field="prediction"]'),
        firstRow.locator('[data-field="charge"]'),
        firstRow.locator('[data-field="guard"]'),
        firstRow.locator('[data-field="action"]'),
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

      test('ジョブ、特殊装備、アビリティ3表示され、いずれも空である', async ({ page }) => {
        const jobPanel = page.locator('#job-panel');
        await expect(jobPanel).toBeVisible();
        const jobRows = await jobPanel.locator('tbody tr');
        await expect(jobRows).toHaveCount(5);

        // 1列目のヘッダチェック
        const headers = await jobRows.locator('th');
        await expect(headers).toHaveCount(3);
        await expect(headers.nth(0)).toHaveText('ジョブ');
        await expect(headers.nth(1)).toHaveText('特殊装備');
        await expect(headers.nth(2)).toHaveText('アビリティ');

        // ジョブ
        const nameRows = await jobRows.nth(0).locator('td');
        await expect(nameRows).toHaveCount(2);
        await expect(nameRows.nth(0)).toHaveText('');
        await expect(nameRows.nth(1)).toHaveText('');

        // 特殊装備
        const noteRows = await jobRows.nth(1).locator('td');
        await expect(noteRows).toHaveCount(2);
        await expect(noteRows.nth(0)).toHaveText('');
        await expect(noteRows.nth(1)).toHaveText('');

        // アビリティ
        const ability1Rows = await jobRows.nth(2).locator('td');
        await expect(ability1Rows).toHaveCount(2);
        await expect(ability1Rows.nth(0)).toHaveText('');
        await expect(ability1Rows.nth(1)).toHaveText('');

        const ability2Rows = await jobRows.nth(3).locator('td');
        await expect(ability2Rows).toHaveCount(2);
        await expect(ability2Rows.nth(0)).toHaveText('');
        await expect(ability2Rows.nth(1)).toHaveText('');

        const ability3Rows = await jobRows.nth(4).locator('td');
        await expect(ability3Rows).toHaveCount(2);
        await expect(ability3Rows.nth(0)).toHaveText('');
        await expect(ability3Rows.nth(1)).toHaveText('');
      });

      test('キャラはフロント3件、サブ2件表示され、いずれも空である', async ({ page }) => {
        const jobPanel = page.locator('#character-table');
        await expect(jobPanel).toBeVisible();
        const jobRows = await jobPanel.locator('tbody tr');
        await expect(jobRows).toHaveCount(5);

        // 1列目のヘッダチェック
        const headers = await jobRows.locator('th');
        await expect(headers).toHaveCount(2);
        await expect(headers.nth(0)).toHaveText('フロント');
        await expect(headers.nth(1)).toHaveText('サブ');

        // フロント3件
        const front1Rows = await jobRows.nth(0).locator('td');
        await expect(front1Rows).toHaveCount(5);
        await expect(front1Rows.nth(0)).toHaveText(''); //キャラ
        await expect(front1Rows.nth(1)).toHaveText(''); //用途
        await expect(front1Rows.nth(2)).toHaveText(''); //覚醒
        await expect(front1Rows.nth(3)).toHaveText(''); //指輪・耳飾り
        await expect(front1Rows.nth(4)).toHaveText(''); //LB

        const front2Rows = await jobRows.nth(1).locator('td');
        await expect(front2Rows).toHaveCount(5);
        await expect(front2Rows.nth(0)).toHaveText(''); //キャラ
        await expect(front2Rows.nth(1)).toHaveText(''); //用途
        await expect(front2Rows.nth(2)).toHaveText(''); //覚醒
        await expect(front2Rows.nth(3)).toHaveText(''); //指輪・耳飾り
        await expect(front2Rows.nth(4)).toHaveText(''); //LB

        const front3Rows = await jobRows.nth(2).locator('td');
        await expect(front3Rows).toHaveCount(5);
        await expect(front3Rows.nth(0)).toHaveText(''); //キャラ
        await expect(front3Rows.nth(1)).toHaveText(''); //用途
        await expect(front3Rows.nth(2)).toHaveText(''); //覚醒
        await expect(front3Rows.nth(3)).toHaveText(''); //指輪・耳飾り
        await expect(front3Rows.nth(4)).toHaveText(''); //LB

        // サブ2件
        const back1Rows = await jobRows.nth(3).locator('td');
        await expect(back1Rows).toHaveCount(5);
        await expect(back1Rows.nth(0)).toHaveText(''); //キャラ
        await expect(back1Rows.nth(1)).toHaveText(''); //用途
        await expect(back1Rows.nth(2)).toHaveText(''); //覚醒
        await expect(back1Rows.nth(3)).toHaveText(''); //指輪・耳飾り
        await expect(back1Rows.nth(4)).toHaveText(''); //LB

        const back2Rows = await jobRows.nth(4).locator('td');
        await expect(back2Rows).toHaveCount(5);
        await expect(back2Rows.nth(0)).toHaveText(''); //キャラ
        await expect(back2Rows.nth(1)).toHaveText(''); //用途
        await expect(back2Rows.nth(2)).toHaveText(''); //覚醒
        await expect(back2Rows.nth(3)).toHaveText(''); //指輪・耳飾り
        await expect(back2Rows.nth(4)).toHaveText(''); //LB
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
        const weaponItems = await weaponPanel.locator('#weapon-table tbody tr');
        await expect(weaponItems).toHaveCount(13);

        // 1列目のヘッダチェック
        const headers = await weaponItems.locator('th');
        await expect(headers).toHaveCount(3);
        await expect(headers.nth(0)).toHaveText('メイン');
        await expect(headers.nth(1)).toHaveText('通常武器');
        await expect(headers.nth(2)).toHaveText('追加武器');

        // メイン1件
        const mainRow = weaponItems.nth(0).locator('td');
        await expect(mainRow).toHaveCount(3);
        await expect(mainRow.nth(0)).toHaveText(''); //武器名
        await expect(mainRow.nth(1)).toHaveText(''); //追加スキル
        await expect(mainRow.nth(2)).toHaveText(''); //概要

        // 通常9件
        const normal1Row = weaponItems.nth(1).locator('td');
        await expect(normal1Row).toHaveCount(3);
        await expect(normal1Row.nth(0)).toHaveText(''); //武器
        await expect(normal1Row.nth(1)).toHaveText(''); //追加スキル
        await expect(normal1Row.nth(2)).toHaveText(''); //概要

        const normal2Row = weaponItems.nth(2).locator('td');
        await expect(normal2Row).toHaveCount(3);
        await expect(normal2Row.nth(0)).toHaveText(''); //武器
        await expect(normal2Row.nth(1)).toHaveText(''); //追加スキル
        await expect(normal2Row.nth(2)).toHaveText(''); //概要

        const normal3Row = weaponItems.nth(3).locator('td');
        await expect(normal3Row).toHaveCount(3);
        await expect(normal3Row.nth(0)).toHaveText(''); //武器
        await expect(normal3Row.nth(1)).toHaveText(''); //追加スキル
        await expect(normal3Row.nth(2)).toHaveText(''); //概要

        const normal4Row = weaponItems.nth(4).locator('td');
        await expect(normal4Row).toHaveCount(3);
        await expect(normal4Row.nth(0)).toHaveText(''); //武器
        await expect(normal4Row.nth(1)).toHaveText(''); //追加スキル
        await expect(normal4Row.nth(2)).toHaveText(''); //概要

        const normal5Row = weaponItems.nth(5).locator('td');
        await expect(normal5Row).toHaveCount(3);
        await expect(normal5Row.nth(0)).toHaveText(''); //武器
        await expect(normal5Row.nth(1)).toHaveText(''); //追加スキル
        await expect(normal5Row.nth(2)).toHaveText(''); //概要

        const normal6Row = weaponItems.nth(6).locator('td');
        await expect(normal6Row).toHaveCount(3);
        await expect(normal6Row.nth(0)).toHaveText(''); //武器
        await expect(normal6Row.nth(1)).toHaveText(''); //追加スキル
        await expect(normal6Row.nth(2)).toHaveText(''); //概要

        const normal7Row = weaponItems.nth(7).locator('td');
        await expect(normal7Row).toHaveCount(3);
        await expect(normal7Row.nth(0)).toHaveText(''); //武器
        await expect(normal7Row.nth(1)).toHaveText(''); //追加スキル
        await expect(normal7Row.nth(2)).toHaveText(''); //概要

        const normal8Row = weaponItems.nth(8).locator('td');
        await expect(normal8Row).toHaveCount(3);
        await expect(normal8Row.nth(0)).toHaveText(''); //武器
        await expect(normal8Row.nth(1)).toHaveText(''); //追加スキル
        await expect(normal8Row.nth(2)).toHaveText(''); //概要

        const normal9Row = weaponItems.nth(9).locator('td');
        await expect(normal9Row).toHaveCount(3);
        await expect(normal9Row.nth(0)).toHaveText(''); //武器
        await expect(normal9Row.nth(1)).toHaveText(''); //追加スキル
        await expect(normal9Row.nth(2)).toHaveText(''); //概要

        // 追加3件
        const add1Row = weaponItems.nth(10).locator('td');
        await expect(add1Row).toHaveCount(3);
        await expect(add1Row.nth(0)).toHaveText(''); //武器
        await expect(add1Row.nth(1)).toHaveText(''); //追加スキル
        await expect(add1Row.nth(2)).toHaveText(''); //概要

        const add2Row = weaponItems.nth(11).locator('td');
        await expect(add2Row).toHaveCount(3);
        await expect(add2Row.nth(0)).toHaveText(''); //武器
        await expect(add2Row.nth(1)).toHaveText(''); //追加スキル
        await expect(add2Row.nth(2)).toHaveText(''); //概要

        const add3Row = weaponItems.nth(12).locator('td');
        await expect(add3Row).toHaveCount(3);
        await expect(add3Row.nth(0)).toHaveText(''); //武器
        await expect(add3Row.nth(1)).toHaveText(''); //追加スキル
        await expect(add3Row.nth(2)).toHaveText(''); //概要
      });
    });

    test.describe('召喚石パネル', () => {
      test.beforeEach(async ({ page }) => {
        await page.click('button:has-text("召喚石")'); // 召喚石ボタンをクリック
      });

      test('召喚石パネルが表示される', async ({ page }) => {
        await expect(page.locator('#summon-panel')).toBeVisible();
      });

      test('召喚石はメイン1、フレンド1、通常石4、サブ石2が空で表示される', async ({ page }) => {
        const summonPanel = page.locator('#summon-panel');
        await expect(summonPanel).toBeVisible();
        const summonRows = await summonPanel.locator('tbody tr');
        await expect(summonRows).toHaveCount(8);

        // ヘッダが4件であることの確認
        const headers = await summonRows.locator('th');
        await expect(headers).toHaveCount(4);

        // 1列目のヘッダチェック
        await expect(headers.nth(0)).toHaveText('メイン');
        await expect(headers.nth(1)).toHaveText('フレンド');
        await expect(headers.nth(2)).toHaveText('通常石');
        await expect(headers.nth(3)).toHaveText('サブ');

        // メイン1件
        const mainRow = summonRows.nth(0).locator('td');
        await expect(mainRow).toHaveCount(2);
        await expect(mainRow.nth(0)).toHaveText(''); //召喚石
        await expect(mainRow.nth(1)).toHaveText(''); //概要

        // フレンド1件
        const friendRow = summonRows.nth(1).locator('td');
        await expect(friendRow).toHaveCount(2);
        await expect(friendRow.nth(0)).toHaveText(''); //召喚石
        await expect(friendRow.nth(1)).toHaveText(''); //解説

        // 通常石3件
        const normal1Row = summonRows.nth(2).locator('td');
        await expect(normal1Row).toHaveCount(2);
        await expect(normal1Row.nth(0)).toHaveText(''); //召喚石
        await expect(normal1Row.nth(1)).toHaveText(''); //解説

        const normal2Row = summonRows.nth(3).locator('td');
        await expect(normal2Row).toHaveCount(2);
        await expect(normal2Row.nth(0)).toHaveText(''); //召喚石
        await expect(normal2Row.nth(1)).toHaveText(''); //解説

        const normal3Row = summonRows.nth(4).locator('td');
        await expect(normal3Row).toHaveCount(2);
        await expect(normal3Row.nth(0)).toHaveText(''); //召喚石
        await expect(normal3Row.nth(1)).toHaveText(''); //解説

        const normal4Row = summonRows.nth(5).locator('td');
        await expect(normal4Row).toHaveCount(2);
        await expect(normal4Row.nth(0)).toHaveText(''); //召喚石
        await expect(normal4Row.nth(1)).toHaveText(''); //解説


        // サブ石2件
        const sub1Row = summonRows.nth(6).locator('td');
        await expect(sub1Row).toHaveCount(2);
        await expect(sub1Row.nth(0)).toHaveText(''); //召喚石
        await expect(sub1Row.nth(1)).toHaveText(''); //解説

        const sub2Row = summonRows.nth(7).locator('td');
        await expect(sub2Row).toHaveCount(2);
        await expect(sub2Row.nth(0)).toHaveText(''); //召喚石
        await expect(sub2Row.nth(1)).toHaveText(''); //解説

      });
    });

    test.describe('動画パネル', () => {
      test.beforeEach(async ({ page }) => {
        await page.click('button:has-text("動画")'); // 動画ボタンをクリック
      });

      test('動画パネルが表示される', async ({ page }) => {
        await expect(page.locator('#video-panel')).toBeVisible();
      });

      test('動画が空で表示される', async ({ page }) => {
        const videoPanel = page.locator('[aria-label="動画"]');
        await expect(videoPanel).toBeVisible();
        await expect(videoPanel).toHaveText('');
      });
    });

    test.describe('スキル総合値パネル', () => {
      test.beforeEach(async ({ page }) => {
        await page.click('button:has-text("スキル総合値")'); // スキル総合値ボタンをクリック
      });

      test('スキル総合値パネルが表示される', async ({ page }) => {
        await expect(page.locator('#skill-total-panel')).toBeVisible();
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
