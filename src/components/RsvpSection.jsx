import { useEffect, useRef, useState } from 'react'
import { CONFIG } from '../config'
import { useReveal } from '../hooks/useReveal'
import { storageGet, storageSet, storageList } from '../lib/storage'

const GUEST_ID_KEY = `${CONFIG.storageNamespace}:guestId`
const RSVP_PREFIX = `${CONFIG.storageNamespace}:rsvp:`

function makeGuestId() {
  return 'g_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export default function RsvpSection() {
  const [ref, visible] = useReveal()

  const guestIdRef = useRef(null)
  const [loadingExisting, setLoadingExisting] = useState(true)

  const [name, setName] = useState('')
  const [attending, setAttending] = useState('') // '' | 'yes' | 'no'
  const [guestCount, setGuestCount] = useState(1)
  const [dietary, setDietary] = useState('no-preference')
  const [message, setMessage] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(null) // holds the saved entry once sent

  // Resolve (or create) this browser's guest id, then load any RSVP
  // already saved for it so a returning guest sees their answer.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      let id
      const existing = await storageGet(GUEST_ID_KEY)
      if (existing && existing.value) {
        id = existing.value
      } else {
        id = makeGuestId()
        await storageSet(GUEST_ID_KEY, id)
      }
      guestIdRef.current = id

      const saved = await storageGet(RSVP_PREFIX + id)
      if (!cancelled && saved && saved.value) {
        const entry = JSON.parse(saved.value)
        setName(entry.name || '')
        setAttending(entry.attending || '')
        setGuestCount(entry.guestCount || 1)
        setDietary(entry.dietary || 'no-preference')
        setMessage(entry.message || '')
        setSubmitted(entry)
      }
      if (!cancelled) setLoadingExisting(false)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!name.trim() || !attending) {
      setError('Please enter your name and choose whether you’ll be attending.')
      return
    }

    const entry = {
      name: name.trim(),
      attending,
      guestCount: attending === 'yes' ? Number(guestCount) || 1 : 0,
      dietary: attending === 'yes' ? dietary : '',
      message: message.trim(),
      submittedAt: new Date().toISOString(),
    }

    setSubmitting(true)
    try {
      let id = guestIdRef.current
      if (!id) {
        id = makeGuestId()
        guestIdRef.current = id
        await storageSet(GUEST_ID_KEY, id)
      }
      const result = await storageSet(RSVP_PREFIX + id, JSON.stringify(entry))
      if (!result) throw new Error('save failed')
      setSubmitted(entry)
    } catch (err) {
      setError("We couldn't save your RSVP just now — please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const firstName = (n) => (n || '').split(' ')[0]

  return (
    <section ref={ref} className={`section rsvp reveal${visible ? ' is-visible' : ''}`}>
      <h2>
        RSVP <span className="cn">敬請回覆</span>
      </h2>
      <p className="eyebrow" style={{ marginTop: '0.6rem' }}>
        Kindly reply by {CONFIG.rsvpDeadline}
      </p>

      {!loadingExisting && submitted ? (
        <div className="rsvp-confirm">
          <div className="stamp">收</div>
          {submitted.attending === 'yes' ? (
            <>
              <h3>Thank you, {firstName(submitted.name)}!</h3>
              <p>
                We've received your RSVP for {submitted.guestCount}{' '}
                {submitted.guestCount === 1 ? 'guest' : 'guests'} and can't wait to celebrate with you.
              </p>
            </>
          ) : (
            <>
              <h3>We'll miss you, {firstName(submitted.name)}.</h3>
              <p>Thank you for letting us know — you'll be there in spirit.</p>
            </>
          )}
          <button type="button" className="rsvp-edit-link" onClick={() => setSubmitted(null)}>
            Edit my response
          </button>
        </div>
      ) : (
        <form className="rsvp-card" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="guestName">Your name(s)</label>
            <input
              type="text"
              id="guestName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Tan"
              maxLength={120}
              required
            />
          </div>

          <div className="field">
            <label>Will you be attending?</label>
            <div className="attend-toggle" role="group" aria-label="Attendance">
              <button
                type="button"
                aria-pressed={attending === 'yes'}
                onClick={() => setAttending('yes')}
              >
                Joyfully accept
              </button>
              <button
                type="button"
                aria-pressed={attending === 'no'}
                onClick={() => setAttending('no')}
              >
                Regretfully decline
              </button>
            </div>
          </div>

          {attending === 'yes' && (
            <>
              <div className="field guests-field is-visible">
                <label htmlFor="guestCount">Number attending (incl. you)</label>
                <input
                  type="number"
                  id="guestCount"
                  min={1}
                  max={10}
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                />
              </div>

              <div className="field guests-field is-visible">
                <label htmlFor="dietary">Dietary preference</label>
                <select id="dietary" value={dietary} onChange={(e) => setDietary(e.target.value)}>
                  <option value="no-preference">No preference</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="halal">Halal</option>
                  <option value="vegan">Vegan</option>
                  <option value="other">Other (mention in message)</option>
                </select>
              </div>
            </>
          )}

          <div className="field">
            <label htmlFor="message">Message for the couple (optional)</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={400}
              placeholder="Well wishes, song requests, questions…"
            />
          </div>

          {error && <p className="rsvp-error">{error}</p>}

          <button type="submit" className="rsvp-submit" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send RSVP'}
          </button>
          <p className="rsvp-note">Your response is saved automatically — no account needed.</p>
        </form>
      )}

      <HostView />
    </section>
  )
}

function HostView() {
  const gateDisabled = !CONFIG.hostPasscode
  const [unlocked, setUnlocked] = useState(gateDisabled)
  const [showGate, setShowGate] = useState(false)
  const [passcodeInput, setPasscodeInput] = useState('')
  const [gateError, setGateError] = useState(false)

  const [expanded, setExpanded] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [entries, setEntries] = useState([])
  const [listError, setListError] = useState('')

  async function loadEntries() {
    setLoading(true)
    setListError('')
    try {
      const listResult = await storageList(RSVP_PREFIX)
      const keys = (listResult && listResult.keys) || []
      const loadedEntries = []
      for (const key of keys) {
        const r = await storageGet(key)
        if (r && r.value) {
          try {
            loadedEntries.push(JSON.parse(r.value))
          } catch (e) {
            /* skip unreadable entry */
          }
        }
      }
      loadedEntries.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
      setEntries(loadedEntries)
      setLoaded(true)
    } catch (err) {
      setListError("Couldn't load RSVPs right now.")
    } finally {
      setLoading(false)
    }
  }

  function handleToggleClick() {
    if (!unlocked) {
      setShowGate(true)
      return
    }
    const next = !expanded
    setExpanded(next)
    if (next && !loaded) loadEntries()
  }

  function attemptUnlock() {
    if (passcodeInput === CONFIG.hostPasscode) {
      setUnlocked(true)
      setShowGate(false)
      setPasscodeInput('')
      setGateError(false)
      setExpanded(true)
      loadEntries()
    } else {
      setGateError(true)
    }
  }

  function exportCsv() {
    if (!entries.length) return
    const headers = ['Name', 'Attending', 'Party size', 'Dietary', 'Message', 'Submitted']
    const rows = entries.map((en) => [
      en.name,
      en.attending === 'yes' ? 'Yes' : 'No',
      en.attending === 'yes' ? en.guestCount : '',
      en.attending === 'yes' ? en.dietary || '' : '',
      en.message || '',
      en.submittedAt || '',
    ])
    const csvEscape = (val) => {
      const str = String(val ?? '')
      return /[",\n]/.test(str) ? '"' + str.replace(/"/g, '""') + '"' : str
    }
    const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(',')).join('\r\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${CONFIG.storageNamespace}-rsvps.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const attendingCount = entries
    .filter((en) => en.attending === 'yes')
    .reduce((sum, en) => sum + (Number(en.guestCount) || 0), 0)

  return (
    <>
      <div className="host-toggle">
        <button type="button" onClick={handleToggleClick}>
          {expanded ? 'Hide' : 'Couple / host view — see all RSVPs'}
        </button>
      </div>

      {showGate && (
        <div className="host-gate">
          <label htmlFor="hostPasscodeInput">Host passcode</label>
          <div className="host-gate__row">
            <input
              type="password"
              id="hostPasscodeInput"
              autoComplete="off"
              placeholder="Enter passcode"
              value={passcodeInput}
              onChange={(e) => setPasscodeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  attemptUnlock()
                }
              }}
              autoFocus
            />
            <button type="button" onClick={attemptUnlock}>
              Unlock
            </button>
          </div>
          {gateError && <p className="host-gate__error">That code doesn't match — try again.</p>}
        </div>
      )}

      {expanded && unlocked && (
        <div className="guest-list">
          <div className="guest-list__actions">
            <button type="button" className="export-btn" disabled={!entries.length} onClick={exportCsv}>
              Export as CSV
            </button>
            {entries.length > 0 && (
              <span className="guest-list__count">
                {entries.length} {entries.length === 1 ? 'response' : 'responses'} · {attendingCount} attending
              </span>
            )}
          </div>

          {loading && <div className="empty">Loading…</div>}

          {!loading && listError && <div className="empty">{listError}</div>}

          {!loading && !listError && entries.length === 0 && <div className="empty">No RSVPs yet.</div>}

          {!loading && !listError && entries.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Attending</th>
                  <th>Party size</th>
                  <th>Dietary</th>
                  <th>Message</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((en, i) => (
                  <tr key={i}>
                    <td>{en.name}</td>
                    <td>{en.attending === 'yes' ? 'Yes' : 'No'}</td>
                    <td>{en.attending === 'yes' ? en.guestCount : '—'}</td>
                    <td>{en.attending === 'yes' ? en.dietary || '—' : '—'}</td>
                    <td>{en.message || '—'}</td>
                    <td>{formatSubmitted(en.submittedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <p className="storage-note">
            RSVPs are stored in this browser only (see <code>src/lib/storage.js</code> to connect a shared
            database so every guest's response lands in one place).
          </p>
        </div>
      )}
    </>
  )
}

function formatSubmitted(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  } catch (e) {
    return ''
  }
}
