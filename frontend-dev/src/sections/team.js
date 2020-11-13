import React from 'react'
import Button from '../components/button'
import Container from '../components/container'
import Heading from '../components/heading'
import teamImage from '../assets/images/team.jpeg'

export default function Team({ children }) {
  return (
    <section className="pt-10 py-32">
      <Container narrow>
        <Heading className="mb-10" level={2}>Ehrenamtlich und uneigennützig als Open-Source Projekt entwickelt von Euerem ImmunHelden Team</Heading>
      </Container>
      <div className="w-full relative overflow-hidden">
        <img src={teamImage} className="team-image" alt=""/>
        <img src={teamImage} className="team-image absolute w-full h-full top-0" style={{ left: '100%' }} alt=""/>
      </div>
      <div className="flex justify-center" style={{transform: 'translateY(-50%)'}}>
        <Button>Mehr erfahren</Button>
      </div>
    </section>
  )
}