import { lastSevenDays } from '../store/repo'

export interface Sticker {
  label: string
  studied: boolean
}

const LETTERS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'] // Date.getDay(): 0 = Sunday

/** Seven entries, oldest first; the last one is labelled «Hoy». */
export async function weekStickers(today: Date = new Date()): Promise<Sticker[]> {
  const days = await lastSevenDays(today)
  return days.map((d, i) => {
    const [y, m, day] = d.date.split('-').map(Number)
    const label = i === days.length - 1 ? 'Hoy' : LETTERS[new Date(y, m - 1, day).getDay()]
    return { label, studied: d.studied }
  })
}
