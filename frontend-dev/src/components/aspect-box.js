import React from 'react'
import clsx from 'clsx';

export default function AspectBox({ children, ratio = '16/9' }) {

  const ratioSplit = ratio.split('/')
  const width = ratioSplit[0]
  const height = ratioSplit[1]

  return (
    <div className={clsx('w-full relative')} style={{ paddingBottom: `${(height / width) * 100}%` }}>
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  )
}