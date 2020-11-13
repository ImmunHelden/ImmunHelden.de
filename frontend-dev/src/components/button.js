import React from 'react'
import clsx from 'clsx';

export default function Button({ children, className, inverted = false, outlined = false, size = 'base', onClick = () => {}, href = null, ...rest }) {
  const Tag = href ? 'a' : 'button'
  
  return (
    <Tag 
      onClick={onClick} 
      href={href} {...rest} 
        className={clsx('rounded-full uppercase font-extrabold tracking-wider leading-tight text-lg cursor-pointer duration-200 inline-flex items-center border-2 select-none text-center outline-none shadow hover:shadow-xl transform hover:-translate-y-1 transition-all', className, {
        'px-12 py-4 md:px-20 md:py-6': size === 'base',
        'px-6 py-2 md:px-8 md:py-4': size === 'md',
        'bg-primary text-white border-transparent': !inverted && !outlined,
        'border-white text-white bg-transparent hover:bg-white hover:text-primary': inverted && outlined,
        'bg-white text-primary border-transparent': inverted && !outlined,
        'bg-transparent text-primary border-primary hover:bg-primary hover:text-white': !inverted && outlined,
      })}
      style={{ outline: 'none' }}>
      {children}
    </Tag>
  )
}