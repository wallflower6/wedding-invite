import { forwardRef } from 'react'
import { CONFIG } from '../config'
import { useReveal } from '../hooks/useReveal'

const Announce = forwardRef(function Announce(_props, scrollTargetRef) {
  const [revealRef, visible] = useReveal()
  const [nameFirst, nameRest] = splitNames(CONFIG.namesEn)

  return (
    <section
      ref={(node) => {
        revealRef.current = node
        if (scrollTargetRef) scrollTargetRef.current = node
      }}
      className={`section announce reveal${visible ? ' is-visible' : ''}`}
    >
      <p className="eyebrow">Together with their families</p>
      <svg className="cloud-divider" viewBox="0 0 120 22" aria-hidden="true">
        <path d="M2 14c6-10 14-10 18-2 4-10 14-10 18 0 4-8 12-8 16 0 4-8 12-8 16 0 4-8 12-8 16 0 4-8 12-8 16-2 4-8 10-8 14-2" />
      </svg>
      <h1>
        {nameFirst}
        {nameRest && <span className="amp">&amp;</span>}
        {nameRest}
      </h1>
      {/* <div className="cn-names">{CONFIG.namesCn}</div> */}
      <div className="date-line">
        request the honour of your presence
        <br />
        <strong>{CONFIG.dateEn}</strong>
      </div>
      {/* <div className="date-cn">{CONFIG.dateCn}</div> */}
    </section>
  )
})

// Splits "A & B" into ["A", "B"] for the stacked "&" treatment.
function splitNames(namesEn) {
  const parts = namesEn.split('&').map((s) => s.trim())
  if (parts.length === 2) return parts
  return [namesEn, null]
}

export default Announce
