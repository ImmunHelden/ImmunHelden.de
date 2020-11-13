import React from 'react'
import logo from '../assets/images/logos/logo.png'
import wirVsVirusLogo from '../assets/images/logos/wir-vs-virus.png'
import clsx from 'clsx'

export default function Logo({ className, showSecondary = false }) {
  return (
    <div className={clsx('bg-white rounded-b-lg inline-block', className)}>
      <div className="p-5 h-24 md:h-32">
        <img src={logo} alt="Logo" className="h-full"/>
      </div>
      { showSecondary && <div className="p-5 border-t border-gray-300">
        <img src={wirVsVirusLogo} alt="Logo" className="w-full" />
      </div> }
    </div>
  )
}