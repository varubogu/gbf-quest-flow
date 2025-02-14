import { render, screen, cleanup } from '@testing-library/react';
import { Text } from './Text';
import { describe, it, expect, afterEach } from 'vitest';

describe('Text', () => {
  afterEach(() => {
    cleanup();
  });

  it('デフォルトのスタイルで正しくレンダリングされる', () => {
    render(<Text>テストテキスト</Text>);

    const text = screen.getByText('テストテキスト');
    expect(text).toBeDefined();
    expect(text).toHaveClass('text-foreground');
    expect(text).toHaveClass('text-sm');
    expect(text).toHaveClass('font-sans');
  });

  it('各variantで正しくレンダリングされる', () => {
    const variants = ['default', 'muted', 'dimmed'] as const;

    variants.forEach((variant, index: number) => {
      render(<Text variant={variant}>テストテキスト{index}</Text>);
      const text = screen.getByText(`テストテキスト${index}`);

      switch (variant) {
        case 'default':
          expect(text).toHaveClass('text-foreground');
          break;
        case 'muted':
          expect(text).toHaveClass('text-muted-foreground');
          break;
        case 'dimmed':
          expect(text).toHaveClass('text-muted-foreground/60');
          break;
      }
    });
  });

  it('改行が正しく処理される', () => {
    const multilineText = `1行目
2行目
3行目`;

    const { container } = render(<Text>{multilineText}</Text>);
    const text = container.querySelector('pre');
    expect(text).toHaveTextContent('1行目 2行目 3行目');
    expect(text).toHaveClass('whitespace-pre-line');
    expect(text).toHaveStyle({ 'white-space': 'pre' });
    expect(text?.classList.toString()).toContain('whitespace-pre-line');
  });

  it('カスタムクラス名が正しく適用される', () => {
    render(<Text className="custom-class">テストテキスト</Text>);

    const text = screen.getByText('テストテキスト');
    expect(text).toHaveClass('custom-class');
  });

  it('HTMLプロパティが正しく適用される', () => {
    render(
      <Text data-testid="test-text" title="テストタイトル">
        テストテキスト
      </Text>
    );

    const text = screen.getByTestId('test-text');
    expect(text).toHaveAttribute('title', 'テストタイトル');
  });
});