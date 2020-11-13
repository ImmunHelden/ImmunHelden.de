import React from 'react'
import clsx from 'clsx'

export default function Heading({ children, className, level = 1 }) {
  return (
    <div className={clsx('uppercase font-extrabold italic  leading-tight', className, {
      'text-3xl md:text-5xl': level === 1,
      'text-2xl md:text-4xl': level === 2,
      'text-xl md:text-3xl': level === 3,
      'text-lg md:text-2xl': level === 4,
      'text md:text-xl': level === 5,
      'text  md:text-lg': level === 6,
    })}>
      {children}
    </div>
  )
}