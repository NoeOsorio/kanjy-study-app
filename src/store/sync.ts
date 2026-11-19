import type { Note, ReviewCard, Settings } from './types'

export interface Changes {
  cards: ReviewCard[]
  notes: Note[]
  studyDays: string[]
  settings: Settings | null
}

export interface SyncAdapter {
  /** Sends local changes made since `since` (ISO time) to the account. */
  pushChanges(changes: Changes, since: string | null): Promise<void>
  /** Gets account changes since `since`; the caller merges with latest updatedAt wins. */
  pullChanges(since: string | null): Promise<Changes>
  /** Uploads everything saved as guest, once, when an account is created. */
  uploadGuestData(all: Changes): Promise<void>
}

const empty: Changes = { cards: [], notes: [], studyDays: [], settings: null }

/** Guest only: nothing leaves the device. */
export const localSyncAdapter: SyncAdapter = {
  async pushChanges() {},
  async pullChanges() {
    return empty
  },
  async uploadGuestData() {},
}
