import { type Locator, expect } from '@playwright/test';

export async function expectMultiLineText(locator: Locator, expectedText: string): Promise<void> {
  const innerText = await locator.innerText();
  return await expect(innerText).toBe(expectedText);
}
