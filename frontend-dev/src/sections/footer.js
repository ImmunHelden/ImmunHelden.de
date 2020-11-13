import React from 'react'
import Container from '../components/container'
import Heading from '../components/heading'
import Icon from '../components/icon'
import Logo from '../components/logo'

export default function Footer() {

  const GenericLink = ({ label, href, children }) => (
    <a href={href} target="_blank" className="mb-3 text-lg hover:text-primary transition-colors duration-150">{children}</a>
  )

  const SocialLink = ({ name }) => (
    <a href="" className="flex items-center mb-5 hover:text-primary transition-colors duration-150">
      <Icon name={name.toLowerCase()} className="w-8 mr-3" />
      <span className="text-lg">{name}</span>
    </a>
  )

  return (
    <section className="bg-black text-white">
      <Container className="py-16 flex flex-col md:flex-row flex-wrap space-y-16 md:space-y-0">
        <div className="-mt-16  w-1/3 flex flex-col items-start">
          <Logo className="mb-8" />
          <GenericLink>Impressum</GenericLink>
          <GenericLink>Datenschutz</GenericLink>
        </div>

        <div className="w-1/3 flex flex-col">
          <Heading level={3} className="mb-8">#WirVsVirus</Heading>
          <GenericLink>Website Hackathon</GenericLink>
          <GenericLink>Bundesregierung</GenericLink>
        </div>

        <div className="w-1/3 flex flex-col">
          <Heading level={3} className="mb-8 whitespace-no-wrap">Follow Us</Heading>
          <SocialLink name="Github" />
          <SocialLink name="Twitter" />
          <SocialLink name="Facebook" />
          <SocialLink name="Instagram" />
        </div>
      </Container>
    </section>
  )
}