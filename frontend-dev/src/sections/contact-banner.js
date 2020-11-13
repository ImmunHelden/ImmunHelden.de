import React from 'react'
import { useState } from 'react'
import Button from '../components/button'
import Icon from '../components/icon'
import Container from '../components/container'
import Heading from '../components/heading'
import Input from '../components/input'

export default function ContactBanner() {

  const [modalVisible, setModalVisible] = useState(false)

  return (
    <section className="bg-primary py-20 text-white text-center flex flex-col items-center justify-center">
      <Container narrow>
        <Heading className="mb-10">Du hast noch immer Fragen oder Anregungen?</Heading>
        <Button inverted onClick={() => setModalVisible(true)}>Schreib uns!</Button>
      </Container>

      {
        modalVisible && 
        <div className="fixed inset-0 z-40 flex items-center justify-center p-5">
          <div className="absolute inset-0 bg-black bg-opacity-75" onClick={() => setModalVisible(false)}></div>
          <div className="text-left bg-white shadow-2xl rounded-xl p-10 md:p-12 z-10 relative text-black max-w-4xl w-full">
            <div onClick={() => setModalVisible(false)} className="absolute rotate-45 transform text-primary cursor-pointer p-2 hover:-rotate-45 transition-transform duration-200" style={{ top: '20px', right: '20px' }}>
              <Icon name="plus" />
            </div>

            <Heading level={3} className="mb-8">Schreib uns und wir melden uns bei dir!</Heading>
            <div className="mt-5">
              <Input placeholder="Deine Nachricht" type="textarea" />
            </div>
            <div className="mt-5">
              <Input className="mt-5" placeholder="Deine Email / Telefonnummer" />
            </div>
            <div className="mt-8">
              <Button>Abschicken</Button>
            </div>
          </div>
        </div>
      }
    </section>
  )
}