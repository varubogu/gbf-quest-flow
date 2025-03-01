/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />
import { beforeAll, afterEach, afterAll, vi, expect } from 'vitest';
import { server } from './mocks/server';
import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';

expect.extend(matchers);

// コンソールエラーの抑制設定
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]): void => {
    const firstArg = args[0];
    if (
      typeof firstArg === 'string' &&
      firstArg.includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalConsoleError(...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
});

// MSWのセットアップ
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  cleanup(); // React Testing Libraryのクリーンアップ
  // Zustandのストアの更新を同期的に処理
  vi.runAllTimers();
});
afterAll(() => server.close());

// matchMediaのモック
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
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

// window.scrollToのモック
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
});

// Zustandの状態更新を同期的に処理するためのセットアップ
beforeAll(() => {
  vi.useFakeTimers();
});

afterAll(() => {
  vi.useRealTimers();
});

// IntersectionObserverのモック
class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// ResizeObserverのモック
class MockResizeObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
});
