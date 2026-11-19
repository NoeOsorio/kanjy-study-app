import { useCallback, useEffect, useRef, useState } from 'react';
import { todayPlan } from '../../study/plan';
import type { TodayPlan } from '../../study/plan';
import { createSession } from '../../study/session';
import type { ButtonLabels, Session, Step } from '../../study/session';
import type { Rating } from '../../store/types';
import { guardarResumen } from './resumen';
import type { Resumen } from './resumen';

export interface UseRepaso {
  loading: boolean;
  /** Nada que repasar. */
  empty: boolean;
  current: Step | null;
  labels: ButtonLabels | null;
  total: number;
  remaining: number;
  resumen: Resumen | null;
  answer: (rating: Rating) => Promise<void>;
}

/** Sesión de repaso: solo lo vencido. Los kanji nuevos se aprenden en su página. */
export function useRepaso(plan?: Pick<TodayPlan, 'due'>): UseRepaso {
  const ref = useRef<Session | null>(null);
  const shownAt = useRef(Date.now());
  const repasados = useRef<string[]>([]);
  const total = useRef(0);
  const busy = useRef(false);
  const [, setTick] = useState(0);
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(false);
  const [resumen, setResumen] = useState<Resumen | null>(null);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const p = plan ?? (await todayPlan());
      const s = await createSession({ due: p.due, newKanji: [] });
      if (!alive) return;
      total.current = p.due.length;
      ref.current = s;
      shownAt.current = Date.now();
      setEmpty(s.done());
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
    // La sesión se crea una vez por montaje.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const answer = useCallback(async (rating: Rating) => {
    const s = ref.current;
    const cur = s?.current();
    if (!s || !cur || busy.current) return;
    busy.current = true;
    try {
      await s.answer(rating, Date.now() - shownAt.current);
      if (!repasados.current.includes(cur.char)) repasados.current.push(cur.char);
      shownAt.current = Date.now();
      if (s.done()) {
        const r = { summary: await s.summary(), repasados: [...repasados.current] };
        guardarResumen(r);
        setResumen(r);
      }
      setTick((n) => n + 1);
    } finally {
      busy.current = false;
    }
  }, []);

  const s = ref.current;
  return {
    loading,
    empty,
    current: s?.current() ?? null,
    labels: s?.preview() ?? null,
    total: total.current,
    remaining: s?.remaining() ?? 0,
    resumen,
    answer,
  };
}
