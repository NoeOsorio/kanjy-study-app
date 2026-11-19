// Speech with the browser's built-in voice (ja-JP). No audio files, works offline on phones.
// Pages must pass kana (reading), never kanji: a kanji string is not spoken.
import { useEffect, useState } from 'react'
import { getSettings } from '../store/repo'
import type { Token } from '../data/types'

const KANJI = /[㐀-䶿一-鿿豈-﫿]/
const PREFERRED = ['kyoko', 'o-ren', 'oren', 'google 日本語', 'haruka', 'ichiro']

let voice: SpeechSynthesisVoice | null = null
let soundOn = true
let warned = false
let started = false
const listeners = new Set<() => void>()
const settingListeners = new Set<() => void>()

const synth = (): SpeechSynthesis | null =>
  typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null

function pickVoice(): void {
  const s = synth()
  if (!s) return
  const ja = s.getVoices().filter((v) => v.lang.replace('_', '-').toLowerCase().startsWith('ja'))
  const score = (v: SpeechSynthesisVoice) => {
    const n = v.name.toLowerCase()
    const i = PREFERRED.findIndex((p) => n.includes(p))
    return (i >= 0 ? 100 - i : 0) + (v.localService ? 10 : 0) + (v.default ? 5 : 0)
  }
  const best = ja.sort((a, b) => score(b) - score(a))[0] ?? null
  if (best !== voice) {
    voice = best
    listeners.forEach((l) => l())
  }
}

function refreshSettings(): void {
  getSettings()
    .then((s) => {
      if (s.sound !== soundOn) {
        soundOn = s.sound
        listeners.forEach((l) => l())
      }
    })
    .catch(() => {})
}

function start(): void {
  if (started) return
  started = true
  const s = synth()
  if (s) {
    pickVoice()
    s.addEventListener?.('voiceschanged', pickVoice)
    // Some browsers fill the list late without firing the event.
    setTimeout(pickVoice, 500)
    setTimeout(pickVoice, 2000)
  }
  settingListeners.add(refreshSettings)
  refreshSettings()
}

/** Call after saving Settings.sound so buttons appear or disappear. */
export function notifySoundSettingChanged(): void {
  settingListeners.forEach((l) => l())
}

/** Subscribe to sound setting changes. Returns an unsubscribe function. */
export function onSoundSettingChanged(cb: () => void): () => void {
  settingListeners.add(cb)
  return () => settingListeners.delete(cb)
}

export function canSpeak(): boolean {
  start()
  return soundOn && voice !== null
}

export function useCanSpeak(): boolean {
  const [, tick] = useState(0)
  useEffect(() => {
    start()
    const l = () => tick((n) => n + 1)
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  }, [])
  return canSpeak()
}

/** Must be called from a user gesture (tap/click): iOS and Android block speech otherwise. Pass kana. */
export function speak(text: string): void {
  const s = synth()
  const t = text.trim()
  if (!s || !t || !soundOn) return
  if (KANJI.test(t)) {
    if (!warned) {
      warned = true
      console.warn('speak(): text contains kanji; pass kana instead.')
    }
    return
  }
  s.cancel()
  const u = new SpeechSynthesisUtterance(t)
  u.lang = 'ja-JP'
  u.rate = 0.9
  if (voice) u.voice = voice
  s.speak(u)
}

/** Speak a sentence from its tokens, using each token's reading when it has one. Same gesture rule as speak. */
export function speakSentence(tokens: Pick<Token, 'text' | 'reading'>[]): void {
  speak(tokens.map((t) => t.reading ?? t.text).join(''))
}

if (typeof window !== 'undefined') {
  window.addEventListener('kanjy-settings', () => notifySoundSettingChanged())
}
