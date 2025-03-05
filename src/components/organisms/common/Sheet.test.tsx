import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from './Sheet';

// モックの設定
vi.mock('react-i18next', () => ({
  useTranslation: (): { t: (_key: string) => string } => ({
    t: (key: string): string => {
      const translations: Record<string, string> = {
        close: '閉じる',
      };
      return translations[key] || key;
    },
  }),
}));

// useSheetAnimationフックをモック
let mockIsVisible = true;
vi.mock('@/core/hooks/ui/base/useSheetAnimation', () => ({
  useSheetAnimation: ({ open, side }: { open: boolean; side: 'left' | 'right' }): {
    isVisible: boolean;
    animateIn: boolean;
    overlayClasses: string;
    sheetClasses: string;
  } => {
    // openがfalseになったらisVisibleもfalseに設定
    if (!open) {
      mockIsVisible = false;
    } else {
      mockIsVisible = true;
    }

    return {
      isVisible: mockIsVisible,
      animateIn: open,
      overlayClasses: `mock-overlay-classes ${open ? 'open' : 'closed'}`,
      sheetClasses: `mock-sheet-classes ${side} ${open ? 'open' : 'closed'}`,
    };
  },
}));

describe('Sheet', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsVisible = true;
  });

  it('Sheetコンポーネントが子要素をレンダリングすること', () => {
    render(
      <Sheet>
        <div data-testid="sheet-child">シートの子要素</div>
      </Sheet>
    );

    expect(screen.getByTestId('sheet-child')).toBeInTheDocument();
    expect(screen.getByText('シートの子要素')).toBeInTheDocument();
  });

  it('SheetTriggerがクリックされるとSheetが開くこと', () => {
    render(
      <Sheet>
        <SheetTrigger asChild>
          <button>開く</button>
        </SheetTrigger>
        <SheetContent>
          <div>シートの内容</div>
        </SheetContent>
      </Sheet>
    );

    // 初期状態ではシートの内容は表示されていない
    expect(screen.queryByText('シートの内容')).not.toBeInTheDocument();

    // トリガーをクリック
    fireEvent.click(screen.getByText('開く'));

    // シートの内容が表示される
    expect(screen.getByText('シートの内容')).toBeInTheDocument();
  });

  it('SheetContentの閉じるボタンをクリックするとSheetが閉じること', () => {
    const onOpenChangeMock = vi.fn((open: boolean) => {
      // onOpenChangeが呼ばれたときにmockIsVisibleを更新
      mockIsVisible = open;
    });

    const { rerender } = render(
      <Sheet open={true} onOpenChange={onOpenChangeMock}>
        <SheetContent>
          <div>シートの内容</div>
        </SheetContent>
      </Sheet>
    );

    // 初期状態ではシートの内容が表示されている
    expect(screen.getByText('シートの内容')).toBeInTheDocument();

    // 閉じるボタンをクリック
    fireEvent.click(screen.getByText('閉じる'));

    // onOpenChangeが呼ばれる
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);

    // 親コンポーネントがopenをfalseに変更したと仮定して再レンダリング
    rerender(
      <Sheet open={false} onOpenChange={onOpenChangeMock}>
        <SheetContent>
          <div>シートの内容</div>
        </SheetContent>
      </Sheet>
    );

    // シートの内容が非表示になる
    expect(screen.queryByText('シートの内容')).not.toBeInTheDocument();
  });

  it('オーバーレイをクリックするとSheetが閉じること', () => {
    const onOpenChangeMock = vi.fn((open: boolean) => {
      // onOpenChangeが呼ばれたときにmockIsVisibleを更新
      mockIsVisible = open;
    });

    const { rerender } = render(
      <Sheet open={true} onOpenChange={onOpenChangeMock}>
        <SheetContent>
          <div>シートの内容</div>
        </SheetContent>
      </Sheet>
    );

    // 初期状態ではシートの内容が表示されている
    expect(screen.getByText('シートの内容')).toBeInTheDocument();

    // オーバーレイをクリック（mock-overlay-classesを持つ要素）
    const overlay = screen.getByText('シートの内容').parentElement?.parentElement?.previousSibling;
    fireEvent.click(overlay as Element);

    // onOpenChangeが呼ばれる
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);

    // 親コンポーネントがopenをfalseに変更したと仮定して再レンダリング
    rerender(
      <Sheet open={false} onOpenChange={onOpenChangeMock}>
        <SheetContent>
          <div>シートの内容</div>
        </SheetContent>
      </Sheet>
    );

    // シートの内容が非表示になる
    expect(screen.queryByText('シートの内容')).not.toBeInTheDocument();
  });

  it('SheetHeaderとSheetTitleが正しくレンダリングされること', () => {
    render(
      <Sheet open={true}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>シートのタイトル</SheetTitle>
          </SheetHeader>
          <div>シートの内容</div>
        </SheetContent>
      </Sheet>
    );

    // ヘッダーとタイトルが表示されている
    expect(screen.getByText('シートのタイトル')).toBeInTheDocument();
    expect(screen.getByText('シートのタイトル').tagName).toBe('H3');

    // ヘッダーのスタイルを確認
    const headerElement = screen.getByText('シートのタイトル').parentElement;
    expect(headerElement).toHaveClass('border-b');
    expect(headerElement).toHaveClass('pb-2');
    expect(headerElement).toHaveClass('mb-2');

    // タイトルのスタイルを確認
    const titleElement = screen.getByText('シートのタイトル');
    expect(titleElement).toHaveClass('text-lg');
    expect(titleElement).toHaveClass('font-bold');
  });

  it('制御されたモードでSheetが動作すること', () => {
    const handleOpenChange = vi.fn();
    const { rerender } = render(
      <Sheet open={false} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>
          <button>開く</button>
        </SheetTrigger>
        <SheetContent>
          <div>シートの内容</div>
        </SheetContent>
      </Sheet>
    );

    // 初期状態ではシートの内容は表示されていない
    expect(screen.queryByText('シートの内容')).not.toBeInTheDocument();

    // トリガーをクリック
    fireEvent.click(screen.getByText('開く'));

    // onOpenChangeが呼ばれる
    expect(handleOpenChange).toHaveBeenCalledWith(true);

    // 親コンポーネントがopenをtrueに変更したと仮定して再レンダリング
    rerender(
      <Sheet open={true} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>
          <button>開く</button>
        </SheetTrigger>
        <SheetContent>
          <div>シートの内容</div>
        </SheetContent>
      </Sheet>
    );

    // シートの内容が表示される
    expect(screen.getByText('シートの内容')).toBeInTheDocument();
  });

  it('SheetTriggerがasChildプロパティを使用して子要素の属性を拡張すること', () => {
    render(
      <Sheet>
        <SheetTrigger asChild>
          <button className="custom-button">カスタムボタン</button>
        </SheetTrigger>
      </Sheet>
    );

    const button = screen.getByText('カスタムボタン');
    expect(button).toHaveClass('custom-button');
    expect(button).toHaveAttribute('aria-expanded', 'false');

    // ボタンをクリック
    fireEvent.click(button);

    // aria-expandedがtrueに変わる
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('SheetContentがsideプロパティに基づいて適切なクラスを適用すること', () => {
    render(
      <Sheet open={true}>
        <SheetContent side="right">
          <div>右側のシート</div>
        </SheetContent>
      </Sheet>
    );

    // シートのクラスを確認
    const sheetElement = screen.getByText('右側のシート').parentElement?.parentElement;
    expect(sheetElement).toHaveClass('mock-sheet-classes');
    expect(sheetElement).toHaveClass('right');
    expect(sheetElement).toHaveClass('open');
  });
});