import React, { useState } from 'react'
import AspectBox from '../components/aspect-box'

import Button from '../components/button'
import Container from '../components/container'
import Heading from '../components/heading'
import Icon from '../components/icon'
import VideoPosterImage from '../assets/images/video-poster.jpg'

export default function Explanation() {

  const [overlay, setOverlay] = useState(true)

  return (
    <Container className="flex flex-col items-center justify-center text-white">
      <div className="relative w-full rounded-2xl overflow-hidden">
        <AspectBox>
          { overlay
            ? <div className="w-full h-full p-16"><img src={VideoPosterImage} className="w-full h-full" /></div>
            : <iframe src="https://www.youtube-nocookie.com/embed/snBcA-AqVGk" title="Erklärvideo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen className="w-full h-full m-0"></iframe> }

        </AspectBox>

        { overlay && <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center text-center py-20 px-6 md:px-32">
          <Heading className="mb-5">Mit Heldentaten durch die <br/> Corona Pandemie</Heading>
          <p className="text-xl">Wir erklären dir kurz und verständlich, warum genesene Patient:innen eine echte Chance für unsere Gesellschaft in der aktuelle Situation darstellen.</p>

          <Button inverted className="mt-16" onClick={ () => setOverlay(false) }>
            <Icon name="play" className="h-6 mr-3" />
            <span>Erklärvideo ansehen</span>
          </Button>
        </div> }
      </div>
    </Container>
  )
}