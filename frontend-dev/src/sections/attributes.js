import React from 'react'
import Container from '../components/container'
import Heading from '../components/heading'
import Icon from '../components/icon'

export default function Attributes({ children }) {
  return (
    <section>
      <Container className="text-primary">
        <div className="border-4 p-10 border-primary rounded-2xl">
        <div className="flex items-center justify-center mb-8">
          <Heading>Wir sind</Heading>
        </div>

        <div className="flex flex-wrap justify-center items-center space-y-10 md:space-y-0 md:space-x-5">
          <div className="flex items-center justify-center md:px-16">
      	    <Icon name="people" className="mr-4 h-12" />
            <span className="text-xl font-semibold">Ehrenamtlich</span>
          </div>
          <div className="flex items-center justify-center md:px-16">
      	    <Icon name="hand-heart" className="mr-4 h-12" />
            <span className="text-xl font-semibold">Uneigennützig</span>
          </div>
          <div className="flex items-center justify-center md:px-16">
      	    <Icon name="lock-open" className="mr-4 h-12" />
            <span className="text-xl font-semibold">Open Source</span>
          </div>
        </div>
        </div>
      </Container>
    </section>
  )
}