import { CONFIG } from '../config'

export default function DoorHero({ isOpen, onOpen }) {
  return (
    <section className={`door-hero${isOpen ? ' is-open' : ''}`}>
      <div className="doorway-frame" aria-hidden="true" />
      <div className="door-hero__names">{CONFIG.heroNames}</div>

      <button className="door door--left" aria-label="Open the doors" onClick={onOpen}>
        <span className="door__panel-lines" />
        {/* <span className="door__knocker" /> */}
        <span className="door__char-wrap">囍</span>
      </button>
      <button className="door door--right" aria-label="Open the doors" onClick={onOpen}>
        <span className="door__panel-lines" />
        {/* <span className="door__knocker" /> */}
        <span className="door__char-wrap">囍</span>
      </button>

      <div className="door-hero__hint">
        Tap to enter
        <small>推 門 入 席</small>
      </div>
    </section>
  )
}
