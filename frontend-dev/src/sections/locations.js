import React from 'react'
import Button from '../components/button'
import Heading from '../components/heading'
import locationsImage from '../assets/images/locations.jpg'

export default function Locations() {
  return (
    <section className="py-32">
      <div className="flex flex-col md:flex-row flex-wrap">
        <div className="flex-1 bg-gray-200 p-12 md:p-20 lg:p-32 flex justify-end">
          <div className="w-full md:max-w-xl">
            <Heading className="mb-6">Finde heraus wo du helfen kannst</Heading>
            <p className="leading-loose mb-10">Während deines Kampfes gegen COVID-19 hat dein Immunsystem Antikörper gegen das Virus gebildet. Sie haben dir geholfen, das Virus zu besiegen und finden sich nun in deinem Blutplasma. Wenn du alle gesundheitlichen Kriterien erfüllst, kannst du mit deiner Spende schwer Erkrankten im Kampf gegen COVID-19 helfen. Oder einen Beitrag zur Forschung über Antikörper leisten. Eine passende Spendeeinrichtung in Deiner Nähe findest du auf unserer ImmunHelden Map.</p>
            <Button href="https://immunhelden.de/maps/all/" target="_blank">Standort in meiner Nähe finden</Button>
          </div>
        </div>
        <a href="https://immunhelden.de/maps/all/" target="_blank" className="flex flex-1 bg-primary bg-cover bg-center" style={{ backgroundImage: `url(${locationsImage})` }}></a>
      </div>
    </section>
  )
}