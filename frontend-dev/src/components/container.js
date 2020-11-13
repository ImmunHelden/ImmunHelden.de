import React from 'react'
import clsx from 'clsx';

export default function Container({ children, className, narrow = false, wide = false }) {
  return (
    <div className={clsx('container mx-auto px-6 md:px-10', className, {
      'max-w-screen-lg': narrow,
      'max-w-screen-2xl': wide,
    })}>
      {children}
    </div>
  )
}