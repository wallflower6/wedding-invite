// ============================================================
// Storage adapter
// ============================================================
// This app is a static site (it can be hosted entirely on GitHub
// Pages, with no server). By default it persists RSVPs to the
// browser's localStorage.
//
// IMPORTANT LIMITATION: localStorage is per-browser, per-device.
// If your guest submits their RSVP on their phone, it will NOT be
// visible in the "Couple / host view" on your laptop. It's fine for
// local development and testing, but for a real wedding you'll want
// every guest's RSVP to land in one shared place you can see from
// anywhere.
//
// To get that, swap this file's implementation for a small managed
// database instead of localStorage — the rest of the app only calls
// get / set / list below, so nothing else needs to change. Good free
// options that work great with a static GitHub Pages site:
//   - Firebase Firestore (google, generous free tier)
//   - Supabase (postgres-based, generous free tier)
//   - Google Sheets + a form endpoint (simplest, less flexible)
//
// The README has a short walkthrough for wiring up Firebase.
// ============================================================

const PREFIX = 'wedding-invite:'

function fullKey(key) {
  return PREFIX + key
}

export async function storageGet(key) {
  try {
    const raw = window.localStorage.getItem(fullKey(key))
    if (raw === null) return null
    return { key, value: raw }
  } catch (err) {
    console.error('storage get failed', err)
    return null
  }
}

export async function storageSet(key, value) {
  try {
    window.localStorage.setItem(fullKey(key), value)
    return { key, value }
  } catch (err) {
    console.error('storage set failed', err)
    return null
  }
}

export async function storageDelete(key) {
  try {
    window.localStorage.removeItem(fullKey(key))
    return { key, deleted: true }
  } catch (err) {
    console.error('storage delete failed', err)
    return null
  }
}

export async function storageList(prefix = '') {
  try {
    const keys = []
    const searchPrefix = fullKey(prefix)
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i)
      if (k && k.startsWith(searchPrefix)) {
        keys.push(k.slice(PREFIX.length))
      }
    }
    return { keys, prefix }
  } catch (err) {
    console.error('storage list failed', err)
    return { keys: [], prefix }
  }
}
