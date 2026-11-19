import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from './cx';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { icon?: ReactNode };

/** Único botón de acción de la pantalla: vino con texto blanco. */
export function BotonPrincipal({ icon, children, className, ...rest }: Props) {
  return (
    <button
      type="button"
      {...rest}
      className={cx(
        'kj-press flex h-[52px] w-full items-center justify-center gap-2.5 rounded-xl bg-wine px-5 text-[18px] font-semibold text-white',
        'disabled:bg-rail disabled:text-faded disabled:cursor-not-allowed',
        className,
      )}
    >
      {icon}
      {children}
    </button>
  );
}

/** Botón blanco con anillo de 1 px. */
export function BotonSecundario({ icon, children, className, ...rest }: Props) {
  return (
    <button
      type="button"
      {...rest}
      className={cx(
        'kj-press inline-flex h-8 items-center justify-center gap-2 rounded-[10px] bg-paper px-3.5 text-[15px] font-medium text-ink shadow-[0_0_0_1px_rgba(29,27,24,0.14)]',
        'disabled:text-faded disabled:cursor-not-allowed',
        className,
      )}
    >
      {icon}
      {children}
    </button>
  );
}
