import { useReveal } from '../hooks/useReveal'
import photoSrc from '../assets/couple-photo.jpg'

export default function Photo() {
  const [ref, visible] = useReveal()

  return (
    <section ref={ref} className={`section section--tight photo reveal${visible ? ' is-visible' : ''}`}>
      <div className="photo-frame">
        <img src={photoSrc} alt="The couple" loading="lazy" />
      </div>
    </section>
  )
}
