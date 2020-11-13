import React from 'react'
import Button from '../components/button'
import Container from '../components/container'
import Heading from '../components/heading'
import Input from '../components/input'
import Http from '../services/http'
import { useState } from 'react'

export default function Form() {

  const handleSubmit = async () => {
    // TODO: Fix Url
    // await Http.post('https://hooks.slack.com/services/', {
    //   text: `*Anfrage:* \n ${message} \n *Kontakt:* ${email}` 
    // })
  }

  const [postcode, setPostcode] = useState('')
  const [email, setEmail] = useState('')

  return (
    <section className="py-32">

      <Container narrow>
        <div className="font-body">
          <Heading className="mb-10">Du hast die COVID-19-Erkrankung schon hinter dir und möchtest dich nun gesellschaftlich engagieren?</Heading>
          <p className="text-xl">Dann mach mit und werde Immunheld:in! Wir informieren Dich, wenn es in Deiner Region Möglichkeiten gibt zu helfen.</p>

          <div className="flex flex-wrap my-6">
            <div className="w-1/4">
              <Input placeholder="PLZ" onInput={(v) => setPostcode(v)} />
            </div>
            <div className="w-3/4 pl-6">
              <Input placeholder="Deine E-Mail-Adresse" onInput={(v) => setEmail(v)} />
            </div>
          </div>
          <div>
            <label className="flex">
              <input type="checkbox" className="mr-2" />
              <p>Ich habe die Datenschutzerklärung verstanden und möchte informiert werden, wenn es in meiner Nähe Möglichkeiten gibt zu helfen.</p>
            </label>
          </div>

          <div className="flex justify-center mt-10 mb-6">
            <Button onClick={handleSubmit}>Los gehts!</Button>
          </div>

          <div className="flex justify-center">
          <div className="text-center text-gray-600 max-w-md">
            <small>Mit der Angabe deiner PLZ und deiner E-Mail-Adresse bist du schon dabei und deine Daten geben wir nicht (an Dritte) weiter.</small>
          </div>
          </div>
        </div>
      </Container>

    </section>
  )
}