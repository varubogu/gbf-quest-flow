import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, DialogClose } from './dialog';

describe('Dialog', () => {
  it('open のときパネルとタイトルを表示する', () => {
    render(
      <Dialog open onClose={() => undefined}>
        <DialogBackdrop />
        <DialogPanel>
          <DialogTitle>確認</DialogTitle>
          <p>内容</p>
        </DialogPanel>
      </Dialog>
    );

    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-title')).toHaveTextContent('確認');
    expect(screen.getByText('内容')).toBeInTheDocument();
  });

  it('閉じる操作で onClose が呼ばれる', () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose}>
        <DialogPanel>
          <DialogClose label="閉じる" />
        </DialogPanel>
      </Dialog>
    );

    fireEvent.click(screen.getByLabelText('閉じる'));
    expect(onClose).toHaveBeenCalled();
  });
});
