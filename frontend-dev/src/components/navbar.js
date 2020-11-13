import React from 'react'
import Container from '../components/container'
import Button from '../components/button'
import Logo from '../components/logo'
import { useEffect, useState, useLayoutEffect } from 'react'
import throttle from 'lodash/throttle'
import clsx from 'clsx'

export default function Navbar() {

  const navItemClasses = 'uppercase font-bold tracking-wider leading-none text-lg cursor-pointer hover:text-primary transition-colors duration-150 whitespace-no-wrap'

  const [scrolled, setScrolled] = useState()
  const [smallDevice, setSmallDevice] = useState()
  const [menuVisible, setMenuVisible] = useState()

  useLayoutEffect(() => {

    setSmallDevice(document.documentElement.clientWidth < 1200)

    const handleScroll = () => setScrolled(window.scrollY > 200)

    window.addEventListener('scroll', throttle(handleScroll, 100))

    return () => {
      window.removeEventListener('scroll', throttle(handleScroll, 100))
    }
  }, [])

  return (
    <div className={clsx('fixed left-0 top-0 right-0 z-40 border-b-2 border-transparent transition-colors duration-300', {
      'text-black bg-white border-gray-200': scrolled,
      'text-white': !scrolled
    })}>
      <Container wide className="flex items-start justify-end relative">
        <div className="absolute top-0 left-0 z-30 pl-5 md:pl-0">
          <Logo showSecondary={!smallDevice} className={clsx({
            'shadow-lg': scrolled
          })} />
        </div>

        {smallDevice && <div className={clsx('py-3 z-20 flex items-center', {
          'text-black': menuVisible
        })}>
          <button className="w-10 h-10 p-2 relative flex items-center justify-center" onClick={() => setMenuVisible(!menuVisible)}>
            <svg className={clsx('absolute inset-0 transform duration-300 transition-all', { 'scale-0 opacity-0 rotate-90': menuVisible })} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
            <svg className={clsx('absolute inset-0 transform duration-300 transition-all', { 'scale-0 opacity-0 rotate-90': !menuVisible })} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>}

        {smallDevice
          ? <div className={clsx('bg-white fixed inset-0 z-10 flex flex-col items-center justify-center py-20 space-y-5 text-black transform transition-all duration-200', {
            'scale-90 invisible opacity-0': !menuVisible,
          })}>
            <a href="" className={navItemClasses}>Video</a>
            <a href="" className={navItemClasses}>Jetzt helfen</a>
            <a href="" className={navItemClasses}>Expertenmeinung</a>
            <a href="" className={navItemClasses}>Das Team</a>
            <a href="" className={navItemClasses}>FAQ</a>

            <Button outlined size="md">
              Für Institutionen
              </Button>
          </div>
          : <div className={clsx('flex justify-between items-center space-x-8 transition-all duration-300', {
            'py-3': scrolled,
            'py-10': !scrolled
          })}>
            <a href="" className={navItemClasses}>Video</a>
            <a href="" className={navItemClasses}>Jetzt helfen</a>
            <a href="" className={navItemClasses}>Expertenmeinung</a>
            <a href="" className={navItemClasses}>Das Team</a>
            <a href="" className={navItemClasses}>FAQ</a>

            <Button outlined inverted={!scrolled} size="md">
              Für Institutionen
            </Button>
          </div>
        }
      </Container>
    </div>
  )
}