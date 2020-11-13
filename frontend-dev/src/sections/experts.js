import React from 'react'
import Container from '../components/container'
import Heading from '../components/heading'
import imageDoctor from '../assets/images/doctor.jpg'

export default function Experts({ children }) {
  return (
    <section className="py-40 pb-48">
      <Container narrow className="bubble-container">
        <Heading className="mb-12 bubble-right">Das sagen die Experten</Heading>

        <div className="flex flex-wrap items-center mb-10 bubble-left">
          <img src={imageDoctor} className="rounded-full mr-5" alt=""/>
          <div>
            <Heading level={3}>Christian Torres Reyes</Heading>
            <p className="mt-2 text-xl">Facharzt für Innere Medizin</p>
          </div>
        </div>

        <div className="italic text-xl leading-relaxed bubble-bottom-right">
          <p className="mb-5">
          Als Internist behandele ich im Krankenhaus unmittelbar Patienten, die von der neuen Coronakranheit betroffen sind. Sowohl für die Betroffenen als auch für mich sind 2 Probleme besonders frustrierend: <br/>
          - Wie wenige verlässliche Behandlungsoptionen gegen das Virus zurzeit zur Verfügung stehen <br/>
          - Wie viel wir über diese neue Erkrankung noch nicht wissen <br/>
          </p>

          <p>
          Die Immunantwort von Genesenen, die diesen Kampf bereits gewinnen konnten, beantwortet uns offene Fragen (Forschung) und bietet dringend benötigte Optionen für schwer Erkrankte auf Intensivstationen (Therapie). <br/>
          Ich halte die Plasmaspende in diesem Sinne für eine gute Möglichkeit um als Gesellschaft gemeinsam aktiv an der Front im Kampf gegen das Virus mitzuwirken.
          </p>
        </div>
      </Container>
    </section>
  )
}