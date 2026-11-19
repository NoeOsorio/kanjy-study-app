import { useCallback, useEffect, useRef, useState } from 'react'
import { todayPlan } from './plan'
import { createSession } from './session'
import type { ButtonLabels, Session, Step, Summary } from './session'
import type { Rating } from '../store/types'

export interface UseSession {
  loading: boolean
  current: Step | null
  labels: ButtonLabels | null
  done: boolean
  remaining: number
  summary: Summary | null
  answer: (rating: Rating) => Promise<void>
}

/** Runs today's session for a page. Elapsed time is measured from when each card appears. */
export function useSession(): UseSession {
  const ref = useRef<Session | null>(null)
  const shownAt = useRef(Date.now())
  const [, setTick] = useState(0)
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<Summary | null>(null)

  useEffect(() => {
    let alive = true
    void (async () => {
      const s = await createSession(await todayPlan())
      if (!alive) return
      ref.current = s
      shownAt.current = Date.now()
      setLoading(false)
    })()
    return () => {
      alive = false
    }
  }, [])

  const answer = useCallback(async (rating: Rating) => {
    const s = ref.current
    if (!s) return
    await s.answer(rating, Date.now() - shownAt.current)
    shownAt.current = Date.now()
    if (s.done()) setSummary(await s.summary())
    setTick((n) => n + 1)
  }, [])

  const s = ref.current
  return {
    loading,
    current: s?.current() ?? null,
    labels: s?.preview() ?? null,
    done: s?.done() ?? false,
    remaining: s?.remaining() ?? 0,
    summary,
    answer,
  }
}
