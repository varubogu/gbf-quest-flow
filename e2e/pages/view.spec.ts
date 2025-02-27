import { test, expect } from '@playwright/test';
import sampleData from '../../src/content/flows/sample.json' assert { type: 'json' };
import { expectMultiLineText } from '@/lib/utils/tests/expectedFunction';

test.describe('行動表画面', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/sample'); // 新規作成画面に移動
  });

  test.describe('初期表示', () => {
    test('タイトルが初期設定で表示される', async ({ page }) => {
      const titleInput = page.locator('#flow-title');
      await expect(titleInput).toBeVisible();
      await expect(titleInput).toHaveText(sampleData.title);
    });

    test('メモ欄が表示される', async ({ page }) => {
      const memoInput = page.locator('#flow-memo');
      await expect(memoInput).toBeVisible();
      await expect(memoInput).toHaveText(sampleData.always);
    });

    test('行動表がデータと一致', async ({ page }) => {
      const actionTable = page.locator('#flow-action-table');
      await expect(actionTable).toBeVisible();

      // テーブルの行を取得
      const rows = actionTable.locator('tbody tr');

      // 行数が一致するか確認
      await expect(rows).toHaveCount(sampleData.flow.length);

      for (let i = 0; i < sampleData.flow.length; i++) {
        const row = rows.nth(i);
        const cells = row.locator('td');
        await expect(cells).toHaveCount(6);

        const flow = sampleData.flow.at(i);
        if (!flow) {
          throw new Error('flowが見つかりません');
        }

        await expect(cells.nth(0)).toHaveText(flow.hp);
        await expect(cells.nth(1)).toHaveText(flow.prediction);
        await expect(cells.nth(2)).toHaveText(flow.charge);
        await expect(cells.nth(3)).toHaveText(flow.guard);
        await expect(cells.nth(4)).toHaveText(flow.action);
        await expect(cells.nth(5)).toHaveText(flow.note);
      }
    });
  });

  test.describe('編成確認画面', async () => {
    test.beforeEach(async ({ page }) => {
      await page.click('button:has-text("編成確認")'); // 編成確認ボタンをクリック
    });

    test('編成確認が表示される', async ({ page }) => {
      await expect(page.locator('#organization-modal')).toBeVisible();
    });

    test.describe('ジョブやキャラパネル', async () => {
      test.beforeEach(async ({ page }) => {
        await page.click('button:has-text("ジョブ、キャラ、アビリティ")'); // ジョブやキャラボタンをクリック
      });

      test('ジョブやキャラのパネルが表示される', async ({ page }) => {
        await expect(page.locator('#job-panel')).toBeVisible();
      });

      test('ジョブはデータと一致', async ({ page }) => {
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
        await expect(nameRows.nth(0)).toHaveText(sampleData.organization.job.name);
        await expect(nameRows.nth(1)).toHaveText(sampleData.organization.job.note);

        // 特殊装備
        const noteRows = await jobRows.nth(1).locator('td');
        await expect(noteRows).toHaveCount(2);
        await expect(noteRows.nth(0)).toHaveText(sampleData.organization.job.equipment.name);
        await expect(noteRows.nth(1)).toHaveText(sampleData.organization.job.equipment.note);

        // アビリティ
        const abilities = sampleData.organization.job.abilities;
        if (!abilities) {
          throw new Error('abilitiesが見つかりません');
        }
        const ability1Rows = await jobRows.nth(2).locator('td');
        await expect(ability1Rows).toHaveCount(2);
        const ability1 = abilities.at(0);
        if (!ability1) {
          throw new Error('ability1が見つかりません');
        }
        await expect(ability1Rows.nth(0)).toHaveText(ability1.name);
        await expect(ability1Rows.nth(1)).toHaveText(ability1.note);

        const ability2Rows = await jobRows.nth(3).locator('td');
        await expect(ability2Rows).toHaveCount(2);
        const ability2 = abilities.at(1);
        if (!ability2) {
          throw new Error('ability2が見つかりません');
        }
        await expect(ability2Rows.nth(0)).toHaveText(ability2.name);
        await expect(ability2Rows.nth(1)).toHaveText(ability2.note);

        const ability3Rows = await jobRows.nth(4).locator('td');
        await expect(ability3Rows).toHaveCount(2);
        const ability3 = abilities.at(2);
        if (!ability3) {
          throw new Error('ability3が見つかりません');
        }
        await expect(ability3Rows.nth(0)).toHaveText(ability3.name);
        await expect(ability3Rows.nth(1)).toHaveText(ability3.note);

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
        const front1 = sampleData.organization.member.front.at(0);
        if (!front1) {
          throw new Error('front1が見つかりません');
        }
        await expect(front1Rows.nth(0)).toHaveText(front1.name); //キャラ
        await expectMultiLineText(front1Rows.nth(1), front1.note); //用途
        await expect(front1Rows.nth(2)).toHaveText(front1.awaketype); //覚醒
        await expectMultiLineText(front1Rows.nth(3), front1.accessories); //指輪・耳飾り
        await expectMultiLineText(front1Rows.nth(4), front1.limitBonus); //LB

        const front2Rows = await jobRows.nth(1).locator('td');
        await expect(front2Rows).toHaveCount(5);
        const front2 = sampleData.organization.member.front.at(1);
        if (!front2) {
          throw new Error('front2が見つかりません');
        }
        await expect(front2Rows.nth(0)).toHaveText(front2.name); //キャラ
        await expectMultiLineText(front2Rows.nth(1), front2.note); //用途
        await expect(front2Rows.nth(2)).toHaveText(front2.awaketype); //覚醒
        await expectMultiLineText(front2Rows.nth(3), front2.accessories); //指輪・耳飾り
        await expectMultiLineText(front2Rows.nth(4), front2.limitBonus); //LB

        const front3Rows = await jobRows.nth(2).locator('td');
        await expect(front3Rows).toHaveCount(5);
        const front3 = sampleData.organization.member.front.at(2);
        if (!front3) {
          throw new Error('front3が見つかりません');
        }
        await expect(front3Rows.nth(0)).toHaveText(front3.name); //キャラ
        await expectMultiLineText(front3Rows.nth(1), front3.note); //用途
        await expect(front3Rows.nth(2)).toHaveText(front3.awaketype); //覚醒
        await expectMultiLineText(front3Rows.nth(3), front3.accessories); //指輪・耳飾り
        await expectMultiLineText(front3Rows.nth(4), front3.limitBonus); //LB

        // サブ2件
        const back1Rows = await jobRows.nth(3).locator('td');
        await expect(back1Rows).toHaveCount(5);
        const back1 = sampleData.organization.member.back.at(0);
        if (!back1) {
          throw new Error('back1が見つかりません');
        }
        await expect(back1Rows.nth(0)).toHaveText(back1.name); //キャラ
        await expectMultiLineText(back1Rows.nth(1), back1.note); //用途
        await expect(back1Rows.nth(2)).toHaveText(back1.awaketype); //覚醒
        await expectMultiLineText(back1Rows.nth(3), back1.accessories); //指輪・耳飾り
        await expectMultiLineText(back1Rows.nth(4), back1.limitBonus); //LB

        const back2Rows = await jobRows.nth(4).locator('td');
        await expect(back2Rows).toHaveCount(5);
        const back2 = sampleData.organization.member.back.at(1);
        if (!back2) {
          throw new Error('back2が見つかりません');
        }
        await expect(back2Rows.nth(0)).toHaveText(back2.name); //キャラ
        await expectMultiLineText(back2Rows.nth(1), back2.note); //用途
        await expect(back2Rows.nth(2)).toHaveText(back2.awaketype); //覚醒
        await expectMultiLineText(back2Rows.nth(3), back2.accessories); //指輪・耳飾り
        await expectMultiLineText(back2Rows.nth(4), back2.limitBonus); //LB
      });
    });

    test.describe('武器やスキルパネル', async () => {
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

        const weapon = sampleData.organization.weapon;
        if (!weapon) {
          throw new Error('weaponが見つかりません');
        }

        // メイン1件
        const mainRow = weaponItems.nth(0).locator('td');
        await expect(mainRow).toHaveCount(3);
        await expect(mainRow.nth(0)).toHaveText(weapon.main.name); //武器名
        await expectMultiLineText(mainRow.nth(1), weapon.main.additionalSkill); //追加スキル
        await expectMultiLineText(mainRow.nth(2), weapon.main.note); //概要

        // 通常9件
        const normal1Row = weaponItems.nth(1).locator('td');
        await expect(normal1Row).toHaveCount(3);
        await expect(normal1Row.nth(0)).toHaveText(weapon.other.at(0)?.name ?? ''); //武器
        await expectMultiLineText(normal1Row.nth(1), weapon.other.at(0)?.additionalSkill ?? ''); //追加スキル
        await expectMultiLineText(normal1Row.nth(2), weapon.other.at(0)?.note ?? ''); //概要

        const normal2Row = weaponItems.nth(2).locator('td');
        await expect(normal2Row).toHaveCount(3);
        await expect(normal2Row.nth(0)).toHaveText(weapon.other.at(1)?.name ?? ''); //武器
        await expectMultiLineText(normal2Row.nth(1), weapon.other.at(1)?.additionalSkill ?? ''); //追加スキル
        await expectMultiLineText(normal2Row.nth(2), weapon.other.at(1)?.note ?? ''); //概要

        const normal3Row = weaponItems.nth(3).locator('td');
        await expect(normal3Row).toHaveCount(3);
        await expect(normal3Row.nth(0)).toHaveText(weapon.other.at(2)?.name ?? ''); //武器
        await expectMultiLineText(normal3Row.nth(1), weapon.other.at(2)?.additionalSkill ?? ''); //追加スキル
        await expectMultiLineText(normal3Row.nth(2), weapon.other.at(2)?.note ?? ''); //概要

        const normal4Row = weaponItems.nth(4).locator('td');
        await expect(normal4Row).toHaveCount(3);
        await expect(normal4Row.nth(0)).toHaveText(weapon.other.at(3)?.name ?? ''); //武器
        await expectMultiLineText(normal4Row.nth(1), weapon.other.at(3)?.additionalSkill ?? ''); //追加スキル
        await expectMultiLineText(normal4Row.nth(2), weapon.other.at(3)?.note ?? ''); //概要

        const normal5Row = weaponItems.nth(5).locator('td');
        await expect(normal5Row).toHaveCount(3);
        await expect(normal5Row.nth(0)).toHaveText(weapon.other.at(4)?.name ?? ''); //武器
        await expectMultiLineText(normal5Row.nth(1), weapon.other.at(4)?.additionalSkill ?? ''); //追加スキル
        await expectMultiLineText(normal5Row.nth(2), weapon.other.at(4)?.note ?? ''); //概要

        const normal6Row = weaponItems.nth(6).locator('td');
        await expect(normal6Row).toHaveCount(3);
        await expect(normal6Row.nth(0)).toHaveText(weapon.other.at(5)?.name ?? ''); //武器
        await expectMultiLineText(normal6Row.nth(1), weapon.other.at(5)?.additionalSkill ?? ''); //追加スキル
        await expectMultiLineText(normal6Row.nth(2), weapon.other.at(5)?.note ?? ''); //概要

        const normal7Row = weaponItems.nth(7).locator('td');
        await expect(normal7Row).toHaveCount(3);
        await expect(normal7Row.nth(0)).toHaveText(weapon.other.at(6)?.name ?? ''); //武器
        await expectMultiLineText(normal7Row.nth(1), weapon.other.at(6)?.additionalSkill ?? ''); //追加スキル
        await expectMultiLineText(normal7Row.nth(2), weapon.other.at(6)?.note ?? ''); //概要

        const normal8Row = weaponItems.nth(8).locator('td');
        await expect(normal8Row).toHaveCount(3);
        await expect(normal8Row.nth(0)).toHaveText(weapon.other.at(7)?.name ?? ''); //武器
        await expectMultiLineText(normal8Row.nth(1), weapon.other.at(7)?.additionalSkill ?? ''); //追加スキル
        await expectMultiLineText(normal8Row.nth(2), weapon.other.at(7)?.note ?? ''); //概要

        const normal9Row = weaponItems.nth(9).locator('td');
        await expect(normal9Row).toHaveCount(3);
        await expect(normal9Row.nth(0)).toHaveText(weapon.other.at(8)?.name ?? ''); //武器
        await expectMultiLineText(normal9Row.nth(1), weapon.other.at(8)?.additionalSkill ?? ''); //追加スキル
        await expectMultiLineText(normal9Row.nth(2), weapon.other.at(8)?.note ?? ''); //概要

        // 追加3件
        const add1Row = weaponItems.nth(10).locator('td');
        await expect(add1Row).toHaveCount(3);
        await expect(add1Row.nth(0)).toHaveText(weapon.additional.at(0)?.name ?? ''); //武器
        await expectMultiLineText(add1Row.nth(1), weapon.additional.at(0)?.additionalSkill ?? ''); //追加スキル
        await expectMultiLineText(add1Row.nth(2), weapon.additional.at(0)?.note ?? ''); //概要

        const add2Row = weaponItems.nth(11).locator('td');
        await expect(add2Row).toHaveCount(3);
        await expect(add2Row.nth(0)).toHaveText(weapon.additional.at(1)?.name ?? ''); //武器
        await expectMultiLineText(add2Row.nth(1), weapon.additional.at(1)?.additionalSkill ?? ''); //追加スキル
        await expectMultiLineText(add2Row.nth(2), weapon.additional.at(1)?.note ?? ''); //概要

        const add3Row = weaponItems.nth(12).locator('td');
        await expect(add3Row).toHaveCount(3);
        await expect(add3Row.nth(0)).toHaveText(weapon.additional.at(2)?.name ?? ''); //武器
        await expectMultiLineText(add3Row.nth(1), weapon.additional.at(2)?.additionalSkill ?? ''); //追加スキル
        await expectMultiLineText(add3Row.nth(2), weapon.additional.at(2)?.note ?? ''); //概要
      });
    });

    test.describe('召喚石パネル', async () => {
      test.beforeEach(async ({ page }) => {
        await page.click('button:has-text("召喚石")'); // 召喚石ボタンをクリック
      });

      test('召喚石パネルが表示される', async ({ page }) => {
        await expect(page.locator('#summon-panel')).toBeVisible();
      });

      test('召喚石が空で表示される', async ({ page }) => {
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

        const summon = sampleData.organization.summon;
        if (!summon) {
          throw new Error('summonが見つかりません');
        }

        // メイン1件
        const mainRow = summonRows.nth(0).locator('td');
        await expect(mainRow).toHaveCount(2);
        await expect(mainRow.nth(0)).toHaveText(summon.main.name); //召喚石
        await expectMultiLineText(mainRow.nth(1), summon.main.note); //概要

        // フレンド1件
        const friendRow = summonRows.nth(1).locator('td');
        await expect(friendRow).toHaveCount(2);
        await expect(friendRow.nth(0)).toHaveText(summon.friend.name); //召喚石
        await expectMultiLineText(friendRow.nth(1), summon.friend.note); //解説

        // 通常石3件
        const normal1Row = summonRows.nth(2).locator('td');
        await expect(normal1Row).toHaveCount(2);
        await expect(normal1Row.nth(0)).toHaveText(summon.other.at(0)?.name ?? ''); //召喚石
        await expectMultiLineText(normal1Row.nth(1), summon.other.at(0)?.note ?? ''); //解説

        const normal2Row = summonRows.nth(3).locator('td');
        await expect(normal2Row).toHaveCount(2);
        await expect(normal2Row.nth(0)).toHaveText(summon.other.at(1)?.name ?? ''); //召喚石
        await expectMultiLineText(normal2Row.nth(1), summon.other.at(1)?.note ?? ''); //解説

        const normal3Row = summonRows.nth(4).locator('td');
        await expect(normal3Row).toHaveCount(2);
        await expect(normal3Row.nth(0)).toHaveText(summon.other.at(2)?.name ?? ''); //召喚石
        await expectMultiLineText(normal3Row.nth(1), summon.other.at(2)?.note ?? ''); //解説

        const normal4Row = summonRows.nth(5).locator('td');
        await expect(normal4Row).toHaveCount(2);
        await expect(normal4Row.nth(0)).toHaveText(summon.other.at(3)?.name ?? ''); //召喚石
        await expectMultiLineText(normal4Row.nth(1), summon.other.at(3)?.note ?? ''); //解説

        // サブ石2件
        const sub1Row = summonRows.nth(6).locator('td');
        await expect(sub1Row).toHaveCount(2);
        await expect(sub1Row.nth(0)).toHaveText(summon.sub.at(0)?.name ?? ''); //召喚石
        await expectMultiLineText(sub1Row.nth(1), summon.sub.at(0)?.note ?? ''); //解説

        const sub2Row = summonRows.nth(7).locator('td');
        await expect(sub2Row).toHaveCount(2);
        await expect(sub2Row.nth(0)).toHaveText(summon.sub.at(1)?.name ?? ''); //召喚石
        await expectMultiLineText(sub2Row.nth(1), summon.sub.at(1)?.note ?? ''); //解説

      });
    });

    test.describe('動画パネル', async () => {
      test.beforeEach(async ({ page }) => {
        await page.click('button:has-text("動画")'); // 動画ボタンをクリック
      });

      test('動画パネルが表示される', async ({ page }) => {
        await expect(page.locator('#video-panel')).toBeVisible();
      });

      test('動画が空で表示される', async ({ page }) => {
        const videoPanel = page.locator('[aria-label="動画"]');
        await expect(videoPanel).toBeVisible();
        await expect(videoPanel).toHaveText(sampleData.movie ?? '');
      });
    });

    test.describe('スキル総合値パネル', async () => {
      test.beforeEach(async ({ page }) => {
        await page.click('button:has-text("スキル総合値")'); // スキル総合値ボタンをクリック
      });

      test('スキル総合値パネルが表示される', async ({ page }) => {
        await expect(page.locator('#skill-total-panel')).toBeVisible();
      });
    });
  });

  test.describe('その他情報画面', async () => {
    test.beforeEach(async ({ page }) => {
      await page.click('button[aria-label="その他の情報"]'); // その他情報ボタンをクリック
    });

    test('その他情報が表示される', async ({ page }) => {
      await expect(page.locator('#info-modal')).toBeVisible();
    });

    test('タイトルが表示される', async ({ page }) => {
      const title = page.getByTestId('info-flow-title');
      await expect(title).toBeVisible();
      await expect(title).toHaveText(sampleData.title ?? '');
    });

    test('クエストが表示される', async ({ page }) => {
      const quest = page.getByTestId('info-flow-quest');
      await expect(quest).toBeVisible();
      await expect(quest).toHaveText(sampleData.quest ?? '');
    });

    test('作成者が表示される', async ({ page }) => {
      const author = page.getByTestId('info-flow-author');
      await expect(author).toBeVisible();
      await expect(author).toHaveText(sampleData.author ?? '');
    });

    test('概要が表示される', async ({ page }) => {
      const description = page.getByTestId('info-flow-overview');
      await expect(description).toBeVisible();
      await expect(description).toHaveText(sampleData.description ?? '');
    });

    test('更新日時が表示される', async ({ page }) => {
      const updateDate = page.getByTestId('info-flow-update-date');
      await expect(updateDate).toBeVisible();
      await expect(updateDate).toHaveText(sampleData.updateDate ?? '');
    });

    test('参考動画URLが表示される', async ({ page }) => {
      const movie = page.getByTestId('info-flow-reference-video-url');
      await expect(movie).toBeVisible();
      await expect(movie).toHaveText(sampleData.movie ?? '');
    });

    test('その他ノートが表示される', async ({ page }) => {
      const note = page.getByTestId('info-flow-other-notes');
      await expect(note).toBeVisible();
      await expect(note).toHaveText(sampleData.note ?? '');
    });
  });
});
