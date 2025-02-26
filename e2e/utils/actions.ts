import type { Page } from "@playwright/test";



export const actions = {
    main: {
        open: async (page: Page): Promise<void> => {
            await page.goto('/');
        },
    },
    sidemenu: {
        open: async (page: Page): Promise<void> => {
            await page.locator('#sidemenu-button').click();
        },
        close: async (page: Page): Promise<void> => {
            await page.locator('#sidemenu-button').click();
        },
    },
    option: {
        open: async (page: Page): Promise<void> => {
            await page.locator('#option-button').click();
        },
        close: async (page: Page): Promise<void> => {
            await page.locator('#option-button').click();
        },
    },
    organization: {
        open: async (page: Page): Promise<void> => {
            await page.locator('#organization-button').click();
        },
        close: async (page: Page): Promise<void> => {
            await page.locator('#organization-button').click();
        },
    },
    info: {
        open: async (page: Page): Promise<void> => {
            await page.locator('#info-button').click();
        },
        close: async (page: Page): Promise<void> => {
            await page.locator('#info-button').click();
        },
    },
};