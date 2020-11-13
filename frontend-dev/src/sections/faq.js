import clsx from 'clsx';
import React from 'react'
import { useState } from 'react';
import { Collapse } from 'react-collapse';
import Button from '../components/button';
import Container from '../components/container';
import Heading from '../components/heading';
import Icon from '../components/icon';

export default function Faq({ children }) {

  const [activeCollapse, setActiveCollapse] = useState(0)

  const onButtonClick = (index) => {
    if (activeCollapse === index) {
      setActiveCollapse(null)
    } else {
      setActiveCollapse(index)
    }
  }

  const data = [
    {
      label: 'Warum sollte ich nach einer Genesung von COVID-19 Blutplasma spenden?',
      items: [
        {
          label: 'Warum sollte ich nach einer Genesung von COVID-19 Blutplasma spenden?',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        {
          label: 'Warum sollte ich nach einer Genesung von COVID-19 Blutplasma spenden?',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        {
          label: 'Warum sollte ich nach einer Genesung von COVID-19 Blutplasma spenden?',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
      ]
    },
    {
      label: 'Coronavirus SARS-CoV-2 und Immunität',
      items: [
        {
          label: 'Warum sollte ich nach einer Genesung von COVID-19 Blutplasma spenden?',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        {
          label: 'Warum sollte ich nach einer Genesung von COVID-19 Blutplasma spenden?',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        {
          label: 'Warum sollte ich nach einer Genesung von COVID-19 Blutplasma spenden?',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
      ]
    }
  ]

  return (
    <section className="pt-10 pb-32">
      <Container narrow>
        <Heading className="mb-10">Häufig gestellte Fragen</Heading>
        <div>
          {
            data && data.map((category, categoryIndex) => (
              <div className="mt-16">
                <Heading level={2} className="pb-6 border-b">{category.label}</Heading>
                {
                  category.items && category.items.map((item, itemIndex) => (
                    <div key={`${categoryIndex}-${itemIndex}`} className="border-b border-gray-300 last:border-b-0">
                      <button 
                        onClick={() => onButtonClick(`${categoryIndex}-${itemIndex}`)} 
                        className="w-full font-extrabold italic text-2xl py-6 text-left flex items-center justify-between" 
                        style={{ outline: 'none' }}>
                        <span>{item.label}</span>
                        <div className={clsx('transform transition-transform duration-300 ease-in-out text-primary', {
                          'rotate-45': activeCollapse === `${categoryIndex}-${itemIndex}`
                        })}>
                          <Icon name="plus" />
                        </div>
                      </button>
                      <Collapse isOpened={activeCollapse === `${categoryIndex}-${itemIndex}`}>
                        <div className="pt-2 pb-10">{item.content}</div>
                      </Collapse>
                    </div>
                  ))
                }
              </div>
            ))
          }
        </div>

        <div className="flex justify-center mt-12">
          <Button href="https://immunhelden.de/faq/" target="_blank">Alle FAQ anzeigen</Button>
        </div>
      </Container>
    </section>
  )
}