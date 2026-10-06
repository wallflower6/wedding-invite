import { useRef, useState } from 'react'
import DoorHero from './components/DoorHero'
import Announce from './components/Announce'
import Story from './components/Story'
import Schedule from './components/Schedule'
import Venue from './components/Venue'
import RsvpSection from './components/RsvpSection'
import RSVPForm from "./components/RSVPForm"
import Footer from './components/Footer'

export default function App() {
  const [doorsOpen, setDoorsOpen] = useState(false)
  const announceRef = useRef(null)

  function handleOpenDoors() {
    if (doorsOpen) return
    setDoorsOpen(true)
    setTimeout(() => {
      announceRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 500)
  }

  return (
    <>
      <DoorHero isOpen={doorsOpen} onOpen={handleOpenDoors} />

      <main className="invite">
        <div className="watermark" aria-hidden="true">
          囍
        </div>

        <Announce ref={announceRef} />
        <Schedule />
        <Venue />
        <RSVPForm />
        <Footer />
      </main>
    </>
  )
}
