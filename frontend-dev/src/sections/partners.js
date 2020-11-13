import React from 'react'
import Container from '../components/container'

import logoWirVsVirus from '../assets/images/logos/wir-vs-virus.png'
import logo5Minds from '../assets/images/logos/5-minds.png'
import logoProtoypeFund from '../assets/images/logos/prototype-fund.png'
import logoYouKnow from '../assets/images/logos/youknow.png'
import logoStudioFuchs from '../assets/images/logos/studio-fuchs.png'
import logoVodafone from '../assets/images/logos/vodafone.png'
import logoSdg from '../assets/images/logos/sdg.png'

export default function Partners() {

  const itemClasses = 'p-5 flex-1'
  const logoClasses = 'object-contain h-full w-full'

  const logos = [logoWirVsVirus, logoProtoypeFund, logoYouKnow, logoStudioFuchs, logoVodafone, logoSdg, logo5Minds]

  return (
    <Container className="py-24">
      <h4 className="font-extrabold italic uppercase text-center text-4xl mb-8">Mit Unterstützung von starken Partnern</h4>

      <div className="flex flex-col md:flex-row items-stretch">
        { logos.map((logo, index) => (
          <div key={index} className={itemClasses} style={{ maxHeight: '175px' }}>
            <img src={logo} alt="" className={logoClasses} />
          </div>
        )) }
      </div>
    </Container>
  )
}