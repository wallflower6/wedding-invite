import { CONFIG } from '../config'
import { useReveal } from '../hooks/useReveal'

export default function Venue() {
  const [ref, visible] = useReveal()
  return (
    <section ref={ref} className={`section venue reveal${visible ? ' is-visible' : ''}`}>
      <h2>
        Venue <span className="cn">地點</span>
      </h2>
      <div className="venue-card">
        <div className="name">{CONFIG.venueNameCn}</div>
        <div className="name-en">{CONFIG.venueNameEn}</div>
        <address>{CONFIG.venueAddress}</address>
        <a className="map-link" href={CONFIG.venueMapUrl} target="_blank" rel="noopener noreferrer">
          View on map
        </a>
      </div>
    </section>
  )
}
