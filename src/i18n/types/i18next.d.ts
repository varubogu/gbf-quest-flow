import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: {
        title: string;
        description: string;
        createFlow: string;
        loadFlow: string;
        loading: string;
        // ... その他の共通翻訳キー
      };
      weapon: {
        weaponCategory: string;
        weaponName: string;
        weaponLevel: string;
        // ... その他の武器関連翻訳キー
      };
      character: {
        characterPosition: string;
        characterName: string;
        characterLevel: string;
        // ... その他のキャラクター関連翻訳キー
      };
      summon: {
        summonCategory: string;
        summonName: string;
        summonLevel: string;
        // ... その他の召喚石関連翻訳キー
      };
    };
  }
}