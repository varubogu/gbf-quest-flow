/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />
import { beforeAll, afterEach, afterAll, vi, expect } from 'vitest';
import { server } from '../mocks/server';
import * as matchers from '@testing-library/jest-dom/matchers';
import { act } from '@testing-library/react';

expect.extend(matchers);

// MSWのセットアップ
beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  // Zustandのストアの更新を同期的に処理
  vi.runAllTimers();
});
afterAll(() => server.close());

// matchMediaのモック
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Zustandの状態更新を同期的に処理するためのセットアップ
beforeAll(() => {
  vi.useFakeTimers();
});

afterAll(() => {
  vi.useRealTimers();
});