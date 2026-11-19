import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getKanji } from '../../data/levels';
import type { Kanji } from '../../data/types';
import { Pagina } from '../../app/Pagina';
import NotFound from '../../app/NotFound';

export default function KanjiPage() {
  const { char = '' } = useParams();
  const [state, setState] = useState<{ char: string; kanji: Kanji | null } | null>(null);

  useEffect(() => {
    let alive = true;
    getKanji(char).then((kanji) => alive && setState({ char, kanji }));
    return () => {
      alive = false;
    };
  }, [char]);

  if (!state || state.char !== char) return <Pagina title="" />;
  if (!state.kanji) return <NotFound />;
  const k = state.kanji;
  return (
    <Pagina title={k.meanings[0] ?? ''}>
      <p className="mt-4 font-kanji text-[96px] leading-none text-ink">{k.char}</p>
      <p className="mt-3 text-[15px] text-ink-3">{k.level}</p>
    </Pagina>
  );
}
