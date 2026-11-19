import { createStore, get, set } from 'idb-keyval'

/**
 * Schema version of the guest data. An upgrade must only add or reshape data,
 * never drop it: add a step to MIGRATIONS and bump SCHEMA_VERSION.
 */
export const SCHEMA_VERSION = 1

const MIGRATIONS: Record<number, () => Promise<void>> = {
  // 2: async () => { ...reshape in place, keep every record... },
}

// One IndexedDB database per entity (idb-keyval creates one object store per database).
export const cardsStore = createStore('kanjy-cards', 'v')
export const logsStore = createStore('kanjy-logs', 'v')
export const notesStore = createStore('kanjy-notes', 'v')
export const daysStore = createStore('kanjy-days', 'v')
export const settingsStore = createStore('kanjy-settings', 'v')
const metaStore = createStore('kanjy-meta', 'v')

let ready: Promise<void> | null = null

/** Runs pending migrations once per session. Repo functions await it. */
export function ensureReady(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      const current = (await get<number>('schemaVersion', metaStore)) ?? 0
      for (let v = current + 1; v <= SCHEMA_VERSION; v++) {
        await MIGRATIONS[v]?.()
        await set('schemaVersion', v, metaStore)
      }
    })().catch((e) => {
      ready = null
      throw e
    })
  }
  return ready
}
