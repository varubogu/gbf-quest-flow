/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />
import { beforeAll, beforeEach, afterEach, afterAll, vi, expect } from 'vitest';
import { server } from './mocks/server';
import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';

expect.extend(matchers);



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
const scrollToMock = vi.fn().mockImplementation((x?: number, y?: number) => {
  // スクロール位置を記録（必要に応じて）
  document.documentElement.scrollTop = y || 0;
  document.documentElement.scrollLeft = x || 0;
  // スクロールイベントをディスパッチ
  window.dispatchEvent(new Event('scroll'));
});

Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: scrollToMock,
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


// コンソールエラーの抑制設定
const originalConsoleError = console.error;
beforeAll(() => {
  vi.useRealTimers();

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
  return server.listen({ onUnhandledRequest: 'error' });
});

beforeEach(() => {
  // タイマーをvitestのタイマーにモック
  vi.useFakeTimers();

  // vitestでjestタイマーに依存する処理を実行可能にする
  // Zustandの状態更新、ユーザーイベント、非同期関数などを処理するためのセットアップ
  // ただし、一度に実行するとテストエラーになるものがある。

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalThis.jest = {
    advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
  }
});

// MSWのセットアップ
afterEach(() => {
  server.resetHandlers();
  cleanup(); // React Testing Libraryのクリーンアップ
  // Zustandのストアの更新を同期的に処理
  vi.runAllTimers();
});

afterAll(() => {
  vi.useRealTimers();
  console.error = originalConsoleError;
  return server.close();
});