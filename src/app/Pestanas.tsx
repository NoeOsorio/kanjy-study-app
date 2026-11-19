import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useLocation, useMatch, useNavigate } from 'react-router-dom';
import { todayPlan } from '../study/plan';

const Ico = ({ children }: { children: ReactNode }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {children}
  </svg>
);

/** Pestañas al borde de la libreta (solo escritorio): escribir, repasar, examen y notas. */
export default function Pestanas() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const enKanji = useMatch('/kanji/:char/*');
  const [vencidos, setVencidos] = useState(0);
  const [siguiente, setSiguiente] = useState<string | null>(null);

  useEffect(() => {
    let vivo = true;
    void todayPlan().then((p) => {
      if (!vivo) return;
      setVencidos(p.due.length);
      setSiguiente(p.newKanji[0] ?? p.due[0] ?? null);
    });
    return () => {
      vivo = false;
    };
  }, [pathname]);

  const actual = enKanji?.params.char ? decodeURIComponent(enKanji.params.char) : siguiente;
  const kanjiUrl = actual ? `/kanji/${encodeURIComponent(actual)}` : '/indice';

  const irANotas = () => {
    navigate(kanjiUrl);
    window.setTimeout(() => document.getElementById('nota')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 250);
  };

  const tabs: { id: string; titulo: string; activa: boolean; onClick: () => void; icono: ReactNode; badge?: number }[] = [
    {
      id: 'escribir',
      titulo: 'Escribir',
      activa: !!enKanji,
      onClick: () => navigate(actual ? `${kanjiUrl}/escribir` : '/indice'),
      icono: (
        <Ico>
          <path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19z" />
          <path d="M14.5 6.5l3 3" />
        </Ico>
      ),
    },
    {
      id: 'repasar',
      titulo: 'Repasar',
      activa: pathname.startsWith('/repaso'),
      onClick: () => navigate('/repaso'),
      badge: vencidos,
      icono: (
        <Ico>
          <rect x="8" y="3.5" width="12" height="15" rx="2.5" />
          <path d="M5 7.5v11a2.5 2.5 0 0 0 2.5 2.5H16" />
        </Ico>
      ),
    },
    {
      id: 'examen',
      titulo: 'Examen',
      activa: pathname.startsWith('/examen'),
      onClick: () => navigate('/examen'),
      icono: (
        <Ico>
          <rect x="5" y="3.5" width="14" height="17" rx="2.5" />
          <path d="M9 12l2 2 4-4" />
        </Ico>
      ),
    },
    {
      id: 'notas',
      titulo: 'Notas',
      activa: false,
      onClick: irANotas,
      icono: (
        <Ico>
          <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5V14l-5 6H7.5A2.5 2.5 0 0 1 5 17.5z" />
          <path d="M14 20v-4a2 2 0 0 1 2-2h3" />
        </Ico>
      ),
    },
  ];

  return (
    <nav aria-label="Atajos de la libreta" className="hidden w-[46px] shrink-0 flex-col gap-2.5 pt-[88px] lg:flex">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          title={t.titulo}
          aria-label={t.titulo}
          aria-current={t.activa ? 'page' : undefined}
          onClick={t.onClick}
          className={`kj-press relative flex h-[58px] w-[46px] items-center justify-center rounded-r-xl text-ink ${
            t.activa ? 'bg-paper shadow-[0_0_0_1px_var(--rail)]' : 'bg-tray'
          }`}
        >
          {t.icono}
          {!!t.badge && t.badge > 0 && (
            <span className="absolute -right-1 -top-2 flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-wine px-1.5 text-[12px] font-semibold text-white">
              {t.badge}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
}
