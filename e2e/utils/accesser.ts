import { type Page, type Locator } from '@playwright/test';




export const mainPage = {
  titleLabel: async (page: Page): Promise<Locator> => page.locator('#flow-title-label'),
  titleInput: async (page: Page): Promise<Locator> => page.locator('#flow-title-input'),
  memoLabel: async (page: Page): Promise<Locator> => page.locator('#flow-memo-label'),
  memoInput: async (page: Page): Promise<Locator> => page.locator('#flow-memo-input'),
  actionTable: async (page: Page): Promise<Locator> => page.locator('#action-table'),
}

// メイン画面の行動表
export const actionTable = {
  header: async (locator: Locator, index: number = -1, key: string = ''): Promise<Locator> => {
    if (index !== -1) {
      return locator.locator(`#action-table-header:nth-child(${index})`);
  }
  if (key !== '') {
    return locator.locator(`#action-table-header:has-text("${key}")`);
  }
    return locator.locator('#action-table-header');
  },
  body: async (locator: Locator): Promise<Locator> => locator.locator('#action-table-body'),
  row: async (locator: Locator, rowIndex: number = -1): Promise<Locator> => {
    if (rowIndex !== -1) {
      return locator.locator(`#action-table-row:nth-child(${rowIndex})`);
    }
    return locator.locator('#action-table-row');
  },

  cell: async (locator: Locator, rowIndex: number = -1, cellIndex: number = -1): Promise<Locator> => {
    if (rowIndex !== -1) {
      return locator.locator(`#action-table-row:nth-child(${rowIndex}) td:nth-child(${cellIndex})`);
    }
    return locator.locator(`#action-table-row td:nth-child(${cellIndex})`);
  },

  column: async (locator: Locator, columnIndex: number = -1): Promise<Locator> => {
    if (columnIndex !== -1) {
      return locator.locator(`#action-table-column:nth-child(${columnIndex})`);
    }
    return locator.locator('#action-table-column');
  },

}





// 編成画面
export const organizationPage = {
  jobs: {
    job: {
      name: async (locator: Locator): Promise<Locator> => locator.locator('#organization-job-name'),
      description: async (locator: Locator): Promise<Locator> => locator.locator('#organization-job-description'),
    },
    specialWeapon: {
      name: async (locator: Locator): Promise<Locator> => locator.locator('#organization-special-weapon-name'),
      description: async (locator: Locator): Promise<Locator> => locator.locator('#organization-special-weapon-description'),
    },
    ability: {
      name: async (locator: Locator, index: number = -1): Promise<Locator> => {
        if (index !== -1) {
          return locator.locator(`#organization-ability-name:nth-child(${index})`);
        }
        return locator.locator('#organization-ability-name');
      },
      description: async (locator: Locator, index: number = -1): Promise<Locator> => {
        if (index !== -1) {
          return locator.locator(`#organization-ability-description:nth-child(${index})`);
        }
        return locator.locator('#organization-ability-description');
      },
    },
  },
  character: {
    front: {
      name: async (locator: Locator, index: number = -1): Promise<Locator> => {
        if (index !== -1) {
          return locator.locator(`#organization-character-front-name:nth-child(${index})`);
        }
        return locator.locator('#organization-character-front-name');
      },
      description: async (locator: Locator, index: number = -1): Promise<Locator> => {
        if (index !== -1) {
          return locator.locator(`#organization-character-front-description:nth-child(${index})`);
        }
        return locator.locator('#organization-character-front-description');
      },
      awake: async (locator: Locator, index: number = -1): Promise<Locator> => {
        if (index !== -1) {
          return locator.locator(`#organization-character-front-awake:nth-child(${index})`);
        }
        return locator.locator('#organization-character-front-awake');
      },
      accessory: async (locator: Locator, index: number = -1): Promise<Locator> => {
        if (index !== -1) {
          return locator.locator(`#organization-character-front-accessory:nth-child(${index})`);
        }
        return locator.locator('#organization-character-front-accessory');
      },
      limitBonus: async (page: Page, index: number = -1): Promise<Locator> => {
        if (index !== -1) {
          return page.locator(`#organization-character-front-limit-bonus:nth-child(${index})`);
        }
        return page.locator('#organization-character-front-limit-bonus');
      },
    },
    back: {
      name: async (locator: Locator, index: number = -1): Promise<Locator> => {
        if (index !== -1) {
          return locator.locator(`#organization-character-back-name:nth-child(${index})`);
        }
        return locator.locator('#organization-character-back-name');
      },
      description: async (locator: Locator, index: number = -1): Promise<Locator> => {
        if (index !== -1) {
          return locator.locator(`#organization-character-back-description:nth-child(${index})`);
        }
        return locator.locator('#organization-character-back-description');
      },
      awake: async (locator: Locator, index: number = -1): Promise<Locator> => {
        if (index !== -1) {
          return locator.locator(`#organization-character-back-awake:nth-child(${index})`);
        }
        return locator.locator('#organization-character-back-awake');
      },
      accessory: async (locator: Locator, index: number = -1): Promise<Locator> => {
        if (index !== -1) {
          return locator.locator(`#organization-character-back-accessory:nth-child(${index})`);
        }
        return locator.locator('#organization-character-back-accessory');
      },
      limitBonus: async (locator: Locator, index: number = -1): Promise<Locator> => {
        if (index !== -1) {
          return locator.locator(`#organization-character-back-limit-bonus:nth-child(${index})`);
        }
        return locator.locator('#organization-character-back-limit-bonus');
      },
    },
  },
  weapon: {
    main: {
      name: async (locator: Locator): Promise<Locator> => locator.locator('#organization-weapon-main-name'),
      additionalSkill: async (locator: Locator): Promise<Locator> => locator.locator('#organization-weapon-main-additional-skill'),
      description: async (locator: Locator): Promise<Locator> => locator.locator('#organization-weapon-main-description'),
    },
    other: {
      name: async (locator: Locator, index: number = -1): Promise<Locator> => {
        if (index !== -1) {
          return locator.locator(`#organization-weapon-other-name:nth-child(${index})`);
        }
        return locator.locator('#organization-weapon-other-name');
      },
      additionalSkill: async (locator: Locator, index: number = -1): Promise<Locator> => {
        if (index !== -1) {
          return locator.locator(`#organization-weapon-other-additional-skill:nth-child(${index})`);
        }
        return locator.locator('#organization-weapon-other-additional-skill');
      },
      description: async (locator: Locator, index: number = -1): Promise<Locator> => {
        if (index !== -1) {
          return locator.locator(`#organization-weapon-other-description:nth-child(${index})`);
        }
        return locator.locator('#organization-weapon-other-description');
      },
    },
    additional: {
      name: async (locator: Locator, index: number = -1): Promise<Locator> => {
        if (index !== -1) {
          return locator.locator(`#organization-weapon-additional-name:nth-child(${index})`);
        }
        return locator.locator('#organization-weapon-additional-name');
      },
      additionalSkill: async (locator: Locator, index: number = -1): Promise<Locator> => {
        if (index !== -1) {
          return locator.locator(`#organization-weapon-additional-additional-skill:nth-child(${index})`);
        }
        return locator.locator('#organization-weapon-additional-additional-skill');
      },
      description: async (locator: Locator, index: number = -1): Promise<Locator> => {
        if (index !== -1) {
          return locator.locator(`#organization-weapon-additional-description:nth-child(${index})`);
        }
        return locator.locator('#organization-weapon-additional-description');
      },
    },
  },
  weaponSkill: {
    name: async (locator: Locator, index: number = -1): Promise<Locator> => {
      if (index !== -1) {
        return locator.locator(`#organization-weapon-skill-name:nth-child(${index})`);
      }
      return locator.locator('#organization-weapon-skill-name');
    },
    value: async (locator: Locator, index: number = -1): Promise<Locator> => {
      if (index !== -1) {
        return locator.locator(`#organization-weapon-skill-value:nth-child(${index})`);
      }
      return locator.locator('#organization-weapon-skill-value');
    },
    description: async (locator: Locator, index: number = -1): Promise<Locator> => {
      if (index !== -1) {
        return locator.locator(`#organization-weapon-skill-description:nth-child(${index})`);
      }
      return locator.locator('#organization-weapon-skill-description');
    },
  },
  summon: {
    main: {
      name: async (locator: Locator): Promise<Locator> => locator.locator('#organization-summon-main-name'),
      description: async (locator: Locator): Promise<Locator> => locator.locator('#organization-summon-main-description'),
    },
    friend: {
      name: async (locator: Locator): Promise<Locator> => locator.locator('#organization-summon-friend-name'),
      description: async (locator: Locator): Promise<Locator> => locator.locator('#organization-summon-friend-description'),
    },
    other: {
      name: async (locator: Locator, index: number = -1): Promise<Locator> => {
        if (index !== -1) {
          return locator.locator(`#organization-summon-other-name:nth-child(${index})`);
        }
        return locator.locator('#organization-summon-other-name');
      },
      description: async (locator: Locator, index: number = -1): Promise<Locator> => {
        if (index !== -1) {
          return locator.locator(`#organization-summon-other-description:nth-child(${index})`);
        }
        return locator.locator('#organization-summon-other-description');
      },
    },
    sub: {
      name: async (locator: Locator, index: number = -1): Promise<Locator> => {
        if (index !== -1) {
          return locator.locator(`#organization-summon-sub-name:nth-child(${index})`);
        }
        return locator.locator('#organization-summon-sub-name');
      },
      description: async (locator: Locator, index: number = -1): Promise<Locator> => {
        if (index !== -1) {
          return locator.locator(`#organization-summon-sub-description:nth-child(${index})`);
        }
        return locator.locator('#organization-summon-sub-description');
      },
    },
  },
  skillSummary: {
    name: async (locator: Locator, index: number = -1): Promise<Locator> => {
      if (index !== -1) {
        return locator.locator(`#organization-weapon-skill-name:nth-child(${index})`);
      }
      return locator.locator('#organization-weapon-skill-name');
    },
    value: async (locator: Locator, index: number = -1): Promise<Locator> => {
      if (index !== -1) {
        return locator.locator(`#organization-weapon-skill-value:nth-child(${index})`);
      }
      return locator.locator('#organization-weapon-skill-value');
    },
    description: async (locator: Locator, index: number = -1): Promise<Locator> => {
      if (index !== -1) {
        return locator.locator(`#organization-weapon-skill-description:nth-child(${index})`);
      }
      return locator.locator('#organization-weapon-skill-description');
    },
  },


}



// その他情報画面
export const otherInfoPage = {
  title: async (locator: Locator): Promise<Locator> => locator.locator('#other-info-title'),
  quest: async (locator: Locator): Promise<Locator> => locator.locator('#other-info-quest'),
  author: async (locator: Locator): Promise<Locator> => locator.locator('#other-info-author'),
  description: async (locator: Locator): Promise<Locator> => locator.locator('#other-info-description'),
  updateDate: async (locator: Locator): Promise<Locator> => locator.locator('#other-info-update-date'),
  video: async (locator: Locator): Promise<Locator> => locator.locator('#other-info-video'),
  memo: async (locator: Locator): Promise<Locator> => locator.locator('#other-info-memo'),
}


// サイドメニュー
export const sideMenu = {
  menu: async (locator: Locator): Promise<Locator> => locator.locator('#side-menu'),
  newDataButton: async (locator: Locator): Promise<Locator> => locator.locator('#side-menu-new-data-button'),
  loadDataButton: async (locator: Locator): Promise<Locator> => locator.locator('#side-menu-load-data-button'),
  downloadDataButton: async (locator: Locator): Promise<Locator> => locator.locator('#side-menu-download-data-button'),
  editButton: async (locator: Locator): Promise<Locator> => locator.locator('#side-menu-edit-button'),
  optionButton: async (locator: Locator): Promise<Locator> => locator.locator('#side-menu-option-button'),
  documentButton: async (locator: Locator): Promise<Locator> => locator.locator('#side-menu-document-button'),
}

// オプション
export const option = {
  language: async (locator: Locator): Promise<Locator> => locator.locator('#option-language'),
  buttonPosition: async (locator: Locator): Promise<Locator> => locator.locator('#option-button-position'),
  space: async (locator: Locator): Promise<Locator> => locator.locator('#option-space'),
  clickType: async (locator: Locator): Promise<Locator> => locator.locator('#option-click-type'),
}







