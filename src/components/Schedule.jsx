import { CONFIG } from '../config'
import { useReveal } from '../hooks/useReveal'

export default function Schedule() {
  const [ref, visible] = useReveal()
  return (
    <section ref={ref} className={`section schedule reveal${visible ? ' is-visible' : ''}`}>
      <h2>
        The Evening <span className="cn">婚宴流程</span>
      </h2>
      <div className="timeline">
        {CONFIG.events.map((ev) => (
          <div className="timeline-item" key={ev.time + ev.cn}>
            <time>{ev.time}</time>
            <span className="timeline-dot" aria-hidden="true" />
            <div className="timeline-body">
              <h3>{ev.cn}</h3>
              <p>{ev.en}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
