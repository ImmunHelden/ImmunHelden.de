import React from 'react'
import Container from '../components/container'
import Button from '../components/button'
import headerImage from '../assets/images/header.jpg'

export default function Header({ children }) {

  return (
    <div className="h-screen bg-no-repeat bg-cover flex items-center text-white" style={{ backgroundImage: `url(${headerImage})` }}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="w-full relative z-10">

        <Container narrow>
          <h1 className="italic font-extrabold text-3xl md:text-5xl uppercase leading-tight mb-5">Du hast die COVID-19-Erkrankung schon hinter dir und möchtest dich nun gesellschaftlich engagieren?</h1>
          <h3 className="text-lg md:text-2xl">Dann mach mit und werde Immunheld:in! Wir informieren Dich, wenn es in Deiner Region Möglichkeiten gibt zu helfen.</h3>

          <div className="flex justify-center mt-10 md:mt-16">
            <Button>
              Held*in werden
            </Button>
          </div>
        </Container>
      </div>
    </div>
  )
}