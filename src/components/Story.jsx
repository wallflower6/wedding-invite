import { CONFIG } from '../config'
import { useReveal } from '../hooks/useReveal'

export default function Story() {
  const [ref, visible] = useReveal()
  return (
    <section ref={ref} className={`section section--tight story reveal${visible ? ' is-visible' : ''}`}>
      <h2>
        Our Story <span className="cn">緣起</span>
      </h2>
      <p>{CONFIG.storyEn}</p>
      <p className="cn">{CONFIG.storyCn}</p>
    </section>
  )
}
