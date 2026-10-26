import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useFocusTrap } from './useFocusTrap';

function Harness({ onEscape, withAutofocus = false }) {
  const ref = useFocusTrap(onEscape);

  return (
    <div ref={ref} role="dialog" aria-label="Uji">
      <button type="button">Pertama</button>
      <input aria-label="Isian" data-autofocus={withAutofocus ? '' : undefined} />
      <button type="button">Terakhir</button>
    </div>
  );
}

function Wrapper({ open, onEscape, withAutofocus }) {
  return (
    <>
      <button type="button">Pemicu</button>
      {open && <Harness onEscape={onEscape} withAutofocus={withAutofocus} />}
    </>
  );
}

describe('useFocusTrap', () => {
  it('memfokuskan elemen fokus pertama bila tidak ada data-autofocus', () => {
    render(<Wrapper open onEscape={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Pertama' })).toHaveFocus();
  });

  it('memfokuskan elemen data-autofocus bila tersedia', () => {
    render(<Wrapper open onEscape={vi.fn()} withAutofocus />);

    expect(screen.getByLabelText('Isian')).toHaveFocus();
  });

  it('memutar fokus dengan Tab dan Shift+Tab di dalam dialog', async () => {
    const user = userEvent.setup();
    render(<Wrapper open onEscape={vi.fn()} />);

    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Terakhir' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: 'Pertama' })).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText('Isian')).toHaveFocus();
  });

  it('memanggil onEscape saat Escape ditekan dan mengabaikan tombol lain', async () => {
    const user = userEvent.setup();
    const onEscape = vi.fn();
    render(<Wrapper open onEscape={onEscape} />);

    await user.keyboard('a');
    expect(onEscape).not.toHaveBeenCalled();

    await user.keyboard('{Escape}');
    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  it('mengembalikan fokus ke pemicu saat dialog ditutup', () => {
    const { rerender } = render(<Wrapper open={false} onEscape={vi.fn()} />);
    const trigger = screen.getByRole('button', { name: 'Pemicu' });
    trigger.focus();

    rerender(<Wrapper open onEscape={vi.fn()} />);
    expect(trigger).not.toHaveFocus();

    rerender(<Wrapper open={false} onEscape={vi.fn()} />);
    expect(trigger).toHaveFocus();
  });
});
