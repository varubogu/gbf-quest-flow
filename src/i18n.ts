import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'ja',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      ja: {
        translation: {
          // 共通
          title: 'グラブル行動表',
          description: 'グラブルの行動表を管理・共有するためのツール',
          createFlow: '行動表を作成',
          loadFlow: '行動表を読み込む',
          loading: '読み込み中...',
          noDataLoaded: 'データが読み込まれていません',
          toggleMemo: 'メモを開閉します',
          memo: 'メモ開閉',
          organization: '編成確認',
          otherInfo: 'その他の情報',
          save: '保存',
          edit: '編集',
          cancel: 'キャンセル',
          delete: '削除',
          confirm: '確認',
          close: '閉じる',
          overview: '解説',
          errorOccurred: 'エラーが発生しました',
          errorMessage: 'エラーメッセージ',
          unknownError: '不明なエラーが発生しました',
          downloadBackup: '現在のデータをバックアップとしてダウンロード',
          dataNotFound: 'データが見つかりません',

          // メニュー関連
          menu: 'メニュー',
          options: 'オプション',
          newData: '新しいデータを作る',
          loadData: 'データ読み込み',
          downloadData: 'データダウンロード',
          downloadOriginalData: '編集前のデータをダウンロード',
          cancelEdit: '編集をキャンセル',
          help: '説明書',
          back: '戻る',

          // 設定関連
          language: '言語',
          japanese: '日本語',
          english: 'English',
          buttonAlignment: '上下ボタンの配置',
          left: '左',
          right: '右',
          tablePadding: '行動表の余白',
          actionTableClickType: '行動表選択方法',
          singleClick: 'シングルクリック',
          doubleClick: 'ダブルクリック',

          // 確認メッセージ
          confirmDiscardChanges: '編集内容を破棄してよろしいですか？',
          noDataToDownload: 'ダウンロードするデータがありません。',
          showHelp: '説明書を表示します。',
          loadingFile: '読み込み中...',
          failedToLoadFile: 'ファイルの読み込みに失敗しました:',

          // InfoModal関連
          infoModalTitle: 'その他の情報',
          flowTitle: 'タイトル',
          quest: 'クエスト',
          author: '作成者',
          updateDate: '更新日時',
          referenceVideoUrl: '参考動画URL',
          otherNotes: 'その他ノート',

          // OrganizationModal関連
          jobAndCharacters: 'ジョブ、キャラ、アビリティ',
          weapons: '武器',
          summons: '召喚石',
          video: '動画',
          skillTotals: 'スキル総合値',
          job: 'ジョブ',
          characters: 'キャラクター',
          skill: 'スキル',
          effectAmount: '効果量',
          taRate: 'TA確率',
          hp: 'HP',
          defense: '防御',

          // ActionTable関連
          moveUp: '上に移動',
          moveDown: '下に移動',
          hpColumn: 'HP',
          triggerColumn: '予兆',
          ougiColumn: '奥義',
          guardColumn: 'ガード',
          actionColumn: '行動',
          notesColumn: '備考',

          // ジョブ関連
          jobItem: '項目',
          jobValue: '名前',
          jobClass: 'ジョブ',
          jobLevel: 'レベル',
          jobArk: 'アーク',
          jobMainHand: '特殊装備',
          jobRing1: 'リング1',
          jobRing2: 'リング2',
          characterAbilities: 'アビリティ',

          // キャラクター関連
          characterPosition: 'ポジション',
          characterName: 'キャラ',
          characterLevel: 'レベル',
          characterRing1: 'リング1',
          characterRing2: 'リング2',
          characterEarring: 'イヤリング',
          characterUsage: '用途',
          characterAwakening: '覚醒',
          characterAccessories: '指輪・耳飾り',
          characterLimitBonus: 'LB',
          characterFront: 'フロント',
          characterBack: 'サブ',

          // 武器関連
          weaponCategory: 'カテゴリ',
          weaponName: '武器名',
          weaponLevel: 'レベル',
          weaponPlus: '+値',
          weaponSkillLevel1: 'スキルLv1',
          weaponSkillLevel2: 'スキルLv2',
          weaponAx: 'AX',
          weaponTranscendence: '上限解放',
          weaponAwakening: '覚醒',
          weaponAdditionalSkill: '追加スキル',
          weaponMain: 'メイン',
          weaponNormal: '通常武器',
          weaponAdditional: '追加武器',
          skillEffects: 'スキル効果量',
          totalAmount: 'スキル総量',

          // 召喚石関連
          summonCategory: 'カテゴリ',
          summonName: '召喚石名',
          summonLevel: 'レベル',
          summonPlus: '+値',
          summonTranscendence: '上限解放',
          summonSubAura: 'サブ加護',
          summonMain: 'メイン',
          summonFriend: 'フレンド',
          summonNormal: '通常石',
          summonSub: 'サブ',

          // エラーメッセージ
          pasteError: {
            specific: '貼り付け処理中にエラーが発生しました: {{message}}',
            generic: '貼り付け処理中に予期せぬエラーが発生しました'
          },
          validationError: '入力エラー: {{message}}',
          noValidRows: '有効な行が見つかりません',
          tooManyColumns: '貼り付ける列数が多すぎます',
        },
      },
      en: {
        translation: {
          // Common
          title: 'GBF Quest Flow',
          description: 'A tool to manage and share quest flows for Granblue Fantasy',
          createFlow: 'Create Flow',
          loadFlow: 'Load Flow',
          loading: 'Loading...',
          noDataLoaded: 'No data loaded',
          toggleMemo: 'Toggle memo',
          memo: 'Memo',
          organization: 'Organization',
          otherInfo: 'Other Info',
          save: 'Save',
          edit: 'Edit',
          cancel: 'Cancel',
          delete: 'Delete',
          confirm: 'Confirm',
          close: 'Close',
          overview: 'Overview',
          errorOccurred: 'An Error Occurred',
          errorMessage: 'Error Message',
          unknownError: 'An unknown error occurred',
          downloadBackup: 'Download Current Data as Backup',
          dataNotFound: 'Data not found',

          // Menu related
          menu: 'Menu',
          options: 'Options',
          newData: 'Create New Data',
          loadData: 'Load Data',
          downloadData: 'Download Data',
          downloadOriginalData: 'Download Original Data',
          cancelEdit: 'Cancel Edit',
          help: 'Help',
          back: 'Back',

          // Settings related
          language: 'Language',
          japanese: '日本語',
          english: 'English',
          buttonAlignment: 'Button Alignment',
          left: 'Left',
          right: 'Right',
          tablePadding: 'Table Padding',
          actionTableClickType: 'Action Table Selection',
          singleClick: 'Single Click',
          doubleClick: 'Double Click',

          // Confirmation messages
          confirmDiscardChanges: 'Are you sure you want to discard your changes?',
          noDataToDownload: 'No data available to download.',
          showHelp: 'Showing help documentation.',
          loadingFile: 'Loading...',
          failedToLoadFile: 'Failed to load file:',

          // InfoModal related
          infoModalTitle: 'Other Information',
          flowTitle: 'Title',
          quest: 'Quest',
          author: 'Author',
          updateDate: 'Update Date',
          referenceVideoUrl: 'Reference Video URL',
          otherNotes: 'Other Notes',

          // OrganizationModal related
          jobAndCharacters: 'Job, Characters & Abilities',
          weapons: 'Weapons',
          summons: 'Summons',
          video: 'Video',
          skillTotals: 'Skill Totals',
          job: 'Job',
          characters: 'Characters',
          skill: 'Skill',
          effectAmount: 'Effect Amount',
          taRate: 'Triple Attack Rate',
          hp: 'HP',
          defense: 'Defense',

          // ActionTable related
          moveUp: 'Move Up',
          moveDown: 'Move Down',
          hpColumn: 'HP',
          triggerColumn: 'Trigger',
          ougiColumn: 'Ougi',
          guardColumn: 'Guard',
          actionColumn: 'Action',
          notesColumn: 'Notes',

          // Job related
          jobItem: 'Item',
          jobValue: 'Name',
          jobClass: 'Job',
          jobLevel: 'Level',
          jobArk: 'Ark',
          jobMainHand: 'Main Hand',
          jobRing1: 'Ring 1',
          jobRing2: 'Ring 2',
          characterAbilities: 'Abilities',

          // Character related
          characterPosition: 'Position',
          characterName: 'Character',
          characterLevel: 'Level',
          characterRing1: 'Ring 1',
          characterRing2: 'Ring 2',
          characterEarring: 'Earring',
          characterUsage: 'Usage',
          characterAwakening: 'Awakening',
          characterAccessories: 'Rings & Earrings',
          characterLimitBonus: 'Limit Bonus',
          characterFront: 'Front',
          characterBack: 'Sub',

          // Weapon related
          weaponCategory: 'Category',
          weaponName: 'Weapon',
          weaponLevel: 'Level',
          weaponPlus: 'Plus',
          weaponSkillLevel1: 'Skill Lv1',
          weaponSkillLevel2: 'Skill Lv2',
          weaponAx: 'AX',
          weaponTranscendence: 'Transcendence',
          weaponAwakening: 'Awakening',
          weaponAdditionalSkill: 'Additional Skills',
          weaponMain: 'Main',
          weaponNormal: 'Normal',
          weaponAdditional: 'Additional',
          skillEffects: 'Skill Effects',
          totalAmount: 'Total Amount',
          // Summon related
          summonCategory: 'Category',
          summonName: 'Summon',
          summonLevel: 'Level',
          summonPlus: 'Plus',
          summonTranscendence: 'Transcendence',
          summonSubAura: 'Sub Aura',
          summonMain: 'Main',
          summonFriend: 'Friend',
          summonNormal: 'Normal',
          summonSub: 'Sub',

          // Error messages
          pasteError: {
            specific: 'Error occurred while pasting: {{message}}',
            generic: 'An unexpected error occurred while pasting'
          },
          validationError: 'Input Error: {{message}}',
          noValidRows: 'No valid rows found in clipboard',
          tooManyColumns: 'Too many columns to paste',
        },
      },
    },
  });

export default i18n;
