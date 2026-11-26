import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    // resources.ja.translation は無い。i18next 27 は欠落した辞書型を辿ると
    // t() のキー型が壊れるので、辞書型は付けない。
  }
}
