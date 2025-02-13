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
          // 日本語の翻訳
          title: 'グラブル周回補助ツール',
          createFlow: 'フローを作成',
          loadFlow: 'フローを読み込む',
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
          overview: '概要',
          updateDate: '更新日時',
          referenceVideoUrl: '参考動画URL',
          otherNotes: 'その他ノート'
        },
      },
      en: {
        translation: {
          // 英語の翻訳
          title: 'GBF Quest Flow Helper',
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
          overview: 'Overview',
          updateDate: 'Update Date',
          referenceVideoUrl: 'Reference Video URL',
          otherNotes: 'Other Notes'
        },
      },
    },
  });

export default i18n;